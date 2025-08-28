import axios from "./axios.customize";


const ForgotPassword = async (email) => {
  const API = "/auth/forgot-password";
  return await axios.post(API, { email });
};
const GetMyProfile = () => {
  const API = "/auth/my-profile";
  return axios.get(API);
};
export { ForgotPassword, GetMyProfile };