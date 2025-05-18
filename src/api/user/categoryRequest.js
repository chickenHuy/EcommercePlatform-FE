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

export const getCategoryPage = (sort = "asc", page = 1, size = 10, search = "") => {
  try {
    const response = get(
      `/api/v1/categories?page=${page}&size=${size}&sort=${sort}&search=${search}`
    );
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
}

