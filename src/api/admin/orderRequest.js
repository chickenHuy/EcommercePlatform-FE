import { get, put } from "@/lib/httpClient";

export const getAllOrderByAdmin = (
  page,
  size,
  sortBy,
  orderBy,
  search,
  filter
) => {
  try {
    const response = get(
      `/api/v1/orders/admin?page=${page}&size=${size}&sortBy=${sortBy}&orderBy=${orderBy}&search=${search}&filter=${filter}`
    );
    return response;
  } catch (error) {
    console.error("Error during get all order by admin:", error);
    throw error;
  }
};

export const getOneOrderByAdmin = (orderId) => {
  try {
    const response = get(`/api/v1/orders/${orderId}/admin`);
    return response;
  } catch (error) {
    console.error("Error during get one order by admin:", error);
    throw error;
  }
};

export const updateOneOrderByAdmin = (orderId) => {
  try {
    const response = put(`/api/v1/orders/${orderId}/update-status/admin`);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};

export const cancelOneOrderByAdmin = (orderId) => {
  try {
    const response = put(`/api/v1/orders/${orderId}/cancel/admin`);
    return response;
  } catch (error) {
    console.error("Error during cancelOneOrderByAdmin:", error);
    throw error;
  }
};

export const cancelListOrderByAdmin = (listOrderId) => {
  try {
    const response = put(`/api/v1/orders/list/cancel/admin`, {
      listOrderId: listOrderId,
    });
    return response;
  } catch (error) {
    console.error("Error during cancelListOrderByAdmin:", error);
    throw error;
  }
};

export const updateListOrderByAdmin = (listOrderId) => {
  try {
    const response = put(`/api/v1/orders/list/update-status/admin`, {
      listOrderId: listOrderId,
    });
    return response;
  } catch (error) {
    console.error("Error during updateStatusListOrderByAdmin:", error);
    throw error;
  }
};
