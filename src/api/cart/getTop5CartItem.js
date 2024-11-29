import { get} from "@/lib/httpClient";

export const getTop5CartItems = () => {
  try {
    const response = get(
      `/api/v1/cartItems/top5`
    );
    return response;
  } catch (error) {
    throw error;
  }
};
