import { get, post, put, del } from "@/lib/httpClient";

export const verifyEmail = (emailToken) => {
  try {
    const response = post(`/api/v1/emails/verify`, emailToken);
    return response;
  } catch (error) {
    console.error("Error during send mail validation:", error);
    throw error;
  }
};
