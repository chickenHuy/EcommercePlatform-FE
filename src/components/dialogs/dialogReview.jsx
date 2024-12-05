"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import Loading from "../loading";
import { CircularProgress, Typography } from "@mui/material";

export function OrderReviewDialog({ order, toast }) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [errorStar, setErrorStar] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const products = order.orderItems;

  const maxImageSize = 10 * 1024 * 1024; // 10MB
  const maxVideoSize = 40 * 1024 * 1024; // 40MB
  const maxVideoDuration = 180; // 3 phút (180 giây)

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
            url: URL.createObjectURL(file), // Tạo URL tạm để hiển thị
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (rating === 0) {
      setErrorStar("Vui lòng chọn một mức đánh giá");
      setIsLoading(false);
      return;
    }

    const reviewRequest = {
      rating: rating,
      comment: comment,
      orderId: order.id,
    };
    const listImage = images.map((image) => image.file);
    const videoUrl = videos.length > 0 ? videos[0].file : null;

    try {
      const review = await createReview(reviewRequest);
      if (listImage.length > 0) {
        await uploadReviewListImage(listImage, review.result.id);
      }
      if (videoUrl) {
        await uploadVideoReview(videoUrl, review.result.id);
      }
      toast({
        variant: "success",
        title: "Thành công",
        description: "Đánh giá sản phẩm thành công",
      });
      setIsOpen(false);
      setRating(0);
      setImages([]);
      setVideos([]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Thất bại",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRating = (star) => {
    setRating(star);
    setErrorStar("");
  };

  const handleComment = (comment) => {
    setComment(comment);
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 flex flex-col justify-center items-center z-[100] space-y-4 bg-black-primary bg-opacity-90">
          <CircularProgress></CircularProgress>
          <p className="text-2xl text-white-primary">
            Đang tải đánh giá sản phẩm...
          </p>
        </div>
      )}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Đánh Giá Đơn Hàng</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Đánh Giá Đơn Hàng #{order.id}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                    <div>
                      <h3 className="font-medium">{product.productName}</h3>
                      <p className="text-sm text-gray-500">
                        {product.value ? product.values : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Đánh giá chung</Label>
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
              {errorStar && (
                <p className="text-red-primary text-sm">{errorStar}</p>
              )}{" "}
              {/* Hiển thị thông báo lỗi */}
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Nhận xét</Label>
              <Textarea
                id="comment"
                placeholder="Hãy chia sẻ trải nghiệm của bạn về đơn hàng này"
                rows={4}
                value={comment}
                onChange={(e) => handleComment(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
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
                        onClick={() =>
                          setImages(images.filter((_, i) => i !== index))
                        }
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
                        onClick={() =>
                          setVideos(videos.filter((_, i) => i !== index))
                        }
                        className="absolute -top-2 -right-2 bg-red-primary text-white-primary rounded-full p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Label
                htmlFor="image-upload"
                className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-primary"
              >
                <Camera className="w-5 h-5 text-gray-500" />
                <span>Thêm Hình ảnh</span>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </Label>

              <Label
                htmlFor="video-upload"
                className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-primary"
              >
                <Video className="w-5 h-5 text-gray-500" />
                <span>Thêm Video</span>
                <input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  multiple
                  className="hidden"
                  onChange={handleVideoUpload}
                />
              </Label>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Hủy
              </Button>
              <Button type="submit">Gửi Đánh Giá</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
