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

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  useEffect(() => {
    const getReview = async () => {
      try {
        const response = await GetNotification();
        setNotifications(response.data.notifications || []);
        setUnreadCount(
          (response.data.notifications || []).filter((n) => n.isRead === false)
            .length
        );
      } catch (err) {
        console.error(err);
      }
    };
    getReview();
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode(token);
    const userId = decoded.id;
    const role = decoded.role;

    connectSocket();
    registerUser(userId, role);

    onNotification((data) => {
      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => disconnectSocket();
  }, []);
  useEffect(() => {
    if (!open) return;
    // Đánh dấu tất cả thông báo là đã đọc
    handleMarkAsRead();
  }, [open]);
  const handleMarkAsRead = async () => {
    try {
      await MarkAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => (n.isRead === false ? { ...n, isRead: true } : n))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error("Lỗi đánh dấu đã đọc:", err);
    }
  };

  return (
    <div className="relative">
      {/* Nút chuông */}
      <button
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <BellIcon className="w-6 h-6 text-gray-700" />

        {/* Chấm đỏ */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popup notification */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 bg-white border border-gray-200 shadow-lg rounded-md overflow-hidden z-50">
          <div className="p-2 text-sm font-semibold border-b border-gray-100">
            Notifications
          </div>
          <ul className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
            {notifications.length === 0 && (
              <li className="p-3 text-gray-500">No notifications</li>
            )}
            {notifications.map((n, i) => (
              <li
                key={i}
                className="p-3 hover:bg-gray-50 transition-colors cursor-pointer flex justify-between items-center"
              >
                <span>{n.message}</span>
                {n.link && (
                  <a
                    href={n.link}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    View
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
