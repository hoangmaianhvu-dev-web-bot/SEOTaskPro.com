import React, { useState } from "react";
import {
  HeadphonesIcon,
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  ChevronRight,
  Send,
  RotateCcw,
  ShieldCheck,
  Zap,
  Users,
  CheckCircle2,
  Smile,
  Info,
} from "lucide-react";
import { useNotification } from "../contexts/NotificationContext";

export function Support() {
  const { notify } = useNotification();
  const [formData, setFormData] = useState({
    name: "NHẬP TÊN",
    email: "NHẬP EMAIL",
    subject: "",
    content: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.content) {
      notify("Vui lòng điền đầy đủ thông tin", "error");
      return;
    }
    notify("Đã gửi yêu cầu hỗ trợ thành công", "success");
    setFormData({ ...formData, subject: "", content: "" });
  };

  const faqs = [
    "Làm sao để kiếm xu?",
    "Bao lâu thì nhận được xu?",
    "Làm sao để đổi quà?",
    "Quên mật khẩu phải làm sao?",
    "Khi nào thì nhận được quà?",
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 bg-blue-100 dark:bg-blue-900/20 p-4 sm:p-8 rounded-3xl">
      <div className="text-center space-y-4 py-8">
        <div className="flex items-center justify-center gap-3">
          <HeadphonesIcon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Trung tâm hỗ trợ
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Chúng tôi luôn sẵn sàng giúp đỡ bạn 24/7
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Contact Info */}
          <div className="bg-white dark:bg-black rounded-2xl border border-blue-100 dark:border-gray-800 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
              <Info className="w-5 h-5 text-blue-500" /> Thông tin liên hệ
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50 dark:bg-black">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white mb-1">
                    Địa chỉ
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50 dark:bg-black">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white mb-1">
                    Số điện thoại
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Miễn phí 24/7
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50 dark:bg-black">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white mb-1">
                    Email
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                   
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Phản hồi trong 24h
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50 dark:bg-black">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white mb-1">
                    Giờ làm việc
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Thứ 2 - Thứ 7: 8:00 - 22:00
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Chủ nhật: 8:00 - 17:00
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white dark:bg-black rounded-2xl border border-blue-100 dark:border-gray-800 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
              <Info className="w-5 h-5 text-blue-500" /> Câu hỏi thường gặp
            </h2>
            <div className="space-y-2">
              {faqs.map((faq, idx) => (
                <button
                  key={idx}
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-blue-50 dark:hover:bg-black rounded-lg transition-colors group"
                >
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-white">
                    {faq}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                </button>
              ))}
            </div>
          </div>

          {/* Live Chat */}
          <div className="bg-blue-600 dark:bg-black rounded-2xl border border-blue-500 dark:border-gray-800 p-6 text-center shadow-lg shadow-blue-500/20">
            <div className="w-12 h-12 rounded-full bg-white/20 dark:bg-[#2a2a2a] flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-white dark:text-gray-400" />
            </div>
            <h3 className="font-bold text-white mb-2">Chat trực tuyến</h3>
            <p className="text-sm text-blue-100 dark:text-gray-500">
              Nhân viên hỗ trợ trực tuyến 24/7
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-black rounded-2xl border border-blue-100 dark:border-gray-800 p-6 sm:p-8 shadow-sm">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              <div className="bg-blue-50 dark:bg-black rounded-xl p-6 text-center border border-blue-100 dark:border-gray-800/50">
                <Clock className="w-8 h-8 text-blue-500 dark:text-gray-400 mx-auto mb-3" />
                <div className="text-sm text-gray-600 dark:text-gray-500 mb-2">
                  Thời gian phản hồi
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  &lt; 30 phút
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-black rounded-xl p-6 text-center border border-blue-100 dark:border-gray-800/50">
                <CheckCircle2 className="w-8 h-8 text-blue-500 dark:text-gray-400 mx-auto mb-3" />
                <div className="text-sm text-gray-600 dark:text-gray-500 mb-2">
                  Tỷ lệ giải quyết
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  98%
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-black rounded-xl p-6 text-center border border-blue-100 dark:border-gray-800/50">
                <Smile className="w-8 h-8 text-blue-500 dark:text-gray-400 mx-auto mb-3" />
                <div className="text-sm text-gray-600 dark:text-gray-500 mb-2">
                  Đánh giá
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  4.9/5
                </div>
              </div>
            </div>

            {/* Form */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-8">
              <Send className="w-6 h-6 text-blue-500" /> Gửi yêu cầu hỗ trợ
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Tóm tắt nội dung hỗ trợ"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nội dung <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  placeholder="Mô tả chi tiết vấn đề của bạn..."
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-blue-500 text-gray-900 dark:text-white resize-none"
                ></textarea>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Gửi yêu cầu
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, subject: "", content: "" })
                  }
                  className="px-6 py-3 bg-transparent border border-gray-300 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] text-gray-600 dark:text-gray-300 rounded-xl font-bold transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Nhập lại
                </button>
              </div>
            </form>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 pt-10 border-t border-gray-200 dark:border-gray-800/50">
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-black flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-6 h-6 text-blue-500 dark:text-gray-400" />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                  Bảo mật
                </h4>
                <p className="text-xs text-gray-500">Thông tin được bảo mật</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-black flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-blue-500 dark:text-gray-400" />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                  Phản hồi nhanh
                </h4>
                <p className="text-xs text-gray-500">Trong vòng 30 phút</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-black flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-blue-500 dark:text-gray-400" />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                  Hỗ trợ tận tình
                </h4>
                <p className="text-xs text-gray-500">Đội ngũ chuyên nghiệp</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
