import { io } from "socket.io-client";
let socket;

export const connectSocket = () => {
  socket = io("http://localhost:5000/notification");
  return socket;
};

export const registerUser = (userId, role) => {
  if (socket) socket.emit("register", { userId, role });
};

export const onNotification = (callback) => {
  if (socket) socket.on("notification", callback);
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};
