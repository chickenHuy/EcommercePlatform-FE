import { get, post } from "@/lib/httpClient";

export const getAccountStore = async () => {
  try {
    const response = await get(`/api/v1/users/me`);
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin tài khoản store: ", error);
    throw error;
  }
};

export const registerStore = async (data) => {
  try {
    const response = await post("/api/v1/stores/register-store", data);
    return response;
  } catch (error) {
    console.error("Error during creating brand:", error);
    throw error;
  }
};
