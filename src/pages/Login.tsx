import React, { useState } from "react";
import { AuthLayout } from "../components/AuthLayout";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useNotification } from "../contexts/NotificationContext";
import { useAppContext } from "../contexts/AppContext";
import { useTheme } from "../contexts/ThemeContext";
import { supabase } from "../lib/supabase";

export function Login({
  onLogin,
  onNavigateToRegister,
}: {
  onLogin: () => void;
  onNavigateToRegister: () => void;
}) {
  const { notify } = useNotification();
  const { setUser, registeredUsers } = useAppContext();
  const { setTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      notify("Vui lòng nhập đầy đủ thông tin", "error");
      return;
    }
    setIsLoading(true);
    
    try {
      const isAdmin = email === 'usernthd2207@gmail.com' && password === 'admin2009';
      
      if (isAdmin) {
        setUser({
          email,
          name: "Admin",
          role: 'admin',
          balance: 0,
          tasksCompleted: 0
        });
        setTheme("light");
        notify("Đăng nhập thành công", "success");
        onLogin();
        return;
      }

      // Query Supabase for the user
      const { data: userToLogin, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !userToLogin) {
        notify("Tài khoản không tồn tại. Vui lòng đăng ký.", "error");
        return;
      }

      if (userToLogin.password !== password) {
        notify("Mật khẩu không chính xác.", "error");
        return;
      }

      setUser({
        email: userToLogin.email,
        name: userToLogin.name,
        role: userToLogin.role || 'user',
        balance: userToLogin.balance || 0,
        tasksCompleted: userToLogin.tasks_completed || 0
      });
      
      setTheme("light");
      notify("Đăng nhập thành công", "success");
      onLogin();
    } catch (e) {
      console.error(e);
      notify("Đã xảy ra lỗi. Vui lòng thử lại.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Đăng nhập"
      subtitle="Chào mừng bạn quay trở lại với SEOTask"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-shadow"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Mật khẩu</label>
            <a
              href="#"
              className="text-sm font-medium text-gray-500 hover:text-black dark:hover:text-white transition-colors"
            >
              Quên mật khẩu?
            </a>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-shadow"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 bg-black text-white dark:bg-white dark:text-black rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? "Đang xử lý..." : "Đăng nhập"}{" "}
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-gray-500">
        Chưa có tài khoản?{" "}
        <button
          onClick={onNavigateToRegister}
          className="font-bold text-black dark:text-white hover:underline"
        >
          Đăng ký ngay
        </button>
      </div>
    </AuthLayout>
  );
}
