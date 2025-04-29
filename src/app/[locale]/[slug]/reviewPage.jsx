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
import ReviewEmpty from "@/assets/images/reviewEmpty.png";
import Loading from "@/components/loading";
import { useInView } from "react-intersection-observer";
import { formatDate } from "@/utils";
import { Label } from "@/components/ui/label";

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
    } catch (error) { }
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
      <div className="w-[900px] space-y-4 p-4 relative">
        <Label className="text-2xl font-bold ml-4">{t("text_review_product")}</Label>

        <div className="space-y-8">
          <div className="flex gap-4 p-8 bg-red-primary bg-opacity-5">
            <div className="flex flex-col justify-center items-center gap-[8px]">
              <div className="flex space-x-2">
                <Label className="text-4xl font-bold text-[#ee4d2d]">
                  {averageRating ? averageRating.toFixed(1) : "0.0"}
                </Label>
                <Label className="self-end text-lg text-[#ee4d2d]">
                  {t("text_over_5")}
                </Label>
              </div>

              <div className="flex gap-[2px] justify-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-6 h-6 fill-[#ee4d2d] text-[#ee4d2d]"
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className={`rounded-sm text-sm ${starNumber === "" &&
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
                        className={`rounded-sm text-sm ${starNumber === mappedRating
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

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className={`rounded-sm text-sm ${commentString === "commentString"
                      ? "border-[#ee4d2d] text-[#ee4d2d] hover:text-[#ee4d2d]"
                      : null
                    }`}
                  onClick={() => handleCommentFilterClick("commentString")}
                >
                  {t("text_have_comment")} ({totalComments})
                </Button>

                <Button
                  variant="outline"
                  className={`rounded-sm text-sm ${mediaString === "mediaString"
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
                <div className="border-t-2 pt-4">
                  <div className="flex gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={listreview.user.userAvatar || StoreEmpty}
                        alt={listreview.user.userName}
                      />

                      <AvatarFallback>
                        {listreview.user.userName[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col space-y-4">
                      <div className="flex flex-col">
                        <Label className="text-sm">
                          {listreview.user.userName}
                        </Label>

                        <div className="flex gap-[2px]">
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

                      <div className="flex">
                        <Label className="text-muted-foreground text-sm w-[260px]">
                          {formatDate(listreview.lastUpdatedAt)} | {t("text_classification")}
                        </Label>

                        <div className="flex flex-wrap gap-4 w-[640px] max-h-[72px] overflow-hidden">
                          {listreview.productValues.map(
                            (productValue, index) => (
                              <Label
                                key={index}
                                className="text-muted-foreground text-xs p-[4px] border"
                              >
                                {productValue.values?.join(" - ")}
                              </Label>
                            )
                          )}
                        </div>
                      </div>

                      <Label className="text-sm">{listreview.comment}</Label>

                      {(listreview.videoUrl ||
                        (listreview.images &&
                          listreview.images.length > 0)) && (
                          <div className="flex gap-4 h-[100px] w-[100px]">
                            {listreview.videoUrl && (
                              <video
                                src={listreview.videoUrl}
                                loop
                                muted
                                autoPlay
                                controls
                              />
                            )}

                            {listreview.images.map((image, i) => (
                              <Image
                                key={i}
                                src={image.url}
                                alt={`Review image ${i + 1}`}
                                width={100}
                                height={100}
                                className="rounded-sm object-cover"
                                unoptimized={true}
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
                unoptimized={true}
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
