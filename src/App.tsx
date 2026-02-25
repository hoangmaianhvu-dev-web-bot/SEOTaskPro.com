/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { AppProvider, useAppContext } from "./contexts/AppContext";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Tasks } from "./pages/Tasks";
import { TaskDetail } from "./pages/TaskDetail";
import { Withdraw } from "./pages/Withdraw";
import { Profile } from "./pages/Profile";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Support } from "./pages/Support";
import { AdminDashboard } from "./pages/AdminDashboard";
import { Referral } from "./pages/Referral";
import { GlobalNotifications } from "./components/GlobalNotifications";
import { AdminAnnouncementModal } from "./components/AdminAnnouncementModal";
import { GameTopup } from "./pages/GameTopup";

type Page =
  | "dashboard"
  | "tasks"
  | "task-detail"
  | "withdraw"
  | "profile"
  | "admin"
  | "referral"
  | "support"
  | "game-topup";

function AppContent({ onLogout }: { onLogout: () => void }) {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [latestAnnouncement, setLatestAnnouncement] = useState<{
    title: string;
    content: string;
  } | null>(null);

  const { showCelebration, announcements } = useAppContext();

  useEffect(() => {
    if (announcements && announcements.length > 0) {
      setLatestAnnouncement(announcements[0]);
      setShowAnnouncement(true);
    } else {
      setShowAnnouncement(false);
    }
  }, [announcements]);

  const navigateTo = (page: Page, taskId?: string) => {
    setCurrentPage(page);
    if (taskId) setSelectedTaskId(taskId);
  };

  return (
    <>
      <Layout
        currentPage={currentPage}
        navigateTo={navigateTo}
        onLogout={onLogout}
      >
        {currentPage === "dashboard" && <Dashboard navigateTo={navigateTo} />}
        {currentPage === "tasks" && <Tasks navigateTo={navigateTo} />}
        {currentPage === "task-detail" && selectedTaskId && (
          <TaskDetail taskId={selectedTaskId} navigateTo={navigateTo} />
        )}
        {currentPage === "withdraw" && <Withdraw />}
        {currentPage === "game-topup" && <GameTopup />}
        {currentPage === "referral" && <Referral />}
        {currentPage === "support" && <Support />}
        {currentPage === "profile" && <Profile onLogout={onLogout} />}
        {currentPage === "admin" && <AdminDashboard />}
      </Layout>
      <AdminAnnouncementModal
        isOpen={showAnnouncement}
        onClose={() => setShowAnnouncement(false)}
        announcement={latestAnnouncement}
      />
      {showCelebration && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-3 rounded-full shadow-2xl font-bold flex items-center gap-2">
            🎉 Chúc mừng! Yêu cầu rút tiền của bạn đã được duyệt thành công! 🎉
          </div>
        </div>
      )}
    </>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPage, setAuthPage] = useState<"login" | "register">("login");

  return (
    <ThemeProvider>
      <NotificationProvider>
        <AppProvider>
          {!isAuthenticated ? (
            authPage === "login" ? (
              <Login
                onLogin={() => setIsAuthenticated(true)}
                onNavigateToRegister={() => setAuthPage("register")}
              />
            ) : (
              <Register
                onRegister={() => setIsAuthenticated(true)}
                onNavigateToLogin={() => setAuthPage("login")}
              />
            )
          ) : (
            <AppContent onLogout={() => setIsAuthenticated(false)} />
          )}
          <GlobalNotifications />
        </AppProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
