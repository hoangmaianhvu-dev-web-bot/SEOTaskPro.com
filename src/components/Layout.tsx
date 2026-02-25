import React from "react";
import { motion } from "motion/react";
import {
  Search,
  LayoutDashboard,
  ListTodo,
  Wallet,
  Moon,
  Sun,
  Menu,
  X,
  User,
  UserCircle,
  LogOut,
  Settings,
  Users,
  HeadphonesIcon,
  Gamepad2,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAppContext } from "../contexts/AppContext";

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  navigateTo: (page: any) => void;
  onLogout: () => void;
}

export function Layout({
  children,
  currentPage,
  navigateTo,
  onLogout,
}: LayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, balance } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: "dashboard", label: "Tổng quan", icon: LayoutDashboard },
    { id: "tasks", label: "Nhiệm vụ", icon: ListTodo },
    { id: "withdraw", label: "Rút tiền", icon: Wallet },
    { id: "game-topup", label: "Nạp Game", icon: Gamepad2 },
    { id: "referral", label: "Giới thiệu", icon: Users },
    { id: "support", label: "Hỗ trợ", icon: HeadphonesIcon },
  ];

  if (user?.role === "admin") {
    navItems.push({ id: "admin", label: "Quản trị (Admin)", icon: Settings });
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-black transition-colors duration-200">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <Search className="w-6 h-6" />
          <span className="text-shine">
            SEO<span className="text-gray-500">Task</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="hidden md:flex items-center gap-2 p-6 font-bold text-2xl tracking-tight">
          <Search className="w-7 h-7" />
          <span className="text-shine">
            SEO<span className="text-gray-500">Task</span>
          </span>
        </div>

        <div className="px-4 py-2 flex-1 flex flex-col">
          <div
            onClick={() => {
              navigateTo("profile");
              setIsMobileMenuOpen(false);
            }}
            className={`p-4 mb-6 rounded-xl flex items-center gap-3 cursor-pointer transition-colors ${
              currentPage === "profile"
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "bg-gray-100 dark:bg-black hover:bg-gray-200 dark:hover:bg-[#2a2a2a]"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentPage === "profile"
                  ? "bg-white/20 dark:bg-black/20"
                  : "bg-gray-300 dark:bg-gray-700"
              }`}
            >
              <User
                className={`w-6 h-6 ${
                  currentPage === "profile"
                    ? "text-white dark:text-black"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              />
            </div>
            <div>
              <div className="text-sm font-medium">{user?.name || "Người dùng"}</div>
            </div>
          </div>

          <nav className="space-y-1 flex-1 pb-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentPage === item.id ||
                (currentPage === "task-detail" && item.id === "tasks");
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigateTo(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                    ${
                      isActive
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-black hover:text-black dark:hover:text-white"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white/50 dark:bg-black/50 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
          <h1 className="text-xl font-semibold capitalize">
            {currentPage === "task-detail"
              ? "Chi tiết nhiệm vụ"
              : currentPage === "profile"
                ? "Hồ sơ"
                : navItems.find((i) => i.id === currentPage)?.label}
          </h1>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 rounded-full bg-gray-100 dark:bg-black text-sm font-medium flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              <span>
                Số dư:{" "}
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  {balance.toLocaleString()}đ
                </span>
              </span>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-5xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
