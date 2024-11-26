'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Star } from 'lucide-react'
import Image from "next/image"

export function Reviews({ reviews = [] }) {
  const averageRating = 4.9
  const totalReviews = 51
  const ratingCounts = {
    5: 51,
    4: 4,
    3: 0,
    2: 0,
    1: 0
  }

  const sampleReview = {
    id: '1',
    user: {
      name: 'p****h',
      avatar: '/placeholder.svg'
    },
    rating: 5,
    date: '2024-10-30 11:03',
    variant: 'Grey,L',
    comment: 'Giao nhanh 2 ngày là cod hàng, sản sale giá quá hời, vải dày dặn, cũng nặng tay, rất oke. Nhìn xinh xắn cơ mà mũ hơi bé',
    images: [
      '/placeholder.svg',
      '/placeholder.svg', 
      '/placeholder.svg'
    ],
  }

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold">ĐÁNH GIÁ SẢN PHẨM</h2>
      
      <div className="bg-white rounded-lg p-4 md:p-6 space-y-6">
        {/* Rating Overview */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center md:items-start">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-[#ee4d2d]">{averageRating}</div>
            <div className="flex gap-0.5 justify-center my-2">
              {[1,2,3,4,5].map((star) => (
                <Star 
                  key={star}
                  className="w-4 h-4 md:w-5 md:h-5 fill-[#ee4d2d] text-[#ee4d2d]"
                />
              ))}
            </div>
            <div className="text-sm md:text-base text-gray-500">trên 5</div>
          </div>

          <div className="flex-1 space-y-4 w-full md:w-auto">
            {/* Rating Filters */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <Button variant="outline" className="rounded-sm text-xs md:text-sm">
                Tất Cả
              </Button>
              {Object.entries(ratingCounts).reverse().map(([rating, count]) => (
                <Button key={rating} variant="outline" className="rounded-sm text-xs md:text-sm">
                  {rating} Sao ({count})
                </Button>
              ))}
            </div>

            {/* Comment/Photo Filters */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <Button variant="outline" className="rounded-sm text-xs md:text-sm">
                Có Bình Luận (27)
              </Button>
              <Button variant="outline" className="rounded-sm text-xs md:text-sm">
                Có Hình Ảnh / Video (21)
              </Button>
            </div>
          </div>
        </div>

        {/* Review List */}
        <div className="space-y-6">
          <div className="border-t pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <Avatar className="w-10 h-10 mx-auto md:mx-0">
                <AvatarImage src={sampleReview.user.avatar} alt={sampleReview.user.name} />
                <AvatarFallback>{sampleReview.user.name[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-4">
                <div className="text-center md:text-left">
                  <div className="font-medium">{sampleReview.user.name}</div>
                  <div className="flex gap-0.5 justify-center md:justify-start">
                    {Array.from({ length: sampleReview.rating }).map((_, i) => (
                      <Star 
                        key={i}
                        className="w-4 h-4 fill-[#ee4d2d] text-[#ee4d2d]"
                      />
                    ))}
                  </div>
                </div>

                <div className="text-gray-500 text-sm text-center md:text-left">
                  {sampleReview.date} | Phân loại hàng: {sampleReview.variant}
                </div>

                <div className="text-sm md:text-base">{sampleReview.comment}</div>

                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {sampleReview.images?.map((image, i) => (
                    <Image
                      key={i}
                      src={image}
                      alt={`Review image ${i + 1}`}
                      width={72}
                      height={72}
                      className="rounded-sm object-cover"
                    />
                  ))}
                </div>

                {/* Seller Response */}
                <div className="bg-gray-50 p-4 rounded-sm">
                  <div className="font-medium mb-2 text-sm md:text-base">Phản Hồi Của Người Bán</div>
                  <div className="text-gray-600 text-sm md:text-base">
                    Cảm ơn bạn đã ủng hộ sản phẩm của nhà Cem, mọi đánh giá của bạn sẽ giúp Cem có động lực hơn để ra những sản phẩm chất lượng hơn.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

