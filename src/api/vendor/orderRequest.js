import { get, put } from "@/lib/httpClient";

export const getAllOrder = (page, sortType, search) => {
  try {
    const response = get(
      `/api/v1/orders?page=${page}&size=4&sort=${sortType}&search=${search}`
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

export const updateOrderStatus = (orderId) => {
  try {
    const response = put(`/api/v1/orders/${orderId}/status`);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};
