import { get, put } from "@/lib/httpClient";

export const getAllOrderBySeller = (page, sortType, orderType, search) => {
  try {
    const response = get(
      `/api/v1/orders/seller?sortBy=${sortType}&orderBy=${orderType}&page=${page}&size=8&search=${search}`
    );
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};

export const getOrderById = (orderId) => {
  try {
    const response = get(`/api/v1/orders/${orderId}`);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};

export const updateOrderStatusBySeller = (orderId) => {
  try {
    const response = put(`/api/v1/orders/${orderId}/update-status/seller`);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};

export const cancelOrderBySeller = (orderId) => {
  try {
    const response = put(`/api/v1/orders/${orderId}/cancel/seller`);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};
