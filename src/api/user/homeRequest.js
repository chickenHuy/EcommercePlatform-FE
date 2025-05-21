import { get } from "@/lib/httpClient";

export const getProductBestSelling = (page, size, limit) => {
  try {
    const response = get(
      `/api/v1/products/best_selling?page=${page}&size=${size}&limit=${limit}`
    );
    return response;
  } catch (error) {
    console.error("Error during getProductBestSelling: ", error);
    throw error;
  }
};

export const getProductBestInteraction = (page, size, limit) => {
  try {
    const response = get(
      `/api/v1/products/best_interaction?page=${page}&size=${size}&limit=${limit}`
    );
    return response;
  } catch (error) {
    console.error("Error during getProductBestInteraction: ", error);
    throw error;
  }
};