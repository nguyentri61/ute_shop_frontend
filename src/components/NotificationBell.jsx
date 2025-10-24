import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  connectSocket,
  disconnectSocket,
  onNotification,
  registerUser,
} from "../service/socketService";
import { BellIcon } from "lucide-react";
import {
  GetNotification,
  MarkAllAsRead,
} from "../service/api.notification.service";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // 🧩 Lấy danh sách notification ban đầu
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetNotification();
        const noti = response.data.notifications || [];
        setNotifications(noti);
        setUnreadCount(noti.filter((n) => !n.isRead).length);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();

    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode(token);
    connectSocket();
    registerUser(decoded.id, decoded.role);

    onNotification((data) => {
      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => disconnectSocket();
  }, []);

  // 🕹 Khi mở popup -> đánh dấu đã đọc
  useEffect(() => {
    if (open) handleMarkAsRead();
  }, [open]);

  const handleMarkAsRead = async () => {
    try {
      await MarkAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Lỗi đánh dấu đã đọc:", err);
    }
  };

  return (
    <div className="relative">
      {/* 🔔 Nút chuông */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`relative p-2 rounded-full transition-all duration-300 ${unreadCount > 0
          ? "bg-indigo-50 hover:bg-indigo-100 text-indigo-600 animate-pulse-soft"
          : "hover:bg-gray-100 text-gray-700"
          }`}
      >
        <BellIcon className="w-6 h-6" />
        {unreadCount > 0 && (
          <motion.span
            key={unreadCount}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-0 right-0 -mt-1 -mr-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow"
          >
            {unreadCount}
          </motion.span>
        )}
      </button>

      {/* 🧭 Popup Notifications */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-80 max-h-96 bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden z-50 backdrop-blur-sm"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 text-sm">
                Thông báo
              </h3>
              <span className="text-xs text-gray-400">
                {notifications.length} tổng
              </span>
            </div>

            {/* Danh sách */}
            <ul className="divide-y divide-gray-100 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
              {notifications.length === 0 ? (
                <li className="p-4 text-gray-500 text-sm text-center">
                  Không có thông báo nào
                </li>
              ) : (
                notifications.map((n, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`p-4 text-sm flex justify-between items-center cursor-pointer transition-all ${!n.isRead
                      ? "bg-indigo-50 hover:bg-indigo-100"
                      : "hover:bg-gray-50"
                      }`}
                  >
                    <span
                      className={`flex-1 pr-2 ${!n.isRead ? "font-medium text-gray-800" : "text-gray-600"
                        }`}
                    >
                      {n.message}
                    </span>
                    {n.link && (
                      <a
                        href={n.link}
                        className="text-indigo-600 text-xs hover:underline whitespace-nowrap"
                      >
                        Xem
                      </a>
                    )}
                  </motion.li>
                ))
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔧 Hiệu ứng pulse nhẹ khi có thông báo */}
      <style jsx>{`
        @keyframes pulse-soft {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
          }
          50% {
            box-shadow: 0 0 0 6px rgba(99, 102, 241, 0);
          }
        }
        .animate-pulse-soft {
          animation: pulse-soft 2s infinite;
        }
      `}</style>
    </div>
  );
}
