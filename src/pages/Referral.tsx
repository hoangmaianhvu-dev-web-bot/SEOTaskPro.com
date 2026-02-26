import React, { useState } from "react";
import {
  Users,
  Copy,
  Share2,
  Gift,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { useNotification } from "../contexts/NotificationContext";

export function Referral() {
  const { notify } = useNotification();
  const referralCode = "SEOTASK2024";
  const referralLink = `https://seo-task-pro-com.vercel.app/register?ref=${referralCode}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    notify("Đã sao chép vào khay nhớ tạm", "info");
  };

  const stats = [
    {
      label: "Bạn bè đã mời",
      value: "0",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Hoa hồng nhận được",
      value: "0đ",
      icon: Gift,
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-900/20",
    },
    {
      label: "Tỷ lệ hoa hồng",
      value: "10%",
      icon: TrendingUp,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-900/20",
    },
  ];

  const referredFriends: any[] = [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-900 dark:to-indigo-900 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Giới thiệu bạn bè</h1>
          <p className="text-blue-100 mb-8 max-w-lg">
            Nhận ngay 10% hoa hồng từ thu nhập của người được giới thiệu. Không
            giới hạn số lượng bạn bè và thu nhập!
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-blue-100 text-sm mb-1">Mã giới thiệu</div>
                <div className="font-mono font-bold text-xl tracking-wider">
                  {referralCode}
                </div>
              </div>
              <button
                onClick={() => handleCopy(referralCode)}
                className="p-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                title="Copy mã"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex items-center justify-between">
              <div className="overflow-hidden pr-4">
                <div className="text-blue-100 text-sm mb-1">
                  Link giới thiệu
                </div>
                <div className="font-mono text-sm truncate opacity-90">
                  {referralLink}
                </div>
              </div>
              <button
                onClick={() => handleCopy(referralLink)}
                className="p-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex-shrink-0"
                title="Copy link"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-black p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${stat.bg}`}
            >
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
              {stat.label}
            </div>
            <div className="text-2xl font-bold tracking-tight">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h3 className="font-semibold text-lg">Danh sách bạn bè đã mời</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {referredFriends.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Chưa có bạn bè nào được mời.
            </div>
          ) : (
            referredFriends.map((friend) => (
              <div
                key={friend.id}
                className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">{friend.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Tham gia: {friend.date}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600 dark:text-green-400 mb-1">
                    +{friend.commission}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center justify-end gap-1">
                    {friend.status === "Hoạt động" ? (
                      <span className="text-green-500 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Hoạt động
                      </span>
                    ) : (
                      <span>Chưa hoạt động</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
