import axios from "axios";
import axiosClient from "./axiosClient";

const API_URL = "http://localhost:8091/api/auth/";

const login = async (username, password) => {
  const response = await axios.post(API_URL + "signin", {
    username,
    password,
  });
  if (response.data.accessToken) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const logout = async () => {
    await axiosClient.post(API_URL + "signout",{});
    localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};
const getUserId = () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  return userData ? userData.id : null;
};

const AuthApi = {
  login,
  logout,
  getCurrentUser,
  getUserId,
};

export default AuthApi;