import { get} from "@/lib/httpClient";

export const countQuantity = () => {
  try {
    const response = get(
      `/api/v1/cartItems/count`
    );
    return response;
  } catch (error) {
    throw error;
  }
};
