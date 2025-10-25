import React, { useEffect, useState, useRef } from "react";
import { MessageCircle, X, Send, ImageIcon, Video } from "lucide-react";
import { io } from "socket.io-client";
import * as jwtDecodePkg from "jwt-decode";
import {
  getAllConversations,
  markMessagesAsRead,
  sendMessage,
} from "../service/api.conversation.service";

const ChatWidget = () => {
  const [conversation, setConversation] = useState(null);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [open, setOpen] = useState(false);

  const chatContainerRef = useRef(null);
  const socketRef = useRef(null);
  const fileInputRef = useRef(null);
  const fileVideoInputRef = useRef(null);
  const token = localStorage.getItem("token");
  const userId = token ? jwtDecodePkg.jwtDecode(token)?.id : null;

  // thêm: số tin chưa đọc (chỉ tính tin của phía khác)
  const unreadCount =
    conversation?.messages?.filter((m) => m.senderId !== userId && !m.isRead)
      ?.length || 0;

  // Cuộn xuống cuối khi có tin nhắn
  const scrollToBottom = () => {
    const el = chatContainerRef.current;
    if (!el) return;
    // đảm bảo DOM cập nhật, chạy 2 frame
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
      })
    );
  };

  // helper: thêm message nếu chưa tồn tại
  const addMessageUnique = (prevConv, msg) => {
    if (!prevConv) return prevConv;
    const msgs = prevConv.messages || [];
    const exists = msgs.some((m) => {
      if (m.id && msg.id) return m.id === msg.id;
      return (
        m.senderId === msg.senderId &&
        m.content === msg.content &&
        m.createdAt === msg.createdAt
      );
    });
    if (exists) return prevConv;
    return { ...prevConv, messages: [...msgs, msg] };
  };

  // Kết nối socket (chỉ cho USER)
  useEffect(() => {
    if (!token || !userId) return;
    console.log("Connecting chat socket...");
    const socket = io("http://localhost:5000/chat", {
      transports: ["websocket"],
    });
    socketRef.current = socket;

    // Đăng ký user với server
    socket.emit("register_chat", { userId, role: "USER" });

    socket.on("connect", () => {
      console.log("[Chat] Connected:", socket.id);
    });

    // Nhận tin nhắn realtime (dedupe trước khi append)
    socket.on("new_message", (msg) => {
      console.log("[Chat] New message:", msg);
      setConversation((prev) => {
        // nếu không phải conversation đang mở thì ignore
        if (!prev || msg.conversationId !== prev.id) return prev;
        const next = addMessageUnique(prev, msg);
        // nếu thêm mới thì scroll xuống
        if (next !== prev) {
          requestAnimationFrame(() => requestAnimationFrame(scrollToBottom));
        }
        return next;
      });
    });

    socket.on("disconnect", () => {
      console.log("[Chat] Disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, [token, userId]);

  // Lấy conversation cho user
  const fetchConversations = async () => {
    try {
      const res = await getAllConversations();
      const apiPayload = res?.data;
      const data = apiPayload?.data ?? apiPayload;
      const conv = Array.isArray(data) ? data[0] : data;
      setConversation(conv);

      // join room conversation để nhận tin nhắn riêng
      if (socketRef.current && conv?.id) {
        socketRef.current.emit("join_conversation", conv.id);
      }

      // scroll to bottom after load
      requestAnimationFrame(() => requestAnimationFrame(scrollToBottom));
    } catch (err) {
      console.error("Fetch conversations error", err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // khi mở widget => scroll xuống cuối và đánh dấu là đã đọc
  useEffect(() => {
    // scroll first
    requestAnimationFrame(() => requestAnimationFrame(scrollToBottom));

    // mark messages as read locally
    setConversation((prev) => {
      if (!prev) return prev;
      const msgs = (prev.messages || []).map((m) =>
        m.senderId !== userId ? { ...m, isRead: true } : m
      );
      return { ...prev, messages: msgs };
    });

    //  await markMessagesAsRead(conversation.id);
  }, [open, conversation?.id]);

  // cũng scroll mỗi khi messages thay đổi và chat đang mở
  useEffect(() => {
    if (open && conversation?.messages?.length) {
      requestAnimationFrame(() => requestAnimationFrame(scrollToBottom));
    }
  }, [open, conversation?.messages?.length]);

  // Gửi tin nhắn (hỗ trợ TEXT hoặc IMAGE/VIDEO bằng FormData)
  const handleSendMessage = async () => {
    if (!message?.trim() && !file) return;
    try {
      const fd = new FormData();
      if (conversation?.id) fd.append("conversationId", conversation.id);

      if (file) {
        const type = file.type.startsWith("video") ? "VIDEO" : "IMAGE";
        fd.append("type", type);
        // dùng message làm caption nếu có
        fd.append("content", message?.trim() || "");
        fd.append("media", file);
      } else {
        fd.append("type", "TEXT");
        fd.append("content", message.trim());
      }

      await sendMessage(fd);

      // reset local inputs/preview
      setMessage("");
      setFile(null);
      setPreviewUrl(null);

      // sau khi gửi, scroll xuống cuối
      requestAnimationFrame(() => requestAnimationFrame(scrollToBottom));
    } catch (err) {
      console.error("Send message failed", err);
    }
  };

  // Xử lý chọn ảnh/video (preview)
  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  return (
    <div className="fixed z-50 bottom-6 right-6">
      {!open ? (
        <div className="relative">
          <button
            onClick={async () => {
              if (conversation?.id) {
                try {
                  await markMessagesAsRead(conversation.id);
                } catch {
                  console.error("Failed to mark messages as read");
                }
              }
              setOpen(true);
            }}
            className="bg-blue-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
            aria-label="Open chat"
          >
            <MessageCircle size={22} />
          </button>

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-0.5">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
      ) : (
        <div className="w-96 sm:w-[560px] h-[560px] sm:h-[720px] bg-white shadow-2xl rounded-xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold">
                {conversation?.user?.fullName
                  ? conversation.user.fullName.slice(0, 1).toUpperCase()
                  : "U"}
              </div>
              <div>
                <div className="text-sm font-semibold">
                  {conversation?.user?.fullName ||
                    conversation?.user?.email ||
                    "Khách hàng"}
                </div>
                <div className="text-xs opacity-80">
                  {conversation?.user?.email || ""}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  if (conversation?.id) {
                    try {
                      await markMessagesAsRead(conversation.id);
                    } catch {
                      console.error("Failed to mark messages as read");
                    }
                  }
                  setOpen(false);
                }}
                className="p-2 rounded-md bg-white/20 hover:bg-white/30"
                title="Đóng"
              >
                <X />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50"
            style={{ minHeight: 0 }}
          >
            {conversation?.messages?.length === 0 && (
              <div className="text-center text-gray-400 mt-6">
                Chưa có tin nhắn
              </div>
            )}

            {conversation?.messages?.map((msg) => {
              const isOwn = msg.senderId === userId;
              return (
                <div
                  key={msg.id || `${msg.createdAt}-${Math.random()}`}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[78%]`}>
                    <div
                      className={`inline-block px-4 py-2 rounded-2xl shadow-sm break-words ${
                        isOwn
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                          : "bg-white border border-gray-200 text-gray-800"
                      }`}
                    >
                      {msg.mediaUrl ? (
                        msg.type === "VIDEO" ||
                        /\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i.test(
                          msg.mediaUrl
                        ) ? (
                          <video
                            src={
                              msg.mediaUrl.startsWith("http")
                                ? msg.mediaUrl
                                : `http://localhost:5000${msg.mediaUrl}`
                            }
                            controls
                            className="rounded-md max-h-64 w-full object-contain"
                          />
                        ) : (
                          <img
                            src={
                              msg.mediaUrl.startsWith("http")
                                ? msg.mediaUrl
                                : `http://localhost:5000${msg.mediaUrl}`
                            }
                            alt="attachment"
                            className="rounded-md max-h-64 w-full object-contain"
                          />
                        )
                      ) : (
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      )}
                    </div>

                    <div
                      className={`text-[11px] mt-1 ${
                        isOwn ? "text-right" : ""
                      } text-gray-400`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {!msg.isRead && !isOwn && (
                        <span className="ml-2 inline-block bg-red-100 text-red-700 text-[10px] px-1 rounded">
                          mới
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input area */}
          <div className="p-4 border-t bg-white">
            {previewUrl && (
              <div className="mb-3 p-2 bg-gray-50 rounded-md border border-gray-100">
                {file?.type?.startsWith("video") ? (
                  <video
                    src={previewUrl}
                    controls
                    className="rounded-md max-h-40 w-full object-contain"
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="rounded-md max-h-40 w-full object-contain"
                  />
                )}
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
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
                  type="button"
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
                className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Nhập tin nhắn..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />

              <button
                onClick={handleSendMessage}
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                title="Gửi"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
