import React from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  TrendingUp,
  Wallet,
  ArrowDownLeft,
} from "lucide-react";
import { useAppContext } from "../contexts/AppContext";

export function Dashboard({
  navigateTo,
}: {
  navigateTo: (page: string, taskId?: string) => void;
}) {
  const { balance, user, transactions, withdrawals } = useAppContext();
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending').length;
  const recentTasks = transactions.filter(t => t.type === 'task').slice(0, 5);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-black p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
              0% <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
            Tổng thu nhập
          </div>
          <div className="text-3xl font-bold tracking-tight">{balance.toLocaleString()}đ</div>
        </div>

        <div className="bg-white dark:bg-black p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
            Nhiệm vụ hoàn thành
          </div>
          <div className="text-3xl font-bold tracking-tight">{user?.tasksCompleted || 0}</div>
        </div>

        <div className="bg-white dark:bg-black p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
            Đang chờ duyệt
          </div>
          <div className="text-3xl font-bold tracking-tight">{pendingWithdrawals}</div>
        </div>
      </div>

      <div className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Lịch sử làm nhiệm vụ</h2>
          <button
            onClick={() => navigateTo("tasks")}
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            Xem tất cả <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {recentTasks.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Chưa có lịch sử làm nhiệm vụ.
            </div>
          ) : (
            recentTasks.map((tx) => (
              <div
                key={tx.id}
                className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                    <ArrowDownLeft className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">{tx.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {tx.date}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Thành công
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-green-600 dark:text-green-400">
                    +{tx.amount.toLocaleString()}đ
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
