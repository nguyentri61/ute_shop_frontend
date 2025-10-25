import React, { useEffect, useRef, useState } from "react";
import {
  ChatBubbleLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { getAllConversations } from "../../service/api.conversation.service";
import * as jwtDecodePkg from "jwt-decode";
import { io } from "socket.io-client";
/* 🕒 Format thời gian tương đối (VD: "2 giờ trước") */
const formatTime = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) return "Vừa xong";
  if (diffMinutes < 60) return `${diffMinutes} phút`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} giờ`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} ngày`;
};

const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;
const jwtDecodeSafe =
  jwtDecodePkg.jwtDecode || jwtDecodePkg.default || jwtDecodePkg;
const currentUserId = token ? jwtDecodeSafe(token)?.id || "admin" : "admin";
const AdminChatList = ({ onSelectConversation, selectedConversation }) => {
  const socketRef = useRef(null);
  const [conversations, setConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const SOCKET_URL = "http://localhost:5000";
  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await getAllConversations();

      setConversations(res.data || []);
    } catch (err) {
      console.error("❌ Lỗi tải hội thoại:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("[AdminChatList] Connecting socket...");
    const socket = io(`${SOCKET_URL}/chat`, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () =>
      console.log("[AdminChatList] Connected socket:", socket.id)
    );

    // Đăng ký admin
    socket.emit("register_chat", { userId: currentUserId, role: "ADMIN" });
    // 🟢 Lắng nghe signal từ server
    socket.on("refresh_conversations", () => {
      console.log("[Socket] 🌀 Refresh conversation list");
      fetchConversations(); // gọi lại API để cập nhật danh sách
    });
    // 🔻 cleanup khi component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("[AdminChatList] Disconnected socket");
      }
    };
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [selectedConversation]);
  /* 🔹 Gọi API lấy danh sách hội thoại */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <svg
          className="animate-spin h-5 w-5 mr-3 text-gray-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Đang tải hội thoại...
      </div>
    );
  }
  const filtered = conversations.filter((c) => {
    const name = c.user?.fullName || c.user?.email || "Người dùng";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 🔷 Header */}

      {/* 🔍 Thanh tìm kiếm */}
      <div className="p-3 border-b bg-gray-50">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm hội thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-100 text-sm"
          />
        </div>
      </div>

      {/* ⏳ Loading */}

      {/* 💬 Danh sách hội thoại */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
        {filtered.length === 0 ? (
          <p className="p-4 text-center text-gray-400 text-sm">
            Không tìm thấy hội thoại nào
          </p>
        ) : (
          filtered.map((c) => {
            const userName = c.user?.fullName || c.user?.email || "Người dùng";
            const firstLetter = userName[0]?.toUpperCase() || "U";
            const lastMsg = c.firstMessage?.content || "Chưa có tin nhắn";
            const unread = c.unreadCount || 0;
            const isActive = selectedConversation?.id === c.id;

            return (
              <div
                key={c.id}
                onClick={() => {
                  onSelectConversation(c);
                  if (c.unreadCount > 0) {
                    c.unreadCount = 0;
                  }
                }}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all ${
                  isActive
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : "hover:bg-gray-50"
                }`}
              >
                {/* 🟦 Avatar */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                  {firstLetter}
                </div>

                {/* 📄 Nội dung */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-800 truncate">
                      {userName}
                    </h3>
                    <span className="text-[11px] text-gray-500">
                      {formatTime(c.updatedAt)}
                    </span>
                  </div>
                  <p
                    className={`text-sm truncate ${
                      unread > 0
                        ? "text-gray-900 font-semibold"
                        : "text-gray-500"
                    }`}
                  >
                    {lastMsg}
                  </p>
                </div>

                {/* 🔴 Badge tin chưa đọc */}
                {unread > 0 && c.id !== selectedConversation?.id ? (
                  <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    {unread}
                  </span>
                ) : c.id === selectedConversation?.id ? (
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminChatList;
