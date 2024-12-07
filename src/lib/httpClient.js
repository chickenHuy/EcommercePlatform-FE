import Cookies from "js-cookie";
export const refreshToken = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auths/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: Cookies.get(process.env.NEXT_PUBLIC_JWT_NAME),
      }),
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! Status: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (jsonError) {
        console.error("Error parsing JSON from response", jsonError);
      }

      throw new Error(errorMessage);

    }

    const data = await response.json();
    Cookies.set(process.env.NEXT_PUBLIC_JWT_NAME, data.result.token);
    return data.result.token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

const request = async (
  endpoint,
  { method = "GET", headers = {}, body = null, signal = null, reTryCount = 0 } = {}
) => {
  try {
    const token = Cookies.get(process.env.NEXT_PUBLIC_JWT_NAME);

    const isFormData = body instanceof FormData;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
      {
        method,
        headers: {
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
          ...headers,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: isFormData ? body : body ? JSON.stringify(body) : null,
        signal,
      }
    );

    if (!response.ok) {
      let errorMessage = `HTTP error! Status: ${response.status}`;
      if (response.status === 401 && reTryCount < 1) {
        await refreshToken();
        return request(endpoint, { method, headers, body, signal, reTryCount: 1 });
      }
      else {
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (jsonError) {
          console.error("Error parsing JSON from response", jsonError);
        }

        throw new Error(errorMessage);
      }
    }

    return await response.json();
  } catch (error) {
    console.error("HTTP Client Error:", error);
    throw error;
  }
};

const get = (endpoint, options = {}) => {
  return request(endpoint, { method: "GET", ...options });
};

const post = (endpoint, body, options = {}) => {
  return request(endpoint, { method: "POST", body, ...options });
};

const put = (endpoint, body, options = {}) => {
  return request(endpoint, { method: "PUT", body, ...options });
};

const del = (endpoint, body, options = {}) => {
  return request(endpoint, { method: "DELETE", body, ...options });
};

const patch = (endpoint, body, options = {}) => {
  return request(endpoint, { method: "PATCH", body, ...options });
}

export { get, post, put, del, patch };
