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
    console.error("Error during getAllOrderByUser: ", error);
    throw error;
  }
};

export const cancelOrderByUser = (orderId) => {
  try {
    const response = put(`/api/v1/orders/${orderId}/cancel/user`);
    return response;
  } catch (error) {
    console.error("Error during cancelOrderByUser: ", error);
    throw error;
  }
};

export const getOneOrderByUser = (orderId) => {
  try {
    const response = get(`/api/v1/orders/${orderId}/user`);
    return response;
  } catch (error) {
    console.error("Error during getOneOrderByUser: ", error);
    throw error;
  }
};

export const isAllOrderReviewed = (orderId) => {
  try {
    const response = get(
      `/api/v1/reviews/order/${orderId}/is_all_order_reviewed`
    );
    return response;
  } catch (error) {
    console.error("Error during isAllOrderReviewed: ", error);
    throw error;
  }
};

export const isAnyOrderReviewed = (orderId) => {
  try {
    const response = get(
      `/api/v1/reviews/order/${orderId}/is_any_order_reviewed`
    );
    return response;
  } catch (error) {
    console.error("Error during isAnyOrderReviewed: ", error);
    throw error;
  }
};
