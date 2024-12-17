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
import { useInView } from "react-intersection-observer";

export default function Reviews({ productId }) {
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
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();
  const [isLoading, setIsLoading] = useState(false);
  const size = 2;

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

  const fetchReviewOneProduct = useCallback(
    async (isInitialLoad = false) => {
      if (isLoading || (!hasMore && !isInitialLoad) || page == null) return;
      setIsLoading(true);
      try {
        const response = await getReviewOneProduct(
          productId,
          starNumber,
          commentString,
          mediaString,
          isInitialLoad ? 1 : page,
          size
        );
        setAverageRating(response.result.data[0].productRating);
        setRatingCounts(response.result.data[0].ratingCounts);
        const newReviews = response.result.data[0].reviews;
        if (newReviews.length === 0) {
          setHasMore(false);
        } else {
          setListReviews((prevReviews) =>
            isInitialLoad ? newReviews : [...prevReviews, ...newReviews]
          );
          setPage(response.result.nextPage);
        }
      } catch (error) {
        console.error("Error loading products:", error);
        toast({
          title: "Error",
          description: "Failed to load review of product. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },

    [
      productId,
      starNumber,
      commentString,
      mediaString,
      page,
      isLoading,
      hasMore,
    ]
  );

  const fetchCommentAndMediaTotalReview = useCallback(async () => {
    try {
      const responseCM = await getCommentAndMediaTotalReview(productId);
      setTotalComments(responseCM.result.totalComments);
      setTotalWithMedia(responseCM.result.totalWithMedia);
    } catch (error) {}
  }, [productId]);

  useEffect(() => {
    setListReviews([]);
    setPage(1);
    setHasMore(true);
    fetchReviewOneProduct(true);
    fetchCommentAndMediaTotalReview();
  }, [productId, starNumber, commentString, mediaString]);

  useEffect(() => {
    if (inView && !isLoading) {
      fetchReviewOneProduct();
    }
  }, [fetchReviewOneProduct, inView]);

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
    <div className="space-y-6 p-4 max-w-4xl mx-auto relative">
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
        <>
          {listreviews.map((listreview) => (
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
          ))}
          {hasMore && (
            <div ref={ref} className="col-span-full flex justify-center p-4">
              {isLoading && <Loading />}
            </div>
          )}
        </>
        {listreviews.length === 0 && (
          <div className="flex flex-col space-y-4 items-center justify-center bg-white-tertiary bg-opacity-15 rounded-xl w-full min-h-[200px]">
            <Image
              src={ReviewEmpty}
              alt="Review empty"
              width={400}
              height={200}
              className="rounded-sm object-cover opacity-20"
              unoptimized={true}
            />
            <p className="text-xl text-gray-tertiary pb-5">
              Chưa có đánh giá phù hợp với bộ lọc
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
