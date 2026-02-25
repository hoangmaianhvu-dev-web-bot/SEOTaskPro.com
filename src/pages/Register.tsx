import React, { useState, useEffect, useRef } from "react";
import { AuthLayout } from "../components/AuthLayout";
import { Mail, Lock, User, ArrowRight, ShieldCheck, Timer, X } from "lucide-react";
import { useNotification } from "../contexts/NotificationContext";
import { useAppContext } from "../contexts/AppContext";
import { supabase } from "../lib/supabase";
import emailjs from 'emailjs-com';

export function Register({
  onRegister,
  onNavigateToLogin,
}: {
  onRegister: () => void;
  onNavigateToLogin: () => void;
}) {
  const { notify } = useNotification();
  const { setUser, registeredUsers } = useAppContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showProminent, setShowProminent] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prominentTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isVerificationSent) {
      // Refresh code after 60s
      handleSendVerification();
    }
  }, [timeLeft, isVerificationSent]);

  const handleSendVerification = () => {
    if (!email) {
      notify("Vui lòng nhập email để nhận mã xác thực", "error");
      return;
    }
    
    // Check if email already exists
    if (registeredUsers.some(u => u.email === email)) {
      notify("Email này đã được đăng ký", "error");
      return;
    }

    setIsLoading(true);
    
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);

    // Generate code and show on screen (as requested: "web chỉ gửi mã xác nhận email ở trang đăng nhập ngay trong web thôi")
    setTimeout(() => {
      setIsLoading(false);
      setIsVerificationSent(true);
      setTimeLeft(60); // 60s refresh cycle
      
      // Show prominent notification for 20s
      setShowProminent(true);
      if (prominentTimerRef.current) clearTimeout(prominentTimerRef.current);
      prominentTimerRef.current = setTimeout(() => setShowProminent(false), 20000);
      
      notify("Mã xác thực đã được tạo thành công", "success");
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !verificationCode) {
      notify("Vui lòng nhập đầy đủ thông tin và mã xác thực", "error");
      return;
    }
    if (verificationCode !== generatedCode) {
      notify("Mã xác thực không hợp lệ hoặc đã hết hạn", "error");
      return;
    }

    // Password validation: at least 6 characters, must contain both letters and numbers
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      notify("Mật khẩu phải có ít nhất 6 ký tự, bao gồm cả chữ và số", "error");
      return;
    }

    setIsLoading(true);
    
    try {
      const newUser = {
        email,
        name,
        role: 'user' as const,
        balance: 0,
        tasks_completed: 0
      };

      // Sync to Supabase
      const { error } = await supabase.from('users').insert([newUser]);
      
      if (error) {
        console.error("Supabase insert error:", error);
        notify("Đăng ký thất bại. Vui lòng thử lại.", "error");
        setIsLoading(false);
        return;
      }

      // Register user in AppContext (using camelCase for local state)
      setUser({
        ...newUser,
        tasksCompleted: 0
      });

      notify("Đăng ký thành công", "success");
      onRegister();
    } catch (e) {
      console.error(e);
      notify("Đã xảy ra lỗi. Vui lòng thử lại.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Đăng ký"
      subtitle="Tạo tài khoản mới để bắt đầu kiếm tiền"
    >
      {/* Prominent Notification */}
      {showProminent && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-2xl border-2 border-blue-400 flex items-center gap-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-400/30">
              <div 
                className="h-full bg-white transition-all duration-[20000ms] linear" 
                style={{ width: '0%' }}
                onAnimationStart={(e) => (e.currentTarget.style.width = '100%')}
              />
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium opacity-90 mb-1">Mã xác thực của bạn là:</div>
              <div className="text-3xl font-black tracking-[0.5em] font-mono">{generatedCode}</div>
              <div className="text-xs mt-2 opacity-70 flex items-center gap-1">
                <Timer className="w-3 h-3" /> Mã sẽ tự động làm mới sau {timeLeft}s
              </div>
            </div>
            <button 
              onClick={() => setShowProminent(false)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium">Họ và tên</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập họ và tên"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-shadow"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                disabled={isVerificationSent}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-shadow disabled:opacity-50"
              />
            </div>
            <button
              type="button"
              onClick={handleSendVerification}
              disabled={isLoading || !email}
              className="px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium rounded-xl transition-colors whitespace-nowrap disabled:opacity-50"
            >
              {isVerificationSent ? `Gửi lại (${timeLeft}s)` : "Gửi mã"}
            </button>
          </div>
        </div>

        {isVerificationSent && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Mã xác thực</label>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
                <Timer className="w-3 h-3" /> Làm mới sau {timeLeft}s
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                placeholder="Nhập mã 6 số hiển thị phía trên"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-shadow text-center tracking-widest font-mono text-lg"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Vui lòng nhập mã xác thực đang hiển thị trong thông báo màu xanh phía trên.
            </p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Mật khẩu</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tạo mật khẩu"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-shadow"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 bg-black text-white dark:bg-white dark:text-black rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? "Đang xử lý..." : "Đăng ký tài khoản"}{" "}
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-gray-500">
        Đã có tài khoản?{" "}
        <button
          onClick={onNavigateToLogin}
          className="font-bold text-black dark:text-white hover:underline"
        >
          Đăng nhập
        </button>
      </div>
    </AuthLayout>
  );
}
