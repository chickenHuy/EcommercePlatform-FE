"use client";

import { Suspense, useState, lazy } from "react";
import { Separator } from "@/components/ui/separator";
import SearchHeader from "./headerSearch";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  FilterX,
  Menu,
  Store,
  X,
} from "lucide-react";
import LeftSideBar from "./leftSideBar";
import RightSideBar from "./rightSidebar";
import { useDispatch, useSelector } from "react-redux";
import { setOrder, setSortBy } from "@/store/features/userSearchSlice";
import { useTranslations } from "next-intl";

export default function SearchPage() {
  const ProductGrid = lazy(() => import("./productGrid"));
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const t = useTranslations("Search");

  const order = useSelector((state) => state.searchFilter.order);
  const sortBy = useSelector((state) => state.searchFilter.sortBy);
  const storeId = useSelector((state) => state.searchFilter.store);

  const handleOrderChange = () => {
    if (order === null || order === "") {
      dispatch(setOrder("asc"));
      if (sortBy === null || sortBy === "") {
        dispatch(setSortBy("createdAt"));
      }
    } else if (order === "asc") dispatch(setOrder("desc"));
    else {
      dispatch(setOrder(null));
      dispatch(setSortBy(null));
    }
  };
  const handleSortByChange = (value) => {
    if (order === null || order === "") {
      dispatch(setOrder("asc"));
    }
    dispatch(setSortBy(value));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SearchHeader t={t} />

      {/* Main Content */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Left Sidebar */}
        <ResizablePanel
          defaultSize={20}
          collapsible={true}
          collapsedSize={0}
          minSize={20}
          maxSize={30}
          className="hidden md:block"
        >
          <LeftSideBar t={t} />
        </ResizablePanel>
        <ResizableHandle withHandle />

        {/* Center Content */}
        <ResizablePanel defaultSize={60} minSize={40}>
          <div className="flex flex-col h-full">
            {/* Filter Bar - Fixed Height */}
            <div className="h-24">
              <div className="h-full container mx-auto flex items-center justify-between px-4">
                <div className="md:hidden">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setLeftSidebarOpen(true)}
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center ml-auto mr-14 space-x-4">
                  <div className="flex">
                    <Button
                      className="bg-white-secondary opacity-50 m-1 hover:bg-white-tertiary"
                      onClick={() => handleOrderChange()}
                    >
                      {order === "desc" ? (
                        <ArrowDownWideNarrow className="text-black-tertiary" />
                      ) : order === "asc" ? (
                        <ArrowUpWideNarrow className="text-black-tertiary"></ArrowUpWideNarrow>
                      ) : (
                        <FilterX className="text-black-tertiary"></FilterX>
                      )}
                    </Button>
                  </div>
                  <div className="flex">
                    <Select
                      value={sortBy}
                      onValueChange={(value) => handleSortByChange(value)}
                    >
                      <SelectTrigger className="w-[180px] h-10 rounded-full border-none text-black-primary bg-white-secondary opacity-50">
                        <SelectValue placeholder={t("text_sort_by")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="createdAt">
                          {t("text_post_date")}
                        </SelectItem>
                        <SelectItem value="originalPrice">{t("text_original_price")}</SelectItem>
                        <SelectItem value="salePrice">{t("text_sale_price")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="md:hidden">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setRightSidebarOpen(true)}
                  >
                    <Store className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Separator className="w-5/6 mx-auto"></Separator>

            {/* Main Content Area - Scrollable */}
            <div className="flex-1 overflow-auto p-4">
              <div className="space-y-4">
                <Suspense fallback={<div>{t("text_load_product")}</div>}>
                  <ProductGrid t={t}/>
                </Suspense>
              </div>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right Sidebar */}
        {storeId && (
          <ResizablePanel
            defaultSize={20}
            collapsible={true}
            collapsedSize={0}
            minSize={20}
            maxSize={30}
            className="hidden md:block"
          >
            <RightSideBar storeId={storeId} t={t} />
          </ResizablePanel>
        )}
      </ResizablePanelGroup>

      {/* Mobile Left Sidebar */}
      {leftSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
          <div className="absolute left-0 top-0 h-full w-64 bg-transparent-primary">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => setLeftSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <LeftSideBar t={t} />
          </div>
        </div>
      )}

      {/* Mobile Right Sidebar */}
      {rightSidebarOpen && storeId && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
          <div className="absolute right-0 top-0 h-full w-64 bg-transparent-primary">
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-2"
              onClick={() => setRightSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <RightSideBar storeId={storeId} t={t} />
          </div>
        </div>
      )}
    </div>
  );
}
