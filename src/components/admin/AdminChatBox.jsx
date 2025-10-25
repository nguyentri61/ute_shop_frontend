import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { Send, ImageIcon, Video, Paperclip } from "lucide-react";
import * as jwtDecodePkg from "jwt-decode";
import {
  getConversationById,
  sendMessage,
} from "../../service/api.conversation.service";

const SOCKET_URL = "http://localhost:5000";

export default function AdminChatBox({ conversation, setConversations }) {
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
        setConversations((prevConvs) => {
          return prevConvs.map((conv) => {
            if (
              conv.id === msg.conversationId &&
              msg.senderId !== currentUserId
            ) {
              return {
                ...conv,
                firstMessage: msg,

                updatedAt: msg.createdAt,
              };
            }
            return conv;
          });
        });

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
      socket.disconnect();
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
      fd.append("content", input.trim());
      if (file) fd.append("media", file);

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
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-3 border-b bg-blue-600 text-white">
        <h3 className="font-semibold">
          {conversation?.user?.fullName ||
            conversation?.user?.email ||
            "Người dùng"}
        </h3>
      </div>

      {/* Messages */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-white to-gray-50 space-y-3"
      >
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-10">
            Chưa có tin nhắn
          </div>
        )}

        {messages.map((m) => {
          const isOwn = m.senderId === currentUserId || m.senderId === "admin";

          return (
            <div
              key={m.id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-[75%]">
                <div
                  className={`inline-block px-4 py-2 rounded-2xl shadow-sm ${
                    isOwn
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-200 text-gray-800"
                  }`}
                >
                  {m.mediaUrl ? (
                    // nếu m.type === 'VIDEO' hoặc url có đuôi video -> hiển thị video, ngược lại hiển thị ảnh
                    m.type === "VIDEO" ||
                    /\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i.test(m.mediaUrl) ? (
                      <video
                        src={
                          m.mediaUrl.startsWith("http")
                            ? m.mediaUrl
                            : `http://localhost:5000${m.mediaUrl}`
                        }
                        controls
                        className="rounded-lg max-h-40 w-full object-contain"
                      />
                    ) : (
                      <img
                        src={
                          m.mediaUrl.startsWith("http")
                            ? m.mediaUrl
                            : `http://localhost:5000${m.mediaUrl}`
                        }
                        alt="attachment"
                        className="rounded-lg max-h-40 w-full object-contain"
                      />
                    )
                  ) : (
                    m.content
                  )}
                </div>
                <div
                  className={`text-[11px] mt-1 ${
                    isOwn ? "text-right text-gray-400" : "text-gray-400"
                  }`}
                >
                  {formatTime(m.createdAt)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="p-3 border-t bg-white flex flex-col gap-2">
        {previewUrl && (
          <div className="p-2 border-t flex justify-center bg-gray-100">
            {file?.type?.startsWith("video") ? (
              <video
                src={previewUrl}
                controls
                className="h-24 rounded-lg w-full object-contain"
              />
            ) : (
              <img
                src={previewUrl}
                alt="preview"
                className="h-24 rounded-lg object-contain"
              />
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
            title="Gửi ảnh"
          >
            <ImageIcon size={16} />
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
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
            title="Gửi video"
          >
            <Video size={16} />
          </button>
          <input
            ref={fileVideoInputRef}
            type="file"
            className="hidden"
            accept="video/*"
            onChange={handleFileChange}
          />

          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          <button
            onClick={handleSend}
            disabled={sending || (!input.trim() && !file)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
