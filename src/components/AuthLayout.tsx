import React from "react";
import { motion } from "motion/react";
import { Search, ShieldCheck, Zap, TrendingUp, User } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-200">
      {/* Left side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative z-10">
        <div className="absolute top-8 left-8 sm:left-16 lg:left-24 flex items-center gap-2 font-bold text-2xl tracking-tight">
          <Search className="w-8 h-8" />
          <span className="text-shine">
            SEO<span className="text-gray-500">Task</span>
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-auto"
        >
          <div className="flex justify-center mb-8">
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative w-24 h-24"
            >
              <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 blur-xl"></div>
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full drop-shadow-xl"
              >
                {/* Body */}
                <rect
                  x="20"
                  y="30"
                  width="60"
                  height="50"
                  rx="15"
                  fill="#1a1a1a"
                />
                <rect
                  x="25"
                  y="35"
                  width="50"
                  height="40"
                  rx="10"
                  fill="#2a2a2a"
                />
                {/* Eyes */}
                <motion.circle
                  cx="35"
                  cy="50"
                  r="6"
                  fill="#3b82f6"
                  animate={{ scaleY: [1, 0.1, 1] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    times: [0, 0.1, 0.2],
                  }}
                />
                <motion.circle
                  cx="65"
                  cy="50"
                  r="6"
                  fill="#3b82f6"
                  animate={{ scaleY: [1, 0.1, 1] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    times: [0, 0.1, 0.2],
                  }}
                />
                {/* Smile */}
                <path
                  d="M 40 65 Q 50 75 60 65"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Antenna */}
                <line
                  x1="50"
                  y1="30"
                  x2="50"
                  y2="15"
                  stroke="#1a1a1a"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="50" cy="10" r="5" fill="#ef4444" />
                {/* Arms */}
                <motion.path
                  d="M 20 50 Q 5 60 10 70"
                  stroke="#1a1a1a"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  animate={{ rotate: [0, 20, 0] }}
                  style={{ originX: "20px", originY: "50px" }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.path
                  d="M 80 50 Q 95 60 90 70"
                  stroke="#1a1a1a"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  animate={{ rotate: [0, -20, 0] }}
                  style={{ originX: "80px", originY: "50px" }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                />
              </svg>
            </motion.div>
          </div>

          <h1 className="text-4xl font-bold mb-2 tracking-tight text-center">
            {title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-center">
            {subtitle}
          </p>

          {children}
        </motion.div>
      </div>

      {/* Right side: Intro/Advertising */}
      <div className="hidden lg:flex w-1/2 bg-black text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Dynamic background effects */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full border-[1px] border-white/30 border-dashed"
          />
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              rotate: [0, -90, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-[20%] -left-[10%] w-[80%] h-[80%] rounded-full border-[1px] border-white/20 border-dashed"
          />
        </div>

        <div className="relative z-10 mt-20">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-5xl font-bold leading-tight mb-6">
              Nền tảng làm nhiệm vụ <br />
              <span className="text-gray-400">chuyên nghiệp nhất.</span>
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-lg">
              Tham gia cộng đồng hơn 100,000+ thành viên. Kiếm tiền online an
              toàn, uy tín và minh bạch.
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                icon: ShieldCheck,
                title: "Uy tín & An toàn",
                desc: "Thanh toán minh bạch, bảo mật thông tin tuyệt đối.",
              },
              {
                icon: Zap,
                title: "Nhiệm vụ đa dạng",
                desc: "Hàng ngàn nhiệm vụ SEO, click, tải app được cập nhật mỗi ngày.",
              },
              {
                icon: TrendingUp,
                title: "Thu nhập ổn định",
                desc: "Kiếm tiền mọi lúc mọi nơi chỉ với chiếc điện thoại của bạn.",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.1, duration: 0.5 }}
                className="flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{feature.title}</h3>
                  <p className="text-gray-400">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-sm text-gray-500">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gray-800 border-2 border-black flex items-center justify-center"
              >
                <User className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
          <p>
            Hơn <strong className="text-white">100k+</strong> người dùng đã tin
            tưởng
          </p>
        </div>
      </div>
    </div>
  );
}
