import axiosClient from "./axiosClient";

const PREFIX = "http://localhost:8091/api/users";

const signup = async (data) => {
  const url = `${PREFIX}/signup`
  const response = await axiosClient.post(url, data);

  return response;
};

const getAllUsers = (keyword, page, pageSize) => {
  const url = `${PREFIX}`;
  return axiosClient.get(url, {
    params: {
      keyword: keyword,
      page: page,
      pageSize: pageSize,
    },
  });
};

const getById = (id) => {
  const url = `${PREFIX}/${id}`;
  return axiosClient.get(url);
};

const updateUser = (id, data) => {
  const url = `${PREFIX}/${id}`;
  return axiosClient.put(url, data);
};

const deleteUserById = (id) => {
  const url = `${PREFIX}/${id}`;
  return axiosClient.delete(url);
};

const UserService = {
  signup,
  getAllUsers,
  getById,
  updateUser,
  deleteUserById
};

export default UserService;
