import { get, post } from "@/lib/httpClient";

export const createReview = (reviewRequest) => {
  try {
    const response = post(`/api/v1/reviews`, reviewRequest);
    return response;
  } catch (error) {
    console.error("Error during createReview: ", error);
    throw error;
  }
};

export const uploadReviewListImage = async (listImage, reviewId) => {
  try {
    const formData = new FormData();

    listImage.forEach((image) => {
      formData.append("images", image);
    });

    const response = await post(
      `/api/v1/images/reviews/${reviewId}/list`,
      formData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const uploadVideoReview = async (file, reviewId) => {
  try {
    const formData = new FormData();
    formData.append("video", file);

    const response = await post(`/api/v1/videos/reviews/${reviewId}`, formData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getReviewOneProduct = (
  productId,
  starNumber,
  commentString,
  mediaString,
  page,
  size
) => {
  try {
    const response = get(
      `/api/v1/reviews/product/${productId}?sort=createdAt&order=desc&page=${page}&size=${size}&starNumber=${starNumber}&commentString=${commentString}&mediaString=${mediaString}`
    );
    return response;
  } catch (error) {
    console.error("Error during getReviewOneProduct: ", error);
    throw error;
  }
};

export const getCommentAndMediaTotalReview = (productId) => {
  try {
    const response = get(
      `/api/v1/reviews/product/${productId}/comment-media-total`
    );
    return response;
  } catch (error) {
    console.error("Error during getCommentAndMediaTotalReview: ", error);
    throw error;
  }
};

export const getAllReviewByStoreId = (storeId) => {
  try {
    const response = get(`/api/v1/reviews/store/${storeId}`);
    return response;
  } catch (error) {
    console.error("Error during getAllReviewByStoreId: ", error);
    throw error;
  }
};

export const getAllProductReview = (orderId) => {
  try {
    const response = get(`/api/v1/reviews/order/${orderId}/product`);
    return response;
  } catch (error) {
    console.error("Error during getAllProductReview: ", error);
    throw error;
  }
};
