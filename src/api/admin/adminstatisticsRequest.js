import { get } from "@/lib/httpClient";

export const getAdminStatistic = () => {
  try {
    const response = get(`/api/v1/admin/statistic`);
    return response;
  } catch (error) {
    console.error("Error during get admin statistic:", error);
    throw error;
  }
};

export const getRevenueOneYear = (year, month) => {
  try {
    const response = get(`/api/v1/admin/revenue?year=${year}&month=${month}`);
    return response;
  } catch (error) {
    console.error("Error during get revenue one year:", error);
    throw error;
  }
};
