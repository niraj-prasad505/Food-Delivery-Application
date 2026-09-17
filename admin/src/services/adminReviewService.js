import api from "./api";

// Fetch reviews for owner's shops with optional filters (shopId, rating, search)
export const getMyReviews = async (params = {}) => {
  const response = await api.get("/owner/reviews", { params });
  return response.data;
};

// Delete / remove an inappropriate review
export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/owner/reviews/${reviewId}`);
  return response.data;
};