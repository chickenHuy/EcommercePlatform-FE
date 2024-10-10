import { post } from "@/lib/httpClient";

export const authenticateWithGoogle = async (authCode) => {
  try {
    const response = await post(
      `/api/v1/external-auths/authentication/google?code=${authCode}`
    );
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error; // Re-throw the error to handle it in the component
  }
};
