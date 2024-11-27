import { get, put } from "@/lib/httpClient";

export const getAllCart = (page) => {
  try {
    const response = get(
      `/api/v1/carts?page=${page}&size=8`
    );
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};
