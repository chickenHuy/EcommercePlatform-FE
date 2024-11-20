import Link from "next/link";
import { Search, User, ShoppingCart, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Placeholder from "@/assets/images/placeholder.png";

export default function SearchHeader(props) {
  const { mainImg, name, type } = props;
  return (
    <div className="relative min-h-[360px] bg-[#14161F]">
      <div className="absolute inset-0">
        <Image
          src={Placeholder}
          alt="Headphone background"
          fill
          className="object-cover object-center opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14161F] via-[#14161F]/80 to-transparent" />
      </div>

      <div className="relative container mx-auto px-12 pt-[160px]">
        <div className="flex items-center space-x-2 text-sm text-white-primary">
          <Link href="/" className="">
            <Home className="h-4 w-4" />
          </Link>
          /
          <Link href="/category" className="">
            Category
          </Link>
          /
          <h1 className="text-white-primary">Headphones</h1>
        </div>

        <h1 className="mt-4 text-[80px] font-light leading-tight tracking-tight text-white-primary">
          Headphones
        </h1>
      </div>
    </div>
  );
}
