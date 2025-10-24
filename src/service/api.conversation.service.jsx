import axios from "./axios.customize";

// 🔹 Lấy tất cả hội thoại (dành cho user hoặc admin)
const getAllConversations = async () => {
  const API = "/conversations/all";
  return axios.get(API);
};

// 🔹 Gửi tin nhắn (text hoặc file)
const sendMessage = async (formData) => {
  const API = "/conversations/messages";
  return axios.post(API, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
const markMessagesAsRead = (conversationId) => {
  const API = `/conversations/mark-as-read/${conversationId}`;
  return axios.put(API);
};
const getConversationById = (id) => axios.get(`/conversations/${id}`);

export {
  getAllConversations,
  sendMessage,
  getConversationById,
  markMessagesAsRead,
};
