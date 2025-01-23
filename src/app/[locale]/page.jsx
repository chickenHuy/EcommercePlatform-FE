"use client";

import Image from "next/image";
import Home from "@/assets/images/home.png";
import shopNow from "@/assets/images/shopNow.png";
import { Button } from "@/components/ui/button";
import ProductGrid from "./search/productGrid";
import ProductBestSelling from "@/components/user/home/product-best-selling";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col justify-between m-auto p-12">
      <div className="text-8xl ml-20 mb-20 mr-20 mt-20">
        <div className="font-extralight">Redefining Your</div>
        <div className="font-extralight">Tech Experience</div>
      </div>
      <div className="ml-20 mb-20 mr-20 relative">
        <Button
          className="w-32 h-32 bg-cover bg-center text-white font-bold text-xl rounded-full absolute -top-16 right-16"
          style={{ backgroundImage: `url(${shopNow.src})` }}
        ></Button>
        <Image
          src={Home}
          alt="Home"
          className="w-auto h-auto rounded-lg"
          layout="intrinsic"
        />
      </div>
      <div className="w-full md:px-20 px-0">
        <ProductGrid />
      </div>
      <ProductBestSelling />
    </main>
  );
}
