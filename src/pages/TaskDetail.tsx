import React, { useState } from "react";
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useNotification } from "../contexts/NotificationContext";

export function TaskDetail({
  taskId,
  navigateTo,
}: {
  taskId: string;
  navigateTo: (page: string) => void;
}) {
  const { notify } = useNotification();
  const [code, setCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    notify("Đã sao chép vào khay nhớ tạm", "info");
  };

  const handleGenerateLink = async () => {
    setIsGeneratingLink(true);

    // Open window immediately to avoid popup blockers
    const newWindow = window.open("about:blank", "_blank");

    if (!newWindow) {
      notify(
        "Trình duyệt của bạn đã chặn popup. Vui lòng cho phép mở popup.",
        "error",
      );
      setIsGeneratingLink(false);
      return;
    }

    newWindow.document.write("Đang tạo liên kết nhiệm vụ, vui lòng đợi...");

    try {
      // Generate a random code in real-time
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(newCode);

      // Simulate API call to generate a link to a blogger site
      const targetUrl = await new Promise<string>((resolve) => {
        setTimeout(() => {
          // In a real app, this would be an API call that returns the generated link
          resolve(`https://seotask-demo.blogspot.com/p/nhiem-vu.html?code=${newCode}`);
        }, 800);
      });

      newWindow.location.href = targetUrl;
      notify("Đã tạo liên kết và mở trang nhiệm vụ", "success");
    } catch (error) {
      newWindow.close();
      notify("Không thể tạo liên kết. Vui lòng thử lại sau.", "error");
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleSubmit = () => {
    if (!code.trim()) {
      notify("Vui lòng nhập mã xác nhận", "error");
      return;
    }

    if (!generatedCode) {
      notify("Lỗi: Không tìm thấy mã nhiệm vụ. Vui lòng tạo lại liên kết (không tải lại trang).", "error");
      return;
    }

    setIsSubmitting(true);
    // Simulate API call for verification
    setTimeout(() => {
      setIsSubmitting(false);
      if (code === generatedCode) {
        notify("Nhiệm vụ hoàn thành! Bạn được cộng phần thưởng", "success");
        navigateTo("tasks");
      } else {
        notify("Mã xác nhận không chính xác. Vui lòng thử lại.", "error");
      }
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigateTo("tasks")}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
      </button>

      <div className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-black/50">
          <div className="flex items-center justify-between mb-2">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
              Nhiệm vụ SEO
            </span>
            <span className="font-bold text-xl text-blue-600 dark:text-blue-400">
              +3,000đ
            </span>
          </div>
          <h1 className="text-2xl font-bold">
            Tìm kiếm từ khóa "Nhà cái uy tín"
          </h1>
        </div>

        <div className="p-6 space-y-8">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold flex-shrink-0">
              1
            </div>
            <div className="flex-1 space-y-3">
              <h3 className="font-semibold text-lg">Truy cập trang nhiệm vụ</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Nhấn nút bên dưới để hệ thống tạo liên kết và tự động mở trang đích (Blogger).
              </p>
              <button
                onClick={handleGenerateLink}
                disabled={isGeneratingLink}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-black text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {isGeneratingLink ? "Đang tạo liên kết..." : "Mở trang nhiệm vụ"}{" "}
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold flex-shrink-0">
              2
            </div>
            <div className="flex-1 space-y-3">
              <h3 className="font-semibold text-lg">Tìm kiếm từ khóa</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Copy từ khóa bên dưới và dán vào ô tìm kiếm của Google.
              </p>
              <div className="flex items-center gap-2 p-3 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-black">
                <code className="flex-1 font-mono text-lg font-bold text-center text-red-500 dark:text-red-400">
                  nhà cái uy tín
                </code>
                <button
                  onClick={() => handleCopy("nhà cái uy tín")}
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                  title="Copy"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold flex-shrink-0">
              3
            </div>
            <div className="flex-1 space-y-3">
              <h3 className="font-semibold text-lg">Tìm website mục tiêu</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Tìm website có domain giống hình bên dưới (thường ở trang 1 hoặc
                2).
              </p>
              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black font-mono text-sm">
                <span className="text-gray-500">https://</span>
                <span className="font-bold text-black dark:text-white">
                  example
                </span>
                <span className="text-gray-500">.com/...</span>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold flex-shrink-0">
              4
            </div>
            <div className="flex-1 space-y-3">
              <h3 className="font-semibold text-lg">Lấy mã xác nhận</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Cuộn xuống cuối bài viết, tìm nút <strong>"Lấy mã ngay"</strong>
                , đợi 60s để nhận mã.
              </p>

              <div className="mt-6 p-5 rounded-xl border-2 border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10">
                <label className="block text-sm font-medium mb-2">
                  Nhập mã xác nhận vào đây:
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="VD: 123456"
                    className="flex-1 px-4 py-3 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow font-mono text-lg"
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-black text-white dark:bg-white dark:text-black rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting ? "Đang kiểm tra..." : "Hoàn thành"}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> (Mã được tạo tự động khi bạn nhấn mở trang nhiệm vụ)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
