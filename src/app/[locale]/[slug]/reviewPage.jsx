"use client";

import {
  getCommentAndMediaTotalReview,
  getReviewOneProduct,
} from "@/api/user/reviewRequest";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import StoreEmpty from "@/assets/images/storeEmpty.jpg";
import ReviewEmpty from "@/assets/images/ReviewEmpty.png";
import Loading from "@/components/loading";
import { useInView } from "react-intersection-observer";
import { formatDate, getCloudinaryThumbnail } from "@/utils";
import { Label } from "@/components/ui/label";
import MediaViewer from "@/components/media-view";

export default function Reviews({ productId, t }) {
  const [listReviews, setListReviews] = useState([]);
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
          size,
        );
        setAverageRating(response.result.data[0].productRating);
        setRatingCounts(response.result.data[0].ratingCounts);
        const newReviews = response.result.data[0].reviews;
        if (newReviews.length === 0) {
          setHasMore(false);
        } else {
          setListReviews((prevReviews) =>
            isInitialLoad ? newReviews : [...prevReviews, ...newReviews],
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
    ],
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

  return (
    <>
      <div className="w-full space-y-3 relative">
        <span className="text-[1.5em] text-center">
          {t("text_review_product")}
        </span>

        <div className="space-y-7">
          <div className="p-8 flex sm:flex-row flex-col justify-start gap-3 items-center bg-red-primary bg-opacity-5">
            <div className="flex flex-col justify-center items-center">
              <div className="flex flex-row items-center gap-3">
                <span className="text-[2.5em] font-[900] text-[#ee4d2d]">
                  {averageRating ? averageRating.toFixed(1) : "0.0"}
                </span>
                <span className="text-[1em] text-[#ee4d2d]">
                  {t("text_over_5")}
                </span>
              </div>

              <div className="flex justify-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-6 h-6 fill-[#ee4d2d] text-[#ee4d2d]"
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex gap-3 flex-wrap">
                <Button
                  variant="outline"
                  className={`rounded-sm text-[.9em] ${
                    starNumber === "" &&
                    commentString === "" &&
                    mediaString === ""
                      ? `border-[#ee4d2d] text-[#ee4d2d] hover:text-[#ee4d2d]`
                      : null
                  }`}
                  onClick={() => handleRatingFilterClick("")}
                >
                  {t("text_all")}
                </Button>

                {Object.entries(ratingCounts)
                  .reverse()
                  .map(([rating, count]) => {
                    const mappedRating = ratingMapping[rating];
                    return (
                      <Button
                        key={rating}
                        variant="outline"
                        className={`rounded-sm text-[.9em] ${
                          starNumber === mappedRating
                            ? "border-[#ee4d2d] text-[#ee4d2d] hover:text-[#ee4d2d]"
                            : null
                        }`}
                        onClick={() => handleRatingFilterClick(mappedRating)}
                      >
                        {mappedRating} {t("text_star")} ({count})
                      </Button>
                    );
                  })}
              </div>

              <div className="flex gap-3 flex-wrap">
                <Button
                  variant="outline"
                  className={`rounded-sm text-[.9em] ${
                    commentString === "commentString"
                      ? "border-[#ee4d2d] text-[#ee4d2d] hover:text-[#ee4d2d]"
                      : null
                  }`}
                  onClick={() => handleCommentFilterClick("commentString")}
                >
                  {t("text_have_comment")} ({totalComments})
                </Button>

                <Button
                  variant="outline"
                  className={`rounded-sm text-[.9em] ${
                    mediaString === "mediaString"
                      ? "border-[#ee4d2d] text-[#ee4d2d] hover:text-[#ee4d2d]"
                      : null
                  }`}
                  onClick={() => handleMediaFilterClick("mediaString")}
                >
                  {t("text_have_media")} ({totalWithMedia})
                </Button>
              </div>
            </div>
          </div>

          <>
            {listReviews.map((listreview) => (
              <div key={listreview.id} className="space-y-8 relative">
                <div className="border-t py-4">
                  <div className="flex gap-3">
                    <Avatar className="w-14 h-14 shadow-md">
                      <AvatarImage
                        src={listreview.user.userAvatar || StoreEmpty}
                        alt={listreview.user.userName}
                      />

                      <AvatarFallback>
                        {listreview.user.userName[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col space-y-3">
                      <div className="flex flex-col">
                        <span className="text-[1em]">
                          {listreview.user.userName}
                        </span>

                        <div className="flex">
                          {Array.from({ length: listreview.rating }).map(
                            (_, i) => (
                              <Star
                                key={i}
                                className="w-4 h-4 fill-[#ee4d2d] text-[#ee4d2d]"
                              />
                            ),
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 items-center flex-wrap">
                        <span className="text-[.9em] text-muted-foreground">
                          {formatDate(listreview.lastUpdatedAt)} |{" "}
                          {t("text_classification")}
                        </span>

                        <div className="flex flex-wrap gap-4 max-h-[72px] overflow-scroll">
                          {listreview.productValues.map(
                            (productValue, index) => (
                              <span
                                key={index}
                                className="text-[.9em] px-2 border rounded-sm"
                              >
                                {productValue.values?.join(" - ")}
                              </span>
                            ),
                          )}
                        </div>
                      </div>

                      <span className="text-[.9em]">{listreview.comment}</span>

                      {(listreview.videoUrl ||
                        (listreview.images &&
                          listreview.images.length > 0)) && (
                        <div className="flex flex-wrap gap-3 w-full h-fit">
                          {listreview.videoUrl && (
                            <MediaViewer
                              thumbnailUrl={getCloudinaryThumbnail(
                                listreview.videoUrl,
                              )}
                              mediaUrl={listreview.videoUrl}
                              isVideo={true}
                              thumbnailSize="w-24 h-24 border rounded-sm"
                            />
                          )}

                          {listreview.images.map((image, index) => (
                            <MediaViewer
                              key={index}
                              thumbnailUrl={image.url}
                              mediaUrl={image.url}
                              isVideo={false}
                              thumbnailSize="w-24 h-24 border rounded-sm"
                            />
                          ))}
                        </div>
                      )}
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

          {listReviews.length === 0 && (
            <div className="flex flex-col space-y-4 items-center justify-center bg-white-primary rounded-xl w-full min-h-[200px]">
              <Image
                src={ReviewEmpty}
                alt="Review empty"
                width={200}
                height={200}
                className="rounded-sm object-cover"
              />
              <Label className="text-xl text-black-primary text-opacity-50">
                {t("text_no_reviews")}
              </Label>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
