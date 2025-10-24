// src/service/chatSocket.js
import { io } from "socket.io-client";

let socket;

export const connectChatSocket = () => {
  if (!socket) {
    socket = io("http://localhost:5000/chat", {
      transports: ["websocket"],
    });
  }
  return socket;
};

export const registerChatUser = (userId, role) => {
  if (socket) socket.emit("register_chat", { userId, role });
};

export const joinConversation = (conversationId) => {
  if (socket) socket.emit("join_conversation", conversationId);
};

export const onNewMessage = (callback) => {
  if (socket) socket.on("new_message", callback);
};

export const sendChatMessage = (messageData) => {
  if (socket) socket.emit("send_chat_message", messageData);
};

export const disconnectChatSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
