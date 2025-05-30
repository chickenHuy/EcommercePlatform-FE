"use client";

import { useState, useEffect } from "react";
import SearchHeader from "./headerSearch";
import { Button } from "@/components/ui/button";
import { ArrowDownUp, ArrowUpWideNarrow, Filter, Store, X } from "lucide-react";
import LeftSideBar from "./leftSideBar";
import RightSideBar from "./rightSidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { setOrder, setSortBy } from "@/store/features/userSearchSlice";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import ProductGrid from "./productGrid";

export default function SearchPage() {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const searchParam = useSearchParams();
  const dispatch = useDispatch();
  const t = useTranslations("Search");
  const storeId = searchParam.get("storeId");
  const order = useSelector((state) => state.searchFilter.order);
  const sortBy = useSelector((state) => state.searchFilter.sortBy);

  const handleOrderChange = () => {
    if (!order) {
      dispatch(setOrder("asc"));
      if (!sortBy) {
        dispatch(setSortBy("createdAt"));
      }
    } else if (order === "asc") dispatch(setOrder("desc"));
    else {
      dispatch(setOrder(null));
      dispatch(setSortBy(null));
    }
  };

  const handleSortByChange = (value) => {
    if (!order) {
      dispatch(setOrder("asc"));
    }
    dispatch(setSortBy(value));
  };

  useEffect(() => {
    const updateMedia = () => {
      setIsDesktop(window.innerWidth > 768);
    };

    updateMedia();
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col gap-3 xl:px-28 lg:px-20 sm:px-6 px-4 py-20">
      <SearchHeader t={t} />

      <div className="flex flex-1 h-full gap-3 relative">
        <div
          className={`w-[20%] max-w-[350px] min-w-[200px] min-h-full top-16 z-20 ${isDesktop ? "block" : leftSidebarOpen ? "absolute block" : "hidden"}`}
        >
          <LeftSideBar t={t} />
        </div>

        <div className="flex-1 flex flex-col items-center border rounded-md">
          <div className="w-full h-fit flex items-center justify-between p-2">
            <div className="md:hidden">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
              >
                {leftSidebarOpen ? <X /> : <Filter />}
              </Button>
            </div>

            <div className="w-full h-fit flex flex-row items-center justify-end gap-3">
              <Button
                variant="outline"
                className="w-fit h-7"
                onClick={handleOrderChange}
              >
                {order === "desc" ? (
                  <ArrowDownUp className="w-4" />
                ) : order === "asc" ? (
                  <ArrowUpWideNarrow className="w-4" />
                ) : (
                  <ArrowDownUp className="w-4" />
                )}
              </Button>

              <Select value={sortBy} onValueChange={handleSortByChange}>
                <SelectTrigger className="w-fit min-w-[100px] h-7 rounded-md">
                  <SelectValue placeholder={t("text_sort_by")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">
                    {t("text_post_date")}
                  </SelectItem>
                  <SelectItem value="originalPrice">
                    {t("text_original_price")}
                  </SelectItem>
                  <SelectItem value="salePrice">
                    {t("text_sale_price")}
                  </SelectItem>
                </SelectContent>
              </Select>

              {storeId && (
                <div className="md:hidden">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 translate-y-[3px]"
                    onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
                  >
                    {rightSidebarOpen ? <X /> : <Store />}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-auto w-full p-4">
            <ProductGrid maxCol={4} t={t} storeParam={storeId} />
          </div>
        </div>

        {storeId && (
          <div
            className={`w-[20%] max-w-[350px] min-w-[250px] min-h-full top-16 right-0 z-20 ${isDesktop ? "block" : rightSidebarOpen ? "absolute block" : "hidden"}`}
          >
            <RightSideBar storeId={storeId} t={t} />
          </div>
        )}
      </div>
    </div>
  );
}
