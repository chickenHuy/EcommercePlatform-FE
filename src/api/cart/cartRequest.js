import { get, put, del } from "@/lib/httpClient";

export const getAllCart = (page, size) => {
  try {
    const response = get(`/api/v1/carts?page=${page}&size=${size}`);
    return response;
  } catch (error) {
    console.error("Error during getAllCart:", error);
    throw error;
  }
};

export const changeQuantity = (cartItemId, quantityUpdate) => {
  try {
    const response = put(
      `/api/v1/cartItems/${cartItemId}/change-quantity`,
      quantityUpdate
    );
    return response;
  } catch (error) {
    console.error("Error during changeQuantity:", error);
    throw error;
  }
};

export const deleteCartItem = (cartItemId) => {
  try {
    const response = del(`/api/v1/cartItems/${cartItemId}`);
    return response;
  } catch (error) {
    console.error("Error during deleteCartItem:", error);
    throw error;
  }
};

export const getQuantityCartItem = (cartItemId) => {
  try {
    const response = get(`/api/v1/cartItems/get_quantity?cartItemId=${cartItemId}`);
    return response;
  } catch (error) {
    console.error("Error during getQuantityCartItem:", error);
    throw error;
  }
};
