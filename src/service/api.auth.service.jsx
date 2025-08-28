import axios from "./axios.customize";

const Login = async (email, password) => {
  const API = "/auth/login";
  return axios.post(API, { email, password });
};
const Register = (email, password) => {
  const API = "/auth/register";
  return axios.post(API, { email, password });
};
const VerifyOtp = (email, otp) => {
  const API = "/auth/verify-otp";
  return axios.post(API, { email, otp });
};
const ForgotPassword = async (email) => {
  const API = "/auth/forgot-password";
  return await axios.post(API, { email });
};
const GetMyProfile = () => {
  const API = "/auth/my-profile";
  return axios.get(API);
};
export { Login, Register, VerifyOtp, ForgotPassword, GetMyProfile };