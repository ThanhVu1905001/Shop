import axiosClient from "./axiosClient";

const PREFIX = "http://localhost:8091/admin/customers";

const getCustomers = (keyword, page, pageSize) => {
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

const addCustomer = (data) => {
  const url = `${PREFIX}`;
  return axiosClient.post(url, data);
};

const updateCustomer = (id, data) => {
  const url = `${PREFIX}/${id}`;
  return axiosClient.put(url, data);
};

const deleteCustomer = (id) => {
  const url = `${PREFIX}/${id}`;
  return axiosClient.delete(url);
};

const getAllCustomers = () => {
  const url = `${PREFIX}/all`;
  return axiosClient.get(url);
};

const customerApi = {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  getById,
  getAllCustomers,
};

export default customerApi;
