import { get, put, del } from "@/lib/httpClient";

export const getAllCart = (page) => {
  try {
    const response = get(`/api/v1/carts?page=${page}&size=8&sort=createdAt&order=desc`);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
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
    console.error("Error during authentication:", error);
    throw error;
  }
};

export const deleteCartItem = (cartItemId) => {
  try {
    const response = del(`/api/v1/cartItems/${cartItemId}`);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};
