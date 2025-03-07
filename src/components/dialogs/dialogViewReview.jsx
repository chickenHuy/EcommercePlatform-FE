import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Rating } from "@mui/material";
import { formatDate } from "@/utils";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCallback, useEffect, useState } from "react";
import { getAllReviewByStoreId } from "@/api/user/reviewRequest";
import { Button } from "@/components/ui/button";

export function OrderViewReviewDialog(props) {
  const { onOpen, onClose, storeId } = props;

  const [listReview, setListReview] = useState([]);

  const fetchAllReviewByStoreId = useCallback(async () => {
    try {
      const response = await getAllReviewByStoreId(storeId);
      setListReview(response.result);
    } catch (error) {
      console.error("Error fetching all review by storeId: ", error);
    }
  }, [storeId]);

  useEffect(() => {
    fetchAllReviewByStoreId();
  }, [fetchAllReviewByStoreId]);

  useEffect(() => {
    console.log("listReview: ", listReview);
  }, [listReview]);

  const handleClickViewProduct = (slug) => {
    window.open(`/${slug}`, "_blank");
  };

  if (listReview.length > 0) {
    return (
      <Dialog open={onOpen} onOpenChange={onClose}>
        <DialogContent className="z-[150] w-[90vw] max-w-[800px] h-[90vh] max-h-[800px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Đánh Giá Shop
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-[calc(90vh-160px)] max-h-[640px] w-full p-4">
            {listReview.map((viewReview, index) => (
              <div key={index} className="flex flex-col gap-4 mb-12">
                <div
                  className="flex items-center gap-[4px] hover:cursor-pointer"
                  onClick={() => handleClickViewProduct(viewReview.productSlug)}
                >
                  <Image
                    src={viewReview.productMainImageUrl}
                    alt={viewReview.productName}
                    height={100}
                    width={100}
                  />

                  <div className="flex flex-col gap-[4px]">
                    <Label className="text-lg line-clamp-2 hover:cursor-pointer">
                      {viewReview.productName}
                    </Label>

                    <div className="flex flex-wrap gap-[8px] max-h-[72px] overflow-hidden">
                      {viewReview.productValues.map((productValue, index) => (
                        <Label
                          key={index}
                          className="text-sm text-black-primary text-opacity-50 p-[4px] border hover:cursor-pointer"
                        >
                          {productValue.values.join(" - ")}
                        </Label>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-4 ml-8">
                  <Image
                    src={viewReview.userAvatar}
                    alt={viewReview.userName}
                    height={48}
                    width={48}
                    className="h-[48px] w-[48px] rounded-full"
                  />

                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-[4px]">
                      <Label className="text-xs">
                        {viewReview.userAccount}
                      </Label>

                      <Rating
                        value={viewReview.reviewRating}
                        precision={0.1}
                        size="small"
                        readOnly
                      />
                    </div>

                    {viewReview.reviewComment && (
                      <Label className="text-sm">
                        {viewReview.reviewComment}
                      </Label>
                    )}

                    {(viewReview.reviewVideo ||
                      (viewReview.reviewImages &&
                        viewReview.reviewImages.length > 0)) && (
                      <div className="flex items-center gap-4 mt-4">
                        {viewReview.reviewVideo && (
                          <video
                            controls
                            autoPlay
                            muted
                            className="h-[100px] w-[100px]"
                          >
                            <source src={viewReview.reviewVideo} />
                          </video>
                        )}

                        {viewReview.reviewImages.map((image, index) => (
                          <Image
                            key={index}
                            src={image.url}
                            alt={`Ảnh ${index + 1}`}
                            height={100}
                            width={100}
                          />
                        ))}
                      </div>
                    )}

                    <Label className="text-sm text-black-primary text-opacity-50">
                      {formatDate(viewReview.lastUpdatedAt)}
                    </Label>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
}
