import { post, get, put, del } from "@/lib/httpClient";
export const createAddress = async (addressData) => {
  try {
    const response = await post("/api/v1/addresses", addressData);
    return response;
  } catch (error) {
    console.error("Error during create address:", error);
    throw error;
  }
};

export const updateAddress = async (addressData, id) => {
  try {
    console.log("addressData", addressData);
    console.log("id", id);
    const response = await put(`/api/v1/addresses/${id}`, addressData);
    return response;
  } catch (error) {
    console.error("Error during create address:", error);
    throw error;
  }
};

export const setDefaultAddress = async (id) => {
  try {
    const response = await put("/api/v1/users/default-address", {
      addressId: id,
    });
    return response;
  } catch (error) {
    console.error("Error during set default address:", error);
    throw error;
  }
};

export const getAddresses = async (currentPage, itemsPerPage) => {
  try {
    const response = await get(
      `/api/v1/addresses?page=${currentPage}&size=${itemsPerPage}`
    );
    return response;
  } catch (error) {
    console.error("Error during update address:", error);
    throw error;
  }
};

export const getAddress = async (id) => {
  try {
    const response = await get(
      `/api/v1/addresses/${id}`
    );
    return response;
  } catch (error) {
    console.error("Error during update address:", error);
    throw error;
  }
};


export const deleteAddress = async (id) => {
  try {
    const response = await del(`/api/v1/addresses/${id}`);
    return response;
  } catch (error) {
    console.error("Error during delete address:", error);
    throw error;
  }
}