import { get, put } from "@/lib/httpClient";

export const getAllOrderByAdmin = (
  page,
  sortType,
  orderType,
  search,
  filter
) => {
  try {
    const response = get(
      `/api/v1/orders/admin?sort=${sortType}&order=${orderType}&page=${page}&size=8&search=${search}&filter=${filter}`
    );
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};

export const getOneOrderByAdmin = (orderId) => {
  try {
    const response = get(`/api/v1/orders/${orderId}/admin`);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};

export const updateOrderStatusByAdmin = (orderId) => {
  try {
    const response = put(`/api/v1/orders/${orderId}/update-status/admin`);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};

export const cancelOrderByAdmin = (orderId) => {
  try {
    const response = put(`/api/v1/orders/${orderId}/cancel/admin`);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};
