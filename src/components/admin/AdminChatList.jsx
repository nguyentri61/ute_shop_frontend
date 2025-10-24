import React, { useState } from "react";
import {
  ChatBubbleLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

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

const AdminChatList = ({
  onSelectConversation,
  selectedConversation,
  conversations,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  /* 🔹 Gọi API lấy danh sách hội thoại */

  const filtered = conversations.filter((c) => {
    const name = c.user?.fullName || c.user?.email || "Người dùng";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 🔷 Header */}
      <div className="flex items-center justify-between p-4 bg-blue-600 text-white shadow-sm">
        <div className="flex items-center gap-2">
          <ChatBubbleLeftIcon className="h-6 w-6" />
          <h2 className="text-lg font-semibold">Tin nhắn khách hàng</h2>
        </div>
      </div>

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
                {unread > 0 && (
                  <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    {unread}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminChatList;
