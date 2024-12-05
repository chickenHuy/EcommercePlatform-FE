"use client";

import {
  getCommentAndMediaTotalReview,
  getReviewOneProduct,
} from "@/api/user/reviewRequest";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CircularProgress, Rating } from "@mui/material";
import { Star } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import StoreEmpty from "@/assets/images/storeEmpty.jpg";
import ReviewEmpty from "@/assets/images/reviewEmpty.png";
import Loading from "@/components/loading";

export function Reviews({ productId }) {
  const [listreviews, setListReviews] = useState([]);
  const { toast } = useToast();
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCounts, setRatingCounts] = useState({});
  const [totalComments, setTotalComments] = useState(0);
  const [totalWithMedia, setTotalWithMedia] = useState(0);
  const [starNumber, setStarNumber] = useState("");
  const [commentString, setCommentString] = useState("");
  const [mediaString, setMediaString] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const handleRatingFilterClick = (rating) => {
    setStarNumber(rating);
    setCommentString("");
    setMediaString("");
  };

  const handleCommentFilterClick = (string) => {
    setCommentString(string);
    setMediaString("");
    setStarNumber("");
  };

  const handleMediaFilterClick = (string) => {
    setMediaString(string);
    setCommentString("");
    setStarNumber("");
  };

  const ratingMapping = {
    oneStar: 1,
    twoStar: 2,
    threeStar: 3,
    fourStar: 4,
    fiveStar: 5,
  };

  const fetchReviewOneProduct = useCallback(async () => {
    try {
      const response = await getReviewOneProduct(
        productId,
        starNumber,
        commentString,
        mediaString,
        page
      );
      console.log("ListReviews: ", response.result.data[0].reviews);
      console.log("RatingCounts: ", response.result.data[0].ratingCounts);
      setListReviews(response.result.data[0].reviews);
      setAverageRating(response.result.data[0].productRating);
      setRatingCounts(response.result.data[0].ratingCounts);
    } catch (error) {
      toast({
        title: "Thất bại",
        description:
          error.message === "Unauthenticated"
            ? "Phiên làm việc hết hạn. Vui lòng đăng nhập lại!!!"
            : error.message,
        variant: "destructive",
      });
    }
  }, [toast, productId, starNumber, commentString, mediaString, page]);

  const fetchCommentAndMediaTotalReview = useCallback(async () => {
    try {
      const responseCM = await getCommentAndMediaTotalReview(productId);
      setTotalComments(responseCM.result.totalComments);
      setTotalWithMedia(responseCM.result.totalWithMedia);
    } catch (error) {}
  }, [productId]);

  useEffect(() => {
    setIsLoading(true);
    fetchReviewOneProduct();
    setIsLoading(false);
  }, [fetchReviewOneProduct]);

  useEffect(() => {
    fetchCommentAndMediaTotalReview();
  }, [fetchCommentAndMediaTotalReview]);

  function formatDate(dateString) {
    const date = new Date(dateString);

    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    const timePart = `${hours
      .toString()
      .padStart(2, "0")}:${minutes}:${seconds}`;
    const datePart = date.toLocaleDateString("vi-VN").replace(/\//g, "-");

    return `${timePart} ${datePart}`;
  }

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto mb-[100px] relative">
      {isLoading ? (
        <div className="flex flex-col justify-center items-center z-50 space-y-4 absolute inset-0">
          <Loading />
        </div>
      ) : null}
      <h2 className="text-xl md:text-2xl font-bold">ĐÁNH GIÁ SẢN PHẨM</h2>
      <div className="bg-white rounded-lg p-4 md:p-6 space-y-6">
        {/* Rating Overview */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center md:items-start">
          <div className="flex flex-col justify-center items-center">
            <div className="flex space-x-2">
              <p className="text-4xl md:text-5xl font-bold text-[#ee4d2d]">
                {averageRating}
              </p>
              <p className="self-end text-sm md:text-xl text-[#ee4d2d]">
                trên 5
              </p>
            </div>
            <div className="flex gap-0.5 justify-center my-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 md:w-5 md:h-5 fill-[#ee4d2d] text-[#ee4d2d]"
                />
              ))}
            </div>
          </div>

          <div className="flex-1 space-y-4 w-full md:w-auto">
            {/* Rating Filters */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <Button
                variant="outline"
                className="rounded-sm text-xs md:text-sm"
                onClick={() => handleRatingFilterClick("")}
              >
                Tất Cả
              </Button>
              {Object.entries(ratingCounts)
                .reverse()
                .map(([rating, count]) => {
                  const mappedRating = ratingMapping[rating] || rating;
                  return (
                    <Button
                      key={rating}
                      variant="outline"
                      className="rounded-sm text-xs md:text-sm"
                      onClick={() => handleRatingFilterClick(mappedRating)}
                    >
                      {mappedRating} Sao ({count})
                    </Button>
                  );
                })}
            </div>

            {/* Comment/Photo Filters */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <Button
                variant="outline"
                className="rounded-sm text-xs md:text-sm"
                onClick={() => handleCommentFilterClick("commentString")}
              >
                Có Bình Luận ({totalComments})
              </Button>
              <Button
                variant="outline"
                className="rounded-sm text-xs md:text-sm"
                onClick={() => handleMediaFilterClick("mediaString")}
              >
                Có Hình Ảnh / Video ({totalWithMedia})
              </Button>
            </div>
          </div>
        </div>

        {/* Review List */}
        {listreviews && listreviews.length > 0 ? (
          listreviews.map((listreview) => (
            <div key={listreview.id} className="space-y-6">
              <div className="border-t pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <Avatar className="w-10 h-10 mx-auto md:mx-0">
                    <AvatarImage
                      src={listreview.user.userAvatar || StoreEmpty}
                      alt={listreview.user.userName}
                    />
                    <AvatarFallback>
                      {listreview.user.userName[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-4">
                    <div className="text-center md:text-left">
                      <div className="font-medium">
                        {listreview.user.userName}
                      </div>
                      <div className="flex gap-0.5 justify-center md:justify-start">
                        {Array.from({ length: listreview.rating }).map(
                          (_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-[#ee4d2d] text-[#ee4d2d]"
                            />
                          )
                        )}
                      </div>
                    </div>

                    <div className="text-muted-foreground text-sm text-center md:text-left">
                      {formatDate(listreview.lastUpdatedAt)} | Phân loại
                      hàng:Grey,L
                    </div>

                    <div className="text-sm md:text-base">
                      {listreview.comment}
                    </div>

                    <div className="flex flex-wrap justify-between md:justify-start gap-2 ">
                      {listreview.images?.map((image, i) => (
                        <Image
                          key={i}
                          src={image.url}
                          alt={`Review image ${i + 1}`}
                          width={72}
                          height={72}
                          className="rounded-sm object-cover"
                          unoptimized={true}
                        />
                      ))}
                      {listreview.videoUrl && (
                        <video
                          src={listreview.videoUrl}
                          loop
                          muted
                          autoPlay
                          controls
                          className="w-1/3"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col space-y-4 items-center justify-center bg-black-tertiary bg-opacity-5 w-full min-h-[200px]">
            <p className="text-2xl text-black-primary">
              Chưa có khách hàng nào đánh giá
            </p>
            <Image
              src={ReviewEmpty}
              alt="Review empty"
              width={200}
              height={200}
              className="rounded-sm object-cover"
              unoptimized={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}
