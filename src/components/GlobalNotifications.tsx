import React, { useEffect } from "react";
import { useNotification } from "../contexts/NotificationContext";

const FAKE_USERS = [
  "Nguyễn Văn A",
  "Trần Thị B",
  "Lê Văn C",
  "Phạm Thị D",
  "Hoàng Văn E",
  "Vũ Thị F",
  "Đặng Văn G",
  "Bùi Thị H",
  "Đỗ Văn I",
  "Hồ Thị K",
];

const FAKE_ACTIONS = [
  "vừa rút thành công 50,000đ",
  "vừa rút thành công 100,000đ",
  "vừa rút thành công 200,000đ",
  "vừa hoàn thành nhiệm vụ SEO",
  "vừa hoàn thành nhiệm vụ tải app",
  "vừa đổi thẻ Garena 50k",
  "vừa đổi Kim cương Free Fire",
];

export function GlobalNotifications() {
  const { notify } = useNotification();

  useEffect(() => {
    const showRandomNotification = () => {
      const randomUser =
        FAKE_USERS[Math.floor(Math.random() * FAKE_USERS.length)];
      const randomAction =
        FAKE_ACTIONS[Math.floor(Math.random() * FAKE_ACTIONS.length)];

      // Mask the name for privacy (e.g., Nguyễn Văn A -> Nguy*** A)
      const nameParts = randomUser.split(" ");
      const maskedName = `${nameParts[0]}*** ${nameParts[nameParts.length - 1]}`;

      notify(`${maskedName} ${randomAction}`, "info");

      // Schedule next notification between 10s and 30s
      const nextDelay = Math.floor(Math.random() * 20000) + 10000;
      setTimeout(showRandomNotification, nextDelay);
    };

    // Start the first notification after 5 seconds
    const initialTimer = setTimeout(showRandomNotification, 5000);

    return () => clearTimeout(initialTimer);
  }, [notify]);

  return null; // This component doesn't render anything visible directly
}
