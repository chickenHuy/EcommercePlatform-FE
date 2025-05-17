"use client";

import Image from "next/image";
import ProductGrid from "./search/productGrid";
import ProductBestSelling from "@/components/user/home/product-best-selling";
import ProductSuggestions from "@/components/user/home/product-suggestions";
import ImageSlider from "@/components/slider";
import Slider1 from "../../../public/images/slider_1.png";
import Slider2 from "../../../public/images/slider_2.png";
import Slider3 from "../../../public/images/slider_3.png";
import Slider4 from "../../../public/images/slider_4.png";
import Slider5 from "../../../public/images/slider_5.png";
import Slider6 from "../../../public/images/slider_6.png";
import Slider7 from "../../../public/images/slider_7.png";
import Slider8 from "../../../public/images/slider_8.png";
import Slider9 from "../../../public/images/slider_9.png";
import Slider10 from "../../../public/images/slider_10.png";
import Slider11 from "../../../public/images/slider_11.png";
import Slider12 from "../../../public/images/slider_12.png";
import Slider13 from "../../../public/images/slider_12.png";
import HomeImage1 from "../../../public/images/home_image_1.jpeg";
import HomeImage2 from "../../../public/images/home_image_2.jpeg";
import HomeImage3 from "../../../public/images/home_image_3.jpeg";
import HomeImage4 from "../../../public/images/home_image_4.jpeg";
import ListCategoryComponent from "@/components/category";

export default function HomePage() {
  const images = [
    Slider1,
    Slider2,
    Slider3,
    Slider4,
    Slider5,
    Slider6,
    Slider7,
    Slider8,
    Slider9,
    Slider10,
    Slider11,
    Slider12,
    Slider13,
  ];
  return (
    <main className="flex min-h-screen flex-col justify-between gap-7 m-auto xl:px-28 lg:px-20 sm:px-6 px-4 py-24">
      <div className="w-full lg:h-fit h-fit grid grid-cols-1 lg:grid-cols-2 grid-rows-2 lg:grid-rows-1 gap-2">
        <ImageSlider images={images} />

        <div className="h-full grid grid-cols-2 grid-rows-2 gap-2">
          <Image
            className="w-full h-full object-cover rounded-md shadow-md"
            src={HomeImage3}
            width={1000}
            height={1000}
            alt="Home Image"
          />
          <Image
            className="w-full h-full object-cover rounded-md shadow-sm"
            src={HomeImage1}
            width={500}
            height={500}
            alt="Home Image"
          />
          <Image
            className="w-full h-full object-cover rounded-md shadow-sm"
            src={HomeImage2}
            width={500}
            height={500}
            alt="Home Image"
          />

          <Image
            className="w-full h-full object-cover rounded-md shadow-sm"
            src={HomeImage4}
            width={500}
            height={500}
            alt="Home Image"
          />
        </div>
      </div>

      <ListCategoryComponent />
      <ProductBestSelling />
      <ProductGrid />
      <ProductSuggestions />
    </main>
  );
}
