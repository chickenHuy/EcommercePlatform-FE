import { get } from "@/lib/httpClient";
export const getStatistics = (
  limit,
  offset,
  from,
  to,
  rangeType,
  groupBy,
  productId,
  storeId,
  type,
  isStore = false
) => {
  try {
    const params = {
      limit,
      offset,
      from,
      to,
      rangeType,
      groupBy,
      productId,
      storeId,
      type,
    };

    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");

    const response = get(
      `/api/v1/reviews/statistics${isStore ? `-store` : ""}?${queryString}`
    );

    return response;
  } catch (error) {
    console.error("Error during get statistics:", error);
  }
};
