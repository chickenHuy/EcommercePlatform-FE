import { post } from "@/lib/httpClient";

export const addToCart = (body) => {
    try {
      const response = post(
        `/api/v1/cartItems`, body
      );
      return response;
    } catch (error) {
      throw error;
    }
  };