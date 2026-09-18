import axios from "axios";

const API_URL = "http://localhost:5000/api/orders";

export const createOrder = async (orderData) => {
  const response = await axios.post(`${API_URL}/create`, orderData, {
    withCredentials: true,
  });
  return response.data;
};

export const getMyOrders = async () => {
  const response = await axios.get(`${API_URL}/my-orders`, {
    withCredentials: true,
  });
  return response.data;
};