import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { Send, ImageIcon, Video, Paperclip } from "lucide-react";
import * as jwtDecodePkg from "jwt-decode";
import {
  getConversationById,
  markMessagesAsRead,
  sendMessage,
} from "../../service/api.conversation.service";

const SOCKET_URL = "http://localhost:5000";

export default function AdminChatBox({ conversation }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [sending, setSending] = useState(false);

  const socketRef = useRef(null);
  const fileInputRef = useRef(null);
  const fileVideoInputRef = useRef(null);
  const listRef = useRef(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const jwtDecodeSafe =
    jwtDecodePkg.jwtDecode || jwtDecodePkg.default || jwtDecodePkg;
  const currentUserId = token ? jwtDecodeSafe(token)?.id || "admin" : "admin";

  // 🔌 Kết nối socket namespace /chat
  useEffect(() => {
    console.log("[AdminChatBox] Connecting socket...");
    const socket = io(`${SOCKET_URL}/chat`, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () =>
      console.log("[AdminChatBox] Connected socket:", socket.id)
    );

    // Đăng ký admin
    socket.emit("register_chat", { userId: currentUserId, role: "ADMIN" });

    // Lắng nghe tin nhắn realtime
    socket.on("new_message", (msg) => {
      console.log("[AdminChatBox] New message:", msg);
      if (msg.conversationId === conversation?.id) {
        setMessages((prev) => {
          // tránh trùng lặp tin
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        scrollToBottom();
      }
    });

    socket.on("disconnect", () => {
      console.log("[AdminChatBox] Disconnected");
    });

    return () => {
      console.log("[AdminChatBox] Cleaning up socket + marking read...");
      socket.disconnect();

      // Gọi async tách biệt
      (async () => {
        try {
          if (conversation?.id) {
            await markMessagesAsRead(conversation.id);
            console.log("[AdminChatBox] Messages marked as read");
          }
        } catch (err) {
          console.error("[AdminChatBox] Cleanup error:", err);
        }
      })();
    };
  }, [conversation?.id]);

  // 🧩 Join conversation room mỗi khi đổi hội thoại
  useEffect(() => {
    if (!conversation?.id || !socketRef.current) return;
    socketRef.current.emit("join_conversation", conversation.id);
    console.log("[AdminChatBox] Join conversation:", conversation.id);

    return () => {
      socketRef.current?.emit("leave_conversation", conversation.id);
    };
  }, [conversation?.id]);

  // 📨 Tải lịch sử hội thoại
  useEffect(() => {
    if (!conversation?.id) return;
    const fetchData = async () => {
      try {
        const res = await getConversationById(conversation.id);
        const data = res?.data?.data || res?.data;
        setMessages(data?.messages || []);
        scrollToBottom();
      } catch (err) {
        console.error("❌ Failed to load conversation:", err);
      }
    };
    fetchData();
  }, [conversation?.id]);

  const scrollToBottom = () => {
    const el = listRef.current;
    if (!el) return;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => (el.scrollTop = el.scrollHeight))
    );
  };

  // 📎 Gửi tin nhắn
  const handleSend = async () => {
    if (!input.trim() && !file) return;
    setSending(true);
    try {
      const fd = new FormData();
      fd.append("conversationId", conversation.id);

      if (file) {
        const type = file.type.startsWith("video") ? "VIDEO" : "IMAGE";
        fd.append("type", type);
        // dùng message làm caption nếu có
        fd.append("content", input.trim());
        fd.append("media", file);
      } else {
        fd.append("type", "TEXT");
        fd.append("content", input.trim());
      }

      const res = await sendMessage(fd);
      const data = res?.data?.data || res?.data;

      if (data) {
        setInput("");
        setFile(null);
        setPreviewUrl(null);
        scrollToBottom();
      }
    } catch (err) {
      console.error("Send failed:", err);
    } finally {
      setSending(false);
    }
  };

  // 🖼 Xử lý chọn file
  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const API_IMAGE_BASE = import.meta.env.VITE_IMAGE_URL || SOCKET_URL;

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-gray-50 rounded-lg shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full text-sm font-semibold">
            {conversation?.user?.fullName
              ? conversation.user.fullName.slice(0, 1).toUpperCase()
              : "U"}
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-800">
              {conversation?.user?.fullName ||
                conversation?.user?.email ||
                "Người dùng"}
            </div>
            <div className="text-xs text-gray-500">
              {conversation?.user?.email || "Không có email"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={async () => {
              await markMessagesAsRead(conversation?.id);
              // giữ logic đóng modal ở chỗ gọi component
            }}
            title="Đóng"
            className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-gray-50"
        style={{ minHeight: 0 }}
      >
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-6">Chưa có tin nhắn</div>
        )}

        {messages.map((m) => {
          const isOwn = m.senderId === currentUserId || m.senderId === "admin";
          return (
            <div
              key={m.id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[75%]`}>
                <div
                  className={`px-4 py-2 rounded-lg shadow-sm break-words ${
                    isOwn
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                      : "bg-white border border-gray-200 text-gray-800"
                  }`}
                >
                  {m.mediaUrl ? (
                    m.type === "VIDEO" ||
                    /\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i.test(m.mediaUrl) ? (
                      <video
                        src={
                          m.mediaUrl.startsWith("http")
                            ? m.mediaUrl
                            : `http://localhost:5000${m.mediaUrl}`
                        }
                        controls
                        className="rounded-md max-h-64 w-full object-contain"
                      />
                    ) : (
                      <img
                        src={
                          m.mediaUrl.startsWith("http")
                            ? m.mediaUrl
                            : `http://localhost:5000${m.mediaUrl}`
                        }
                        alt="attachment"
                        className="rounded-md max-h-64 w-full object-contain"
                      />
                    )
                  ) : (
                    <div className="whitespace-pre-wrap">{m.content}</div>
                  )}
                </div>
                <div
                  className={`text-[11px] mt-1 ${
                    isOwn ? "text-right" : ""
                  } text-gray-400`}
                >
                  {formatTime(m.createdAt)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        {previewUrl && (
          <div className="mb-3 p-2 bg-gray-50 rounded-md border border-gray-100">
            {file?.type?.startsWith("video") ? (
              <video
                src={previewUrl}
                controls
                className="rounded-md max-h-36 w-full object-contain"
              />
            ) : (
              <img
                src={previewUrl}
                alt="preview"
                className="rounded-md max-h-36 w-full object-contain"
              />
            )}
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md"
              title="Gửi ảnh"
            >
              <ImageIcon size={18} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />

            <button
              onClick={() => fileVideoInputRef.current?.click()}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md"
              title="Gửi video"
            >
              <Video size={18} />
            </button>
            <input
              ref={fileVideoInputRef}
              type="file"
              className="hidden"
              accept="video/*"
              onChange={handleFileChange}
            />
          </div>

          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          <button
            onClick={handleSend}
            disabled={sending || (!input.trim() && !file)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
