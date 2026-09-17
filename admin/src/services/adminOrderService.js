import api from "./api";

// Fetch all orders with query filters (status, shopId, search)
export const getMyOrders = async (params = {}) => {
  const response = await api.get("/owner/orders", { params });
  return response.data;
};

// Fetch single order details
export const getOrderById = async (orderId) => {
  const response = await api.get(`/owner/orders/${orderId}`);
  return response.data;
};

// Update order status (pending, confirmed, preparing, out_for_delivery, delivered, cancelled)
export const updateOrderStatus = async (orderId, status) => {
  const response = await api.patch(`/owner/orders/${orderId}/status`, { status });
  return response.data;
};

// Update payment status (pending, paid, failed, refunded)
export const updatePaymentStatus = async (orderId, paymentStatus) => {
  const response = await api.patch(`/owner/orders/${orderId}/payment`, { paymentStatus });
  return response.data;
};