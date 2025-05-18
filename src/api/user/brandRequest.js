import { get } from "@/lib/httpClient";

export const getAllBrand = () => {
  try {
    const response = get(`/api/v1/brands/all`);
    return response;
  } catch (error) {
    console.error("Error during getProductBestSelling: ", error);
    throw error;
  }
};

export const getBrandPage = (
  size = 10,
  page = 1,
  sortBy = "asc",
  orderBy = "createdAt",
  search = "",
) => {
  try {
    const response = get(
      `/api/v1/brands?page=${page}&size=${size}&sortBy=${sortBy}&orderBy=${orderBy}&search=${search}`,
    );
    return response;
  } catch (error) {
    console.error("Error during get all brand:", error);
    throw error;
  }
};
