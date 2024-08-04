import axiosClient from "./axiosClient";

const API_BASE_URL = "http://localhost:8091/admin/orders";

const OrderApi = {
  getAllOrders: async (page) => {
    try {
      const response = await axiosClient.get(`${API_BASE_URL}?page=${page}`);
      return response.data;
    } catch (error) {
      throw new Error("Error fetching orders");
    }
  },

  searchOrders: async (request, page) => {
    try {
      const response = await axiosClient.get(`${API_BASE_URL}/`, {
        params: request,
      });
      return response.data;
    } catch (error) {
      throw new Error("Error searching orders");
    }
  },

  getOrderDetailsById: async (orderId) => {
    try {
      const response = await axiosClient.get(`${API_BASE_URL}/${orderId}`);
      return response.data;
    } catch (error) {
      throw new Error("Error fetching order details");
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await axiosClient.post(`${API_BASE_URL}`, orderData);
      return response.data;
    } catch (error) {
      throw new Error("Error creating order");
    }
  },

  deleteOrder: async (orderId) => {
    try {
      await axiosClient.delete(`${API_BASE_URL}/${orderId}`);
    } catch (error) {
      throw new Error("Error deleting order");
    }
  },

  getByCustomerId: async (customerId) => {
    try {
      const response = await axiosClient.get(
        `${API_BASE_URL}/customers/${customerId}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Error fetching orders by customer ID");
    }
  },

  getAllOrder: async () => {
    try {
      const response = await axiosClient.get(`${API_BASE_URL}/all`);
      return response;
    } catch (error) {
      throw new Error("Error deleting order");
    }
  },
};

export default OrderApi;
