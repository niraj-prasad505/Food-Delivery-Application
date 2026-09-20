import axios from "axios";

const API_URL = "http://localhost:5000/api/orders";

export const createOrder = async (orderData) => {
  const response = await axios.post(`${API_URL}/create`, orderData, {
    withCredentials: true,
  });
  return response.data;
};

export const createRazorpayOrder = async (amount) => {
  const response = await axios.post(
    `${API_URL}/razorpay-order`,
    { amount },
    { withCredentials: true }
  );
  return response.data;
};

export const verifyPayment = async (paymentData) => {
  const response = await axios.post(`${API_URL}/verify-payment`, paymentData, {
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