import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, Check } from "lucide-react";

export function AdminAnnouncementModal({
  isOpen,
  onClose,
  announcement,
}: {
  isOpen: boolean;
  onClose: () => void;
  announcement: { title: string; content: string } | null;
}) {
  if (!announcement) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-black w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800"
            >
              <div className="p-6 sm:p-8">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
                  <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  {announcement.title}
                </h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-300 mb-8 whitespace-pre-wrap">
                  {announcement.content}
                </div>
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" /> ĐÃ ĐỌC
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
