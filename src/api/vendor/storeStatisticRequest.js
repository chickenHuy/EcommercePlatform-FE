import { get } from "@/lib/httpClient";

export const getStoreStatistic = async () => {
  try {
    const response = await get(`/api/v1/stores/statistic`);
    return response;
  } catch (error) {
    console.error("Error during get statistic:", error);
    throw error;
  }
};
