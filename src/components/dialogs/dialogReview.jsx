"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Camera, Video, X } from "lucide-react";
import {
  createReview,
  uploadReviewListImage,
  uploadVideoReview,
} from "@/api/user/reviewRequest";
import { CircularProgress } from "@mui/material";

export function OrderReviewDialog({ onOpen, onClose, order, toast }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [errorComment, setErrorComment] = useState(null);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loadPage, setLoadPage] = useState(false);
  const videoInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const products = order.orderItems;

  const maxImageSize = 10 * 1024 * 1024;
  const maxVideoSize = 40 * 1024 * 1024;
  const maxVideoDuration = 180;

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files)
        .map((file) => {
          if (file.size > maxImageSize) {
            alert("Kích thước ảnh phải nhỏ hơn 10MB");
            return null;
          }
          return {
            file,
            url: URL.createObjectURL(file), // Tạo URL tạm để hiển thị
          };
        })
        .filter(Boolean);

      if (images.length + newImages.length > 3) {
        alert("Chỉ có thể tải lên tối đa 3 ảnh");
        return;
      }

      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleVideoUpload = (e) => {
    const files = e.target.files;
    if (files) {
      const newVideos = Array.from(files)
        .map((file) => {
          if (file.size > maxVideoSize) {
            alert("Kích thước video phải nhỏ hơn 40MB");
            return null;
          }

          return {
            file,
            url: URL.createObjectURL(file),
          };
        })
        .filter(Boolean);

      Promise.all(
        newVideos.map(
          ({ file, url }) =>
            new Promise((resolve, reject) => {
              const videoElement = document.createElement("video");
              videoElement.src = url;

              videoElement.onloadedmetadata = () => {
                if (videoElement.duration > maxVideoDuration) {
                  alert("Video không được dài quá 3 phút");
                  reject("Video quá dài");
                } else {
                  resolve({ file, url });
                }
              };

              videoElement.onerror = () => reject("Lỗi tải video");
            })
        )
      )
        .then((validVideos) => {
          if (videos.length + validVideos.length > 1) {
            alert("Chỉ có thể tải lên tối đa 1 video");
          } else {
            setVideos((prev) => [...prev, ...validVideos]);
          }
        })
        .catch((error) => console.error(error));
    }
  };

  const handleRemoveVideo = (index) => {
    setVideos(videos.filter((_, i) => i !== index));

    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reviewRequest = {
      rating: rating,
      comment: comment,
      orderId: order.id,
    };
    const listImage = images.map((image) => image.file);
    const videoUrl = videos.length > 0 ? videos[0].file : null;

    setLoadPage(true);
    try {
      const review = await createReview(reviewRequest);

      if (listImage.length > 0) {
        await uploadReviewListImage(listImage, review.result.id);
      }

      if (videoUrl) {
        await uploadVideoReview(videoUrl, review.result.id);
      }

      toast({
        description: "Đánh giá sản phẩm thành công",
      });

      setImages([]);
      setVideos([]);
      setRating(5);
      setComment("");
      setErrorComment(null);
    } catch (error) {
      toast({
        title: "Thất bại",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadPage(false);
      onClose();
    }
  };

  const handleRating = (star) => {
    setRating(star);
  };

  const handleComment = (comment) => {
    if (comment.length < 255 || comment.length === 255) {
      setErrorComment(null);
    }

    if (comment.length > 255) {
      setErrorComment("Nhận xét không được vượt quá 255 ký tự");
      return;
    }

    setComment(comment);
  };

  return (
    <>
      {loadPage && (
        <div className="fixed inset-0 flex flex-col justify-center items-center z-[200] space-y-4 bg-black-primary">
          <CircularProgress />
          <Label className="text-2xl text-white-primary">
            Đang tải đánh giá sản phẩm...
          </Label>
        </div>
      )}

      {!loadPage && (
        <Dialog open={onOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-[700px] max-h-[90vh] overflow-y-auto z-[150]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Đánh Giá Đơn Hàng #{order.id}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <Label className="text-lg font-semibold">
                  Sản phẩm trong đơn hàng
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 p-2 border rounded-md"
                    >
                      <Image
                        src={product.productMainImageUrl}
                        alt={product.productName}
                        width={50}
                        height={50}
                        className="rounded-md object-cover"
                      />
                      <div className="flex flex-col">
                        <Label className="text-lg font-bold line-clamp-2">
                          {product.productName}
                        </Label>
                        <Label className="text-sm text-muted-foreground">
                          {product.values
                            ? `${product.values.join(" | ")}`
                            : ""}
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Label>Chất lượng sản phẩm</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="focus:outline-none"
                      onClick={() => handleRating(star)}
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating
                            ? "fill-yellow-primary text-yellow-primary"
                            : "text-gray-primary"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-sm">Nhận xét</Label>
                <Textarea
                  placeholder="Hãy chia sẻ trải nghiệm của bạn về đơn hàng này"
                  rows={4}
                  value={comment}
                  onChange={(e) => handleComment(e.target.value)}
                />
                {errorComment && (
                  <Label className="text-sm text-red-primary">
                    {errorComment}
                  </Label>
                )}
              </div>

              <div className="space-y-4">
                {images.length > 0 && (
                  <div className="grid grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative aspect-square">
                        <Image
                          src={image.url}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 bg-red-primary text-white-primary rounded-full p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {videos.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {videos.map((video, index) => (
                      <div key={index} className="relative aspect-video">
                        <video
                          src={video.url}
                          className="w-full h-full object-cover rounded-lg"
                          controls
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveVideo(index)}
                          className="absolute -top-2 -right-2 bg-red-primary text-white-primary rounded-full p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Label className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-primary">
                  <Camera className="w-5 h-5" />
                  <span>Thêm Hình ảnh</span>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </Label>

                <Label className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-primary">
                  <Video className="w-5 h-5" />
                  <span>Thêm Video</span>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    multiple
                    className="hidden"
                    onChange={handleVideoUpload}
                  />
                </Label>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Hủy bỏ
                </Button>
                <Button type="submit" variant="outline">
                  Gửi Đánh Giá
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
