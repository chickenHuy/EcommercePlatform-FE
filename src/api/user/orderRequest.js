import { get, put } from "@/lib/httpClient";

export const getAllOrderByUser = (
  page,
  size,
  sortBy,
  orderBy,
  search,
  filter
) => {
  try {
    const response = get(
      `/api/v1/orders/user?page=${page}&size=${size}&sortBy=${sortBy}&orderBy=${orderBy}&search=${search}&filter=${filter}`
    );
    return response;
  } catch (error) {
    console.error("Error during get all order by user:", error);
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
    console.error("Error during get on order by user:", error);
    throw error;
  }
};
