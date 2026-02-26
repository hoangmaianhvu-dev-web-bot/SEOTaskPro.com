import React, { useState } from "react";
import {
  Link as LinkIcon,
  Flame,
  Coins,
  Clock,
  Zap,
  PlayCircle,
} from "lucide-react";
import { useNotification } from "../contexts/NotificationContext";
import { useAppContext } from "../contexts/AppContext";

export function Tasks({
  navigateTo,
}: {
  navigateTo: (page: string, taskId?: string) => void;
}) {
  const { notify } = useNotification();
  const { completeTask, tasks } = useAppContext();
  const [generatingTaskId, setGeneratingTaskId] = useState<string | null>(null);

  const handleDoTask = (taskId: string) => {
    navigateTo("task-detail", taskId);
  };

  return (
    <div className="space-y-6">
      {tasks.length === 0 ? (
        <div className="bg-white dark:bg-black p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Hiện tại chưa có nhiệm vụ nào.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800 flex flex-col relative overflow-hidden"
            >
              {/* Animated Money Mascot */}
              <div
                className="absolute -top-2 -right-2 w-16 h-16 animate-bounce"
                style={{ animationDuration: "3s" }}
              >
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full drop-shadow-md"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="#FBBF24"
                    stroke="#D97706"
                    strokeWidth="4"
                  />
                  <circle cx="50" cy="50" r="30" fill="#F59E0B" />
                  <path
                    d="M50 30 L50 70 M40 40 L60 40 M40 60 L60 60"
                    stroke="#FFFBEB"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <text
                    x="50"
                    y="58"
                    fontSize="24"
                    fontWeight="bold"
                    fill="#FFFBEB"
                    textAnchor="middle"
                    fontFamily="sans-serif"
                  >
                    $
                  </text>
                </svg>
              </div>

              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-blue-500" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {task.title}
                  </h3>
                </div>
                {task.isHot && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold">
                    <Flame className="w-3 h-3" /> HOT
                  </div>
                )}
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 w-fit mb-6">
                <Coins className="w-4 h-4" />
                <span className="font-bold">+{task.reward} xu</span>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Tiến độ hôm nay</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {task.progress}/{task.total}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-blue-200 dark:bg-blue-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 dark:bg-blue-500 rounded-full"
                    style={{ width: `${(task.progress / task.total) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 relative z-10">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Mỗi ngày
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4" /> Nhanh
                </div>
              </div>

              <button
                onClick={() => handleDoTask(task.id)}
                disabled={generatingTaskId === task.id}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 relative z-10 shadow-md shadow-blue-500/20"
              >
                {generatingTaskId === task.id ? (
                  "Đang tạo..."
                ) : (
                  <>
                    <PlayCircle className="w-5 h-5" /> Làm nhiệm vụ
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
