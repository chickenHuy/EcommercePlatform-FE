import { get, put } from "@/lib/httpClient";

export const getAllOrderByUser = (
  page,
  sortType,
  orderType,
  search,
  filter
) => {
  try {
    const response = get(
      `/api/v1/orders/user?sort=${sortType}&order=${orderType}&page=${page}&size=8&search=${search}&filter=${filter}`
    );
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};

export const cancelOrderByUser = (orderId) => {
  try {
    const response = put(`/api/v1/orders/${orderId}/cancel/user`);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};

export const getOneOrderByUser = (orderId) => {
  try {
    const response = get(`/api/v1/orders/${orderId}/user`);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};
