import Link from "next/link";
import Image from "next/image";
import { Home } from "lucide-react";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getCategory } from "@/api/search/searchApi";

export default function SearchHeader({ t }) {
  const mainCategoryId = useSelector(
    (state) => state.searchFilter.mainCategoryId,
  );
  const keyword = useSelector((state) => state.searchFilter.search);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    if (mainCategoryId) {
      getCategory(mainCategoryId)
        .then((data) => setCategory(data.result))
        .catch((error) => console.error(error));
    }
  }, [mainCategoryId]);

  if (mainCategoryId) {
    return (
      <div className="relative w-full aspect-[3/2] max-h-[600px] animate-fade-in">
        {category?.image_url && (
          <Image
            src={category?.image_url}
            alt="Background"
            fill
            className="object-cover rounded-xl shadow-md"
          />
        )}
        <div className="absolute bottom-5 left-5 w-fit h-fit lg:p-10 p-5 rounded-xl flex flex-col justify-center items-start backdrop-blur-md bg-black-primary/30 animate-fade-in-up">
          <div className="flex items-center space-x-2 lg:text-[1em] text-[.9em] text-white-primary">
            <Link href="/">
              <Home className="p-1" />
            </Link>
            <span>/</span>
            <Link href="/categories">{t("text_category")}</Link>
            <span>/</span>
            <span>{category?.name}</span>
          </div>

          <h1 className="lg:text-[4em] sm:text-[2.5em] text-[1.5em] font-[900] text-white-primary">
            {category?.name}
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="w-fit h-fit mx-auto px-10 py-1 bg-black-primary rounded-full text-white-primary animate-fade-in">
      {t("text_search_result")}
      <span className="text-red-primary pl-2">{'"' + keyword + '"'}</span>
    </div>
  );
}
