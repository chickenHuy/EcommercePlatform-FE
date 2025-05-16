import { get } from "@/lib/httpClient";

export const getAllCategory = () => {
  try {
    const response = get(
      `/api/v1/categories/all`
    );
    return response;
  } catch (error) {
    console.error("Error during getProductBestSelling: ", error);
    throw error;
  }
};

