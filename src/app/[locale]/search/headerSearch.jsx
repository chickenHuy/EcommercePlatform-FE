import Link from "next/link";
import { Search, User, ShoppingCart, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Placeholder from "@/assets/images/placeholder.png";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getCategory } from "@/api/search/searchApi";

export default function SearchHeader() {
  const mainCategoryId = useSelector(
    (state) => state.searchFilter.mainCategoryId
  );

  const keyword = useSelector((state) => state.searchFilter.search);
  const [category, setCategory] = useState(null);
  useEffect(() => {
    if (mainCategoryId) {
      getCategory(mainCategoryId)
        .then((data) => {
          setCategory(data.result);
        })
        .catch((error) => {
          console.log(error)
        });
    }
  }, [mainCategoryId]);
  return (
    <>
      {" "}
      {mainCategoryId ? (
        <div className="relative min-h-[360px] bg-[#14161F]">
          <div className="absolute inset-0">
            <Image
              src={category?.image_url ? category.image_url : Placeholder}
              alt="Headphone background"
              fill
              className="object-cover object-center opacity-50"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#e9e9e9]/20 via-[#e9e9e9]/50 to-transparent" />
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
              /<h1 className="text-white-primary">{category?.name}</h1>
            </div>

            <h1 className="mt-4 text-[80px] font-light leading-tight tracking-tight text-white-primary">
              {category?.name}
            </h1>
          </div>
        </div>
      ) : (
        <div className="flex items-center min-h-[100px] bg-black-primary ">
          <div className="mx-auto pt-20 pb-2 text-white-primary">
            Kết quả tìm kiếm cho từ khoá "
            <span className="text-red-primary">{keyword}</span>"
          </div>
        </div>
      )}
    </>
  );
}
