import React, { useState, useEffect } from "react";
import {
  Users,
  ListTodo,
  Wallet,
  Settings,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Play,
  Pause,
  Activity,
  Search,
  Bell,
  Send,
  Plus,
  Trash2,
  MessageSquare,
  Check,
  CreditCard,
} from "lucide-react";
import { useNotification } from "../contexts/NotificationContext";
import { useAppContext } from "../contexts/AppContext";
import { supabase } from "../lib/supabase";

export function AdminDashboard() {
  const { notify } = useNotification();
  const { 
    withdrawals, 
    approveWithdrawal, 
    rejectWithdrawal, 
    deposits, 
    approveDeposit, 
    rejectDeposit, 
    registeredUsers, 
    deleteUser,
    setRegisteredUsers,
    tasks,
    setTasks,
    user,
    announcements,
    addAnnouncement
  } = useAppContext();
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "users"
    | "tasks"
    | "withdrawals"
    | "deposits"
    | "automation"
    | "announcements"
    | "support"
  >("overview");

  const [automationSettings, setAutomationSettings] = useState({
    autoApproveTasks: true,
    autoApproveWithdrawals: false,
    fraudDetection: true,
    autoAssignTasks: true,
  });

  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    content: "",
    type: "info",
  });

  const toggleAutomation = (key: keyof typeof automationSettings) => {
    setAutomationSettings((prev) => {
      const newState = { ...prev, [key]: !prev[key] };
      // Use setTimeout to avoid calling notify during render
      setTimeout(() => {
        notify(
          `Đã ${newState[key] ? "bật" : "tắt"} tính năng tự động hóa`,
          "success",
        );
      }, 0);
      return newState;
    });
  };

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementForm.title || !announcementForm.content) {
      notify("Vui lòng nhập đầy đủ tiêu đề và nội dung", "error");
      return;
    }

    addAnnouncement({
      title: announcementForm.title,
      content: announcementForm.content,
      type: announcementForm.type,
    });
    notify("Đã gửi thông báo đến tất cả người dùng", "success");
    setAnnouncementForm({ title: "", content: "", type: "info" });
  };

  const handleDeleteAnnouncement = async (id: number) => {
    // Note: We don't have a deleteAnnouncement in AppContext yet, 
    // but we can add it or just notify for now.
    notify("Tính năng xóa thông báo đang được cập nhật", "info");
  };

  const [supportRequests, setSupportRequests] = useState<any[]>([]);

  const handleResolveSupport = (id: number) => {
    setSupportRequests(
      supportRequests.map((req) =>
        req.id === id ? { ...req, status: "resolved" } : req,
      ),
    );
    notify("Đã đánh dấu xử lý xong yêu cầu", "success");
  };

  const stats = [
    {
      label: "Tổng người dùng",
      value: "1",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Nhiệm vụ đang chạy",
      value: "6",
      icon: ListTodo,
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-900/20",
    },
    {
      label: "Yêu cầu rút tiền",
      value: withdrawals.filter(w => w.status === 'pending').length.toString(),
      icon: Wallet,
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      label: "Yêu cầu nạp game",
      value: deposits.filter(d => d.status === 'pending').length.toString(),
      icon: CreditCard,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Cảnh báo gian lận",
      value: "0",
      icon: ShieldAlert,
      color: "text-red-500",
      bg: "bg-red-50 dark:bg-red-900/20",
    },
  ];

  const recentWithdrawals = withdrawals.filter(w => w.status === 'pending').slice(0, 5);

  const [userSearch, setUserSearch] = useState("");

  const filteredUsers = registeredUsers.filter(u => 
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.name.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleAdjustBalance = async (email: string) => {
    const amountStr = window.prompt("Nhập số tiền muốn cộng/trừ (VD: 10000 hoặc -5000):");
    if (amountStr === null) return;
    
    const amount = parseInt(amountStr);
    if (isNaN(amount)) {
      notify("Số tiền không hợp lệ", "error");
      return;
    }

    setRegisteredUsers(prev => prev.map(u => {
      if (u.email === email) {
        return { ...u, balance: u.balance + amount };
      }
      return u;
    }));
    notify(`Đã ${amount > 0 ? 'cộng' : 'trừ'} ${Math.abs(amount).toLocaleString()}đ cho ${email}`, "success");

    try {
      const { data: userToUpdate } = await supabase.from('users').select('balance').eq('email', email).single();
      if (userToUpdate) {
        await supabase.from('users').update({ balance: (userToUpdate as any).balance + amount }).eq('email', email);
      }
    } catch (e) { console.error(e); }
  };

  const [taskForm, setTaskForm] = useState({
    title: "",
    reward: 150,
    total: 1,
    targetUrl: "https://google.com.vn",
    isHot: true
  });

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title || !taskForm.targetUrl) {
      notify("Vui lòng nhập đầy đủ thông tin", "error");
      return;
    }

    const newTask = {
      ...taskForm,
      id: "T" + Date.now().toString().slice(-4),
      progress: 0
    };

    setTasks(prev => [...prev, newTask]);
    setTaskForm({
      title: "",
      reward: 150,
      total: 1,
      targetUrl: "https://google.com.vn",
      isHot: true
    });
    notify("Đã thêm nhiệm vụ mới", "success");

    try {
      await supabase.from('tasks').insert([newTask]);
    } catch (e) { console.error(e); }
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa nhiệm vụ này?")) {
      setTasks(prev => prev.filter(t => t.id !== id));
      notify("Đã xóa nhiệm vụ", "success");

      try {
        await supabase.from('tasks').delete().eq('id', id);
      } catch (e) { console.error(e); }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Bảng điều khiển Admin</h1>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-sm font-medium w-fit">
          <Activity className="w-4 h-4" /> Hệ thống đang hoạt động
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-2 border-b border-gray-200 dark:border-gray-800 scrollbar-hide">
        {[
          { id: "overview", label: "Tổng quan" },
          { id: "users", label: "Người dùng" },
          { id: "tasks", label: "Nhiệm vụ" },
          { id: "withdrawals", label: "Duyệt rút tiền" },
          { id: "deposits", label: "Duyệt nạp tiền" },
          { id: "automation", label: "Tự động hóa" },
          { id: "announcements", label: "Thông báo" },
          { id: "support", label: "Hỗ trợ" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1a1a1a]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-black p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bg}`}
                  >
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
                  {stat.label}
                </div>
                <div className="text-3xl font-bold tracking-tight">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-4">
                Trạng thái tự động hóa
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800">
                  <div>
                    <div className="font-medium">Duyệt nhiệm vụ tự động</div>
                    <div className="text-sm text-gray-500">
                      Tự động duyệt khi user nhập đúng mã
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold ${automationSettings.autoApproveTasks ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}
                  >
                    {automationSettings.autoApproveTasks
                      ? "ĐANG BẬT"
                      : "ĐÃ TẮT"}
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800">
                  <div>
                    <div className="font-medium">Phát hiện gian lận (AI)</div>
                    <div className="text-sm text-gray-500">
                      Chặn IP trùng lặp, click ảo
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold ${automationSettings.fraudDetection ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}
                  >
                    {automationSettings.fraudDetection ? "ĐANG BẬT" : "ĐÃ TẮT"}
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Withdrawals */}
            <div className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Yêu cầu rút tiền mới</h3>
                <button
                  onClick={() => setActiveTab("withdrawals")}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Xem tất cả
                </button>
              </div>
              <div className="space-y-3">
                {recentWithdrawals.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    Không có yêu cầu rút tiền nào.
                  </div>
                ) : (
                  recentWithdrawals.map((w) => (
                    <div
                      key={w.id}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors"
                    >
                      <div>
                        <div className="font-medium text-sm">{w.userEmail}</div>
                        <div className="text-xs text-gray-500">{w.bank} - {w.account}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm">
                          {w.amount.toLocaleString()}đ
                        </div>
                        <div className="text-xs text-orange-500 font-medium">
                          Chờ duyệt
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "automation" && (
        <div className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold">Cài đặt tự động hóa hệ thống</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Quản lý các tiến trình chạy ngầm giúp giảm tải công việc cho
              Admin.
            </p>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {/* Setting Item */}
            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" /> Tự động
                  duyệt nhiệm vụ
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
                  Hệ thống tự động kiểm tra mã xác nhận của user. Nếu đúng, tự
                  động cộng tiền vào tài khoản mà không cần Admin duyệt tay.
                </p>
              </div>
              <button
                onClick={() => toggleAutomation("autoApproveTasks")}
                className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-colors w-full sm:w-auto ${
                  automationSettings.autoApproveTasks
                    ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                }`}
              >
                {automationSettings.autoApproveTasks ? (
                  <>
                    <Pause className="w-4 h-4" /> Tạm dừng
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" /> Kích hoạt
                  </>
                )}
              </button>
            </div>

            {/* Setting Item */}
            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-blue-500" /> Tự động duyệt rút
                  tiền (Dưới 100k)
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
                  Tự động gọi API ngân hàng để chuyển khoản cho các lệnh rút
                  tiền hợp lệ dưới 100,000đ.
                </p>
              </div>
              <button
                onClick={() => toggleAutomation("autoApproveWithdrawals")}
                className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-colors w-full sm:w-auto ${
                  automationSettings.autoApproveWithdrawals
                    ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                }`}
              >
                {automationSettings.autoApproveWithdrawals ? (
                  <>
                    <Pause className="w-4 h-4" /> Tạm dừng
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" /> Kích hoạt
                  </>
                )}
              </button>
            </div>

            {/* Setting Item */}
            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-orange-500" /> Hệ thống
                  Anti-Cheat (AI)
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
                  Tự động phát hiện và khóa tài khoản có hành vi gian lận: dùng
                  tool click, trùng IP, nhiều tài khoản trên 1 thiết bị.
                </p>
              </div>
              <button
                onClick={() => toggleAutomation("fraudDetection")}
                className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-colors w-full sm:w-auto ${
                  automationSettings.fraudDetection
                    ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                }`}
              >
                {automationSettings.fraudDetection ? (
                  <>
                    <Pause className="w-4 h-4" /> Tạm dừng
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" /> Kích hoạt
                  </>
                )}
              </button>
            </div>

            {/* Setting Item */}
            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <ListTodo className="w-5 h-5 text-purple-500" /> Tự động phân
                  bổ nhiệm vụ
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
                  Thuật toán tự động phân chia nhiệm vụ cho người dùng dựa trên
                  lịch sử hoạt động và độ uy tín của tài khoản.
                </p>
              </div>
              <button
                onClick={() => toggleAutomation("autoAssignTasks")}
                className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-colors w-full sm:w-auto ${
                  automationSettings.autoAssignTasks
                    ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                }`}
              >
                {automationSettings.autoAssignTasks ? (
                  <>
                    <Pause className="w-4 h-4" /> Tạm dừng
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" /> Kích hoạt
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "announcements" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-500" /> Tạo thông báo mới
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Thông báo sẽ hiển thị dưới dạng popup cho tất cả người dùng khi
                họ đăng nhập.
              </p>
            </div>
            <div className="p-6">
              <form onSubmit={handleSendAnnouncement} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tiêu đề thông báo
                  </label>
                  <input
                    type="text"
                    value={announcementForm.title}
                    onChange={(e) =>
                      setAnnouncementForm({
                        ...announcementForm,
                        title: e.target.value,
                      })
                    }
                    placeholder="VD: Cập nhật hệ thống mới"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nội dung (Hỗ trợ xuống dòng)
                  </label>
                  <textarea
                    rows={6}
                    value={announcementForm.content}
                    onChange={(e) =>
                      setAnnouncementForm({
                        ...announcementForm,
                        content: e.target.value,
                      })
                    }
                    placeholder="Nhập nội dung thông báo..."
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  ></textarea>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Gửi thông báo
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold">Lịch sử thông báo</h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {announcements.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  Chưa có thông báo nào.
                </div>
              ) : (
                announcements.map((announcement) => (
                  <div key={announcement.id} className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg">
                        {announcement.title}
                      </h3>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-500">
                          {announcement.time}
                        </span>
                        <button
                          onClick={() =>
                            handleDeleteAnnouncement(announcement.id)
                          }
                          className="text-red-500 hover:text-red-600 transition-colors"
                          title="Xóa thông báo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-wrap">
                      {announcement.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "support" && (
        <div className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-500" /> Yêu cầu hỗ trợ
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Quản lý và phản hồi các yêu cầu hỗ trợ từ người dùng.
            </p>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {supportRequests.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Không có yêu cầu hỗ trợ nào.
              </div>
            ) : (
              supportRequests.map((request) => (
                <div key={request.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-lg">{request.subject}</h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            request.status === "resolved"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                          }`}
                        >
                          {request.status === "resolved"
                            ? "Đã xử lý"
                            : "Chờ xử lý"}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <span>{request.user}</span>
                        <span>•</span>
                        <span>{request.time}</span>
                      </div>
                    </div>
                    {request.status === "pending" && (
                      <button
                        onClick={() => handleResolveSupport(request.id)}
                        className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" /> Đánh dấu đã xử lý
                      </button>
                    )}
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-[#1a1a1a] rounded-xl text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {request.content}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "withdrawals" && (
        <div className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Wallet className="w-5 h-5 text-blue-500" /> Quản lý rút tiền
            </h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {withdrawals.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Không có yêu cầu rút tiền nào.
              </div>
            ) : (
              withdrawals.map((w) => (
                <div key={w.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-lg">{w.amount.toLocaleString()}đ</h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          w.status === "success"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : w.status === "rejected"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                        }`}
                      >
                        {w.status === "success" ? "Đã duyệt" : w.status === "rejected" ? "Từ chối" : "Chờ xử lý"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 flex flex-col gap-1">
                      <span>Người dùng: {w.userEmail}</span>
                      <span>Ngân hàng: {w.bank}</span>
                      <span>Số tài khoản: {w.account}</span>
                      <span>Thời gian: {w.date}</span>
                    </div>
                  </div>
                  {w.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          approveWithdrawal(w.id);
                          notify("Đã duyệt yêu cầu rút tiền", "success");
                        }}
                        className="px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Duyệt
                      </button>
                      <button
                        onClick={() => {
                          rejectWithdrawal(w.id);
                          notify("Đã từ chối yêu cầu rút tiền", "error");
                        }}
                        className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" /> Từ chối
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "deposits" && (
        <div className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-500" /> Quản lý nạp tiền game
            </h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {deposits.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Không có yêu cầu nạp tiền nào.
              </div>
            ) : (
              deposits.map((d) => (
                <div key={d.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-lg">{d.amount.toLocaleString()}đ</h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          d.status === "success"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : d.status === "rejected"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                        }`}
                      >
                        {d.status === "success" ? "Đã duyệt" : d.status === "rejected" ? "Từ chối" : "Chờ xử lý"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 flex flex-col gap-1">
                      <div className="font-medium text-gray-900 dark:text-white">{d.game} - {d.package_name}</div>
                      <span>Người dùng: {d.user}</span>
                      <span>ID Game: {d.gameId}</span>
                      <span>Thời gian: {d.date}</span>
                    </div>
                  </div>
                  {d.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          approveDeposit(d.id);
                          notify("Đã duyệt yêu cầu nạp tiền", "success");
                        }}
                        className="px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Duyệt
                      </button>
                      <button
                        onClick={() => {
                          rejectDeposit(d.id);
                          notify("Đã từ chối yêu cầu nạp tiền", "error");
                        }}
                        className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" /> Từ chối
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" /> Quản lý người dùng ({registeredUsers.length})
              </h2>
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm email hoặc tên..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-black border-b border-gray-200 dark:border-gray-800">
                    <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Người dùng</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Vai trò</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Số dư</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Nhiệm vụ</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        Không tìm thấy người dùng nào.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.email} className="hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 dark:text-white">{u.name}</div>
                              <div className="text-sm text-gray-500">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                            u.role === 'admin' 
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' 
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-blue-600 dark:text-blue-400">
                            {u.balance.toLocaleString()}đ
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{u.tasksCompleted}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleAdjustBalance(u.email)}
                              className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                              title="Điều chỉnh số dư"
                            >
                              <CreditCard className="w-5 h-5" />
                            </button>
                            {u.role !== 'admin' && (
                              <button
                                onClick={() => {
                                  if (window.confirm(`Bạn có chắc muốn xóa người dùng ${u.email}?`)) {
                                    deleteUser(u.email);
                                  }
                                }}
                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Xóa người dùng"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "tasks" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <ListTodo className="w-5 h-5 text-blue-500" /> Thêm nhiệm vụ mới
            </h2>
            <form onSubmit={handleAddTask} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Tiêu đề</label>
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={e => setTaskForm({...taskForm, title: e.target.value})}
                  placeholder="VD: TRAFFICUSER"
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Phần thưởng (đ)</label>
                <input
                  type="number"
                  value={taskForm.reward}
                  onChange={e => setTaskForm({...taskForm, reward: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Số lượt tối đa</label>
                <input
                  type="number"
                  value={taskForm.total}
                  onChange={e => setTaskForm({...taskForm, total: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">URL mục tiêu</label>
                <input
                  type="text"
                  value={taskForm.targetUrl}
                  onChange={e => setTaskForm({...taskForm, targetUrl: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 bg-black text-white dark:bg-white dark:text-black rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" /> Thêm nhiệm vụ
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold">Danh sách nhiệm vụ ({tasks.length})</h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {tasks.length === 0 ? (
                <div className="p-12 text-center text-gray-500">Chưa có nhiệm vụ nào.</div>
              ) : (
                tasks.map(t => (
                  <div key={t.id} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <ListTodo className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-bold text-lg flex items-center gap-2">
                          {t.title}
                          {t.isHot && <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-[10px] font-bold uppercase">Hot</span>}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-3">
                          <span>Thưởng: {t.reward.toLocaleString()}đ</span>
                          <span>Lượt: {t.progress}/{t.total}</span>
                          <span className="truncate max-w-[200px]">{t.targetUrl}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteTask(t.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "automation" && (
        <div className="bg-white dark:bg-black p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <Activity className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">Tự động hóa</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Hệ thống đang hoạt động ổn định. Các tính năng tự động hóa nâng cao đang được phát triển.
          </p>
        </div>
      )}
    </div>
  );
}
