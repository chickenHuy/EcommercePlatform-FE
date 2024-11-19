const { get } = require("@/lib/httpClient");

export const getSuggestions = async (keyword) => {
  try {
    const response = await get(
      `/api/v1/search/auto-suggest?keyword=${encodeURIComponent(keyword)}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};
