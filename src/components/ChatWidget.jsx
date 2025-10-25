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
    <div className="fixed z-9999 bottom-6 right-6">
      {!open ? (
        <div className="relative">
          <button
            onClick={async () => {
              await markMessagesAsRead(conversation.id);
              setOpen(true);
            }}
            className="bg-blue-600 text-white p-3 rounded-full shadow-lg"
          >
            <MessageCircle size={24} />
          </button>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-0.5">
              {unreadCount > 99 ? "99" : unreadCount}
            </span>
          )}
        </div>
      ) : (
        <div className="w-96 sm:w-[520px] h-[520px] sm:h-[640px] bg-white shadow-2xl rounded-xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-blue-600 text-white flex justify-between items-center p-3">
            <span>Hỗ trợ khách hàng</span>
            <button
              onClick={async () => {
                await markMessagesAsRead(conversation.id);
                setOpen(false);
              }}
            >
              <X />
            </button>
          </div>

          {/* Nội dung chat */}
          <div
            ref={chatContainerRef}
            className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50"
          >
            {conversation?.messages?.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.senderId === userId ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] p-2 rounded-lg text-sm ${
                    msg.senderId === userId
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.mediaUrl ? (
                    // nếu msg.type === 'VIDEO' hoặc url có đuôi video -> hiển thị video, ngược lại hiển thị ảnh
                    msg.type === "VIDEO" ||
                    /\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i.test(msg.mediaUrl) ? (
                      <video
                        src={
                          msg.mediaUrl.startsWith("http")
                            ? msg.mediaUrl
                            : `http://localhost:5000${msg.mediaUrl}`
                        }
                        controls
                        className="rounded-lg max-h-40 w-full object-contain"
                      />
                    ) : (
                      <img
                        src={
                          msg.mediaUrl.startsWith("http")
                            ? msg.mediaUrl
                            : `http://localhost:5000${msg.mediaUrl}`
                        }
                        alt="attachment"
                        className="rounded-lg max-h-40 w-full object-contain"
                      />
                    )
                  ) : (
                    msg.content
                  )}
                  {/* hiển thị badge "mới" nếu chưa đọc */}
                  {!msg.isRead && msg.senderId !== userId && (
                    <span className="ml-2 inline-block bg-red-100 text-red-700 text-[10px] px-1 rounded ml-2">
                      mới
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Gửi tin nhắn */}
          <div className="p-3 border-t flex items-center space-x-2 bg-white">
            {" "}
            <div className="flex items-center gap-2">
              {" "}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                title="Gửi ảnh"
              >
                <ImageIcon size={20} />
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
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                title="Gửi video"
              >
                <Video size={20} />
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
              className="flex-1 border rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Nhập tin nhắn..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
            >
              <Send size={18} />
            </button>
          </div>

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
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
