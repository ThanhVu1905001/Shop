import axiosClient from "./axiosClient";

const PREFIX = "http://localhost:8091/admin/products";

const getProducts = (keyword, page, pageSize) => {
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

const addProduct = (data) => {
  const url = `${PREFIX}`;
  return axiosClient.post(url, data);
};

const updateProduct = (id, data) => {
  const url = `${PREFIX}/${id}`;
  return axiosClient.put(url, data);
};

const deleteProduct = (id) => {
  const url = `${PREFIX}/${id}`;
  return axiosClient.delete(url);
};

const getAllProducts = () => {
  const url = `${PREFIX}/all`;
  return axiosClient.get(url);
};

const updateQuantity = (data) => {
  const url = `${PREFIX}/updateQuantities`;
  return axiosClient.put(url, data);
};

const productApi = {
  getProducts,
  getById,
  addProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  updateQuantity,
};

export default productApi;
