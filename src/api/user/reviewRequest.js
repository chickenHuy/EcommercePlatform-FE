import { get, post } from "@/lib/httpClient";

export const createReview = (reviewRequest) => {
  try {
    const response = post(`/api/v1/reviews`, reviewRequest);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};

export const uploadReviewListImage = async (listFile, reviewId) => {
  try {
    console.log("LIST IMAGE: ", listFile);
    const formData = new FormData();

    listFile.forEach((file) => {
      formData.append("images", file);
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
  console.log("VIDEO: ", file);
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
    console.error("Error during authentication:", error);
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
    console.error("Error during authentication:", error);
    throw error;
  }
};
