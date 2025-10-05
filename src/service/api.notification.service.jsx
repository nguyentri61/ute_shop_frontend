import axios from "./axios.customize";

const GetNotification = async () => {
  const API = "/notifications/all";
  return axios.get(API);
};
const MarkAllAsRead = async () => {
  const API = "/notifications/mark-as-read";
  return axios.put(API);
};

export { GetNotification, MarkAllAsRead };
