import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  Shield,
  Save,
  Camera,
  CheckCircle2,
  AlertCircle,
  Send,
  History,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  LogOut,
  Timer,
} from "lucide-react";
import { useNotification } from "../contexts/NotificationContext";
import { useAppContext } from "../contexts/AppContext";

export function Profile({ onLogout }: { onLogout?: () => void }) {
  const { notify } = useNotification();
  const { user, balance, transactions } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    joinDate: new Date().toLocaleDateString("vi-VN"),
    isEmailVerified: false,
  });

  const [editForm, setEditForm] = useState({ ...profile });
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const [showProminent, setShowProminent] = useState(false);
  const prominentTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isVerificationSent) {
      handleSendVerification();
    }
  }, [timeLeft, isVerificationSent]);

  const handleSave = () => {
    if (!editForm.name.trim() || !editForm.phone.trim()) {
      notify("Vui lòng điền đầy đủ thông tin bắt buộc", "error");
      return;
    }
    setProfile(editForm);
    setIsEditing(false);
    notify("Cập nhật thông tin thành công", "success");
  };

  const handleSendVerification = async () => {
    if (!profile.email) return;

    setIsLoading(true);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);

    // Simulate sending email and show it on screen
    setTimeout(() => {
      setIsLoading(false);
      setIsVerificationSent(true);
      setTimeLeft(60);
      
      setShowProminent(true);
      if (prominentTimerRef.current) clearTimeout(prominentTimerRef.current);
      prominentTimerRef.current = setTimeout(() => setShowProminent(false), 20000);
      
      notify("Mã xác thực đã được tạo thành công", "success");
    }, 1500);
  };

  const handleVerifyEmail = () => {
    if (!verificationCode.trim()) {
      notify("Vui lòng nhập mã xác thực", "error");
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      if (verificationCode === generatedCode) {
        setProfile((prev) => ({ ...prev, isEmailVerified: true }));
        setEditForm((prev) => ({ ...prev, isEmailVerified: true }));
        setIsVerificationSent(false);
        setVerificationCode("");
        notify("Xác thực email thành công", "success");
      } else {
        notify("Mã xác thực không chính xác hoặc đã hết hạn", "error");
      }
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        {/* Header Cover */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-900 dark:to-indigo-900"></div>

        <div className="px-6 sm:px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full border-4 border-white dark:border-[#121212] bg-gray-200 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                <User className="w-12 h-12 text-gray-500 dark:text-gray-400" />
              </div>
              <button className="absolute bottom-0 right-0 p-1.5 bg-black text-white dark:bg-white dark:text-black rounded-full shadow-md hover:scale-110 transition-transform">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-gray-100 dark:bg-black text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                Chỉnh sửa hồ sơ
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm({ ...profile });
                  }}
                  className="px-4 py-2 bg-gray-100 dark:bg-black text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black text-sm font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Lưu
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-1">{profile.name}</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <User className="w-4 h-4" /> Họ và tên
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    />
                  ) : (
                    <div className="font-medium">{profile.name}</div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email
                  </label>
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium text-gray-600 dark:text-gray-300">
                      {profile.email}
                    </div>
                    {profile.isEmailVerified ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Đã xác thực
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-full">
                        <AlertCircle className="w-3 h-3" /> Chưa xác thực
                      </span>
                    )}
                  </div>
                  {isEditing && (
                    <p className="text-xs text-gray-500">
                      Email không thể thay đổi
                    </p>
                  )}

                  {!profile.isEmailVerified && !isEditing && (
                    <div className="mt-3 p-4 bg-gray-50 dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800">
                      {!isVerificationSent ? (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Xác thực email để bảo vệ tài khoản của bạn.
                          </p>
                          <button
                            onClick={handleSendVerification}
                            disabled={isLoading}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-black text-white dark:bg-white dark:text-black text-sm font-medium rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap disabled:opacity-50"
                          >
                            <Send className="w-4 h-4" /> {isLoading ? "Đang gửi..." : "Gửi mã"}
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Nhập mã xác thực 6 số đã được gửi đến email của bạn.
                            </p>
                            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
                              <Timer className="w-3 h-3" /> {timeLeft}s
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              maxLength={6}
                              value={verificationCode}
                              onChange={(e) =>
                                setVerificationCode(e.target.value.replace(/\D/g, ''))
                              }
                              placeholder="Nhập mã..."
                              className="flex-1 px-3 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white font-mono text-center tracking-widest"
                            />
                            <button
                              onClick={handleVerifyEmail}
                              disabled={isVerifying}
                              className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                              {isVerifying ? "Đang xử lý..." : "Xác nhận"}
                            </button>
                          </div>
                          <button 
                            onClick={handleSendVerification}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Gửi lại mã mới
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Số điện thoại
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    />
                  ) : (
                    <div className="font-medium">{profile.phone}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-black p-5 rounded-xl border border-gray-200 dark:border-gray-800">
                <h3 className="font-semibold mb-4">Thông tin tài khoản</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                    <span className="text-gray-500 dark:text-gray-400">
                      Ngày tham gia
                    </span>
                    <span className="font-medium">{profile.joinDate}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                    <span className="text-gray-500 dark:text-gray-400">
                      Nhiệm vụ đã làm
                    </span>
                    <span className="font-medium">{user?.tasksCompleted || 0}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500 dark:text-gray-400">
                      Tổng thu nhập
                    </span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {balance.toLocaleString()}đ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
          <History className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-lg">Lịch sử giao dịch</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {transactions.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Chưa có giao dịch nào.
            </div>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      tx.type === "task"
                        ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
                    }`}
                  >
                    {tx.type === "task" ? (
                      <ArrowDownLeft className="w-5 h-5" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium mb-1">{tx.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {tx.date}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          tx.status === "success"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : tx.status === "rejected"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                        }`}
                      >
                        {tx.status === "success" ? "Thành công" : tx.status === "rejected" ? "Từ chối" : "Đang xử lý"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-bold text-lg ${
                      tx.amount > 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {tx.amount > 0 ? "+" : ""}
                    {tx.amount.toLocaleString()}đ
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Logout Button */}
      {onLogout && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 rounded-xl font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
