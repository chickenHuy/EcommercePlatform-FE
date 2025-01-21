import { get, put } from "@/lib/httpClient";

export const getAllOrderBySeller = (
  page,
  size,
  sortBy,
  orderBy,
  search,
  filter
) => {
  try {
    const response = get(
      `/api/v1/orders/seller?page=${page}&size=${size}&sortBy=${sortBy}&orderBy=${orderBy}&search=${search}&filter=${filter}`
    );
    return response;
  } catch (error) {
    console.error("Error during get all order by seller: ", error);
    throw error;
  }
};

export const getOneOrderBySeller = (orderId) => {
  try {
    const response = get(`/api/v1/orders/${orderId}/seller`);
    return response;
  } catch (error) {
    console.error("Error during get one order by seller: ", error);
    throw error;
  }
};

export const updateOneOrderBySeller = (orderId) => {
  try {
    const response = put(`/api/v1/orders/${orderId}/update-status/seller`);
    return response;
  } catch (error) {
    console.error("Error during updateOneOrderBySeller:", error);
    throw error;
  }
};

export const updateListOrderBySeller = (listOrderId) => {
  try {
    const response = put(`/api/v1/orders/list/update-status/seller`, {
      listOrderId: listOrderId,
    });
    return response;
  } catch (error) {
    console.error("Error during updateListOrderBySeller:", error);
    throw error;
  }
};

export const cancelOneOrderBySeller = (orderId) => {
  try {
    const response = put(`/api/v1/orders/${orderId}/cancel/seller`);
    return response;
  } catch (error) {
    console.error("Error during cancelOneOrderBySeller:", error);
    throw error;
  }
};

export const cancelListOrderBySeller = (listOrderId) => {
  try {
    const response = put(`/api/v1/orders/list/cancel/seller`, {
      listOrderId: listOrderId,
    });
    return response;
  } catch (error) {
    console.error("Error during cancelListOrderBySeller:", error);
    throw error;
  }
};
