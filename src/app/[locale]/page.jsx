"use client";

import Image from "next/image";
import ProductBestSelling from "@/components/user/home/product-best-selling";
import ProductSuggestions from "@/components/user/home/product-suggestions";
import ImageSlider from "@/components/slider";
import Slider1 from "../../../public/images/slider_1.png";
import Slider2 from "../../../public/images/slider_2.png";
import Slider3 from "../../../public/images/slider_3.png";
import Slider4 from "../../../public/images/slider_4.png";
import Slider5 from "../../../public/images/slider_5.png";
import HomeImage1 from "../../../public/images/home_image_1.jpeg";
import HomeImage2 from "../../../public/images/home_image_2.jpeg";
import HomeImage3 from "../../../public/images/home_image_3.jpeg";
import HomeImage4 from "../../../public/images/home_image_4.jpeg";
import ListCategoryComponent from "@/components/category";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import useInView from "@/hooks/use-visible";
import ListBrandComponent from "@/components/brand";
import TikTokProductPanner from "@/components/videos/tik-tok-product-panner";
import Link from "next/link";

export default function HomePage() {
  const [refBestSelingProduct, isBestSelingProduct] = useInView();
  const [refListCategory, isListCategory] = useInView();
  const [refListBrand, isListBrand] = useInView();
  const [refTikTokPanner, isTikTokPanner] = useInView();

  const images = [
    {
      url: Slider1,
      description: "Đắm chìm trong thế giới âm thanh",
      button: "Headphone",
      redirect: "",
      background: "black",
    },
    {
      url: Slider2,
      description: "Camera chuyên nghiệp - Màn hình sắc nét",
      button: "Phone",
      redirect: "",
      background: "black",
    },
    {
      url: Slider3,
      description: "Khám phá thế giới qua ống kính",
      button: "Camera",
      redirect: "/search?categoryId=9",
      background: "black",
    },
    {
      url: Slider4,
      description: "Trợ thủ hoàn hảo cho cuộc sống hiện đại",
      button: "Smart Watch",
      redirect: "",
      background: "white",
    },
    {
      url: Slider5,
      description: "Sắc nét đến từng điểm ảnh",
      button: "Laptop",
      redirect: "",
      background: "white",
    },
  ];

  return (
    <main className="flex min-h-screen flex-col justify-between gap-7 m-auto py-24">
      <div className="w-full lg:h-fit h-fit grid grid-cols-1 lg:grid-cols-2 grid-rows-2 lg:grid-rows-1 gap-2 xl:px-28 lg:px-20 sm:px-6 px-4">
        <ImageSlider images={images} />

        <div className="w-full h-full lg:max-h-[800px] max-h-[500px] flex flex-row gap-2">
          <div className="w-2/3 h-full flex flex-col gap-2">
            <div className="w-full h-2/3 relative group">
              <Image
                className="w-full h-full object-cover rounded-md shadow-md transition-all duration-700 ease-in-out opacity-0 scale-95 animate-fade-in"
                src={HomeImage3}
                width={500}
                height={500}
                alt="Home Image"
              />
              <Link href="#shop_now">
                <Button className="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 w-24 h-24 rounded-full backdrop-blur-md bg-white-tertiary/50 group-hover:bg-black-primary transition duration-300">
                  Shop Now
                  <ChevronRight className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-1/3 p-1 rotate-90 hidden group-hover:block" />
                  <ChevronRight className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-2/3 rotate-90 hidden group-hover:block" />
                </Button>
              </Link>
            </div>
            <div className="w-full h-1/3 flex flex-row gap-2">
              <div className="w-full h-full relative group">
                <Image
                  className="w-full h-full object-cover rounded-md shadow-md transition-all duration-700 ease-in-out opacity-0 scale-95 animate-fade-in"
                  src={HomeImage2}
                  width={300}
                  height={300}
                  alt="Home Image"
                />
                <Link href="/search?categoryId=9">
                  <Button className="absolute bottom-3 right-3 backdrop-blur-md bg-white-tertiary/50 group-hover:flex hidden animate-fade-in-quick">
                    Camera
                    <ChevronRight className="p-1" />
                  </Button>
                </Link>
              </div>
              <div className="w-full h-full relative group">
                <Image
                  className="w-full h-full object-cover rounded-md shadow-md transition-all duration-700 ease-in-out opacity-0 scale-95 animate-fade-in"
                  src={HomeImage4}
                  width={300}
                  height={300}
                  alt="Home Image"
                />
                <Button className="absolute bottom-3 right-3 backdrop-blur-md bg-white-tertiary/50 group-hover:flex hidden animate-fade-in-quick">
                  Earphone
                  <ChevronRight className="p-1" />
                </Button>
              </div>
            </div>
          </div>
          <div className="w-1/3 h-full relative group">
            <Image
              className="w-full h-full object-cover rounded-md shadow-md transition-all duration-700 ease-in-out opacity-0 scale-95 animate-fade-in"
              src={HomeImage1}
              width={1000}
              height={1000}
              alt="Home Image"
            />
            <Button className="absolute bottom-3 right-3 backdrop-blur-md bg-white-tertiary/50 group-hover:flex hidden animate-fade-in-quick">
              Phone
              <ChevronRight className="p-1" />
            </Button>
          </div>
        </div>
      </div>

      <div
        ref={refListCategory}
        className={`w-full h-fit xl:px-28 lg:px-20 sm:px-6 px-4 xl:pt-14 lg:pt-10 sm:pt-8 pt-6 ${isListCategory ? "animate-fade-in-up" : "opacity-0"}`}
      >
        <ListCategoryComponent />
      </div>
      <div
        ref={refBestSelingProduct}
        className={`w-full h-fit xl:px-28 lg:px-20 sm:px-6 px-4 xl:pt-14 lg:pt-10 sm:pt-8 pt-6 ${isBestSelingProduct ? "animate-fade-in-up" : "opacity-0"}`}
      >
        <ProductBestSelling />
      </div>
      <div
        ref={refTikTokPanner}
        className={`w-full h-fit xl:px-28 lg:px-20 sm:px-6 px-4 xl:pt-14 lg:pt-10 sm:pt-8 pt-6 ${isTikTokPanner ? "animate-fade-in-up" : "opacity-0"}`}
      >
        <TikTokProductPanner />
      </div>
      <div
        id="shop_now"
        ref={refListBrand}
        className={`w-full h-fit xl:pt-14 lg:pt-10 sm:pt-8 pt-6 ${isListBrand ? "animate-fade-in-up" : "opacity-0"}`}
      >
        <ListBrandComponent />
      </div>

      <div
        className="w-full h-fit xl:px-28 lg:px-20 sm:px-6 px-4 xl:pt-14 lg:pt-10 sm:pt-8 pt-6 animate-fade-in-up"
      >
        <ProductSuggestions />
      </div>
    </main>
  );
}
