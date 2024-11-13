import { del, patch, get } from "@/lib/httpClient";

export const getProducts = async (page, sortBy, order, tab, search) => {
    try {
        const response = await get(
          `/api/v1/products/?tab=${tab}&page=${page}&size=10&sortBy=${sortBy}&order=${order}&search=${search}`
        );
        return response;
    } catch (error) {
        console.error("Error during get products:", error);
        throw error;
    }
}

export const updateProductStatus = async (id) => {
    try {
      const response = await patch(
        `/api/v1/products/${id}/status`
      );
      return response;
    } catch (error) {
      console.error("Error during get products:", error);
      throw error;
    }
}

export const deleteProduct = async (id) => {
  try {
    const response = await del(`/api/v1/products/${id}`);
    return response;
  } catch (error) {
    console.error("Error during get products:", error);
    throw error;
  }
};