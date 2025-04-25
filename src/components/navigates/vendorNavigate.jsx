"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";

import {
  BookOpen,
  Box,
  ChevronRight,
  ShoppingBag,
  Star,
  MapPinHouse,
  Store,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarRail,
  SidebarInset,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import UserHeader from "../headers/userHeader";
import {
  setFilterTab,
  setFilter,
  setActiveItem,
} from "@/store/features/orderFilterSlice";

const data = {
  navMain: [
    {
      title: "Đơn đặt hàng",
      url: "#",
      icon: ShoppingBag,
      isActive: true,
      items: [
        {
          title: "Tất cả",
          url: "/vendor/orders",
          filterKey: "",
          activeKey: "all",
        },
        {
          title: "Chờ thanh toán",
          url: "/vendor/orders",
          filterKey: "ON_HOLD",
          activeKey: "onHold",
        },
        {
          title: "Chờ xác nhận",
          url: "/vendor/orders",
          filterKey: "PENDING",
          activeKey: "pending",
        },
        {
          title: "Đã xác nhận",
          url: "/vendor/orders",
          filterKey: "CONFIRMED",
          activeKey: "confirmed",
        },
        {
          title: "Chuẩn bị hàng",
          url: "/vendor/orders",
          filterKey: "PREPARING",
          activeKey: "preparing",
        },
        {
          title: "Chờ vận chuyển",
          url: "/vendor/orders",
          filterKey: "WAITING_FOR_SHIPPING",
          activeKey: "waitingForShipping",
        },
        {
          title: "Đã giao cho ĐVVC",
          url: "/vendor/orders",
          filterKey: "PICKED_UP",
          activeKey: "pickedUp",
        },
        {
          title: "Đang giao hàng",
          url: "/vendor/orders",
          filterKey: "OUT_FOR_DELIVERY",
          activeKey: "outForDelivery",
        },
        {
          title: "Hoàn thành",
          url: "/vendor/orders",
          filterKey: "DELIVERED",
          activeKey: "delivered",
        },
        {
          title: "Đã hủy",
          url: "/vendor/orders",
          filterKey: "CANCELLED",
          activeKey: "cancelled",
        },
      ],
    },
    {
      title: "Sản phẩm",
      url: "#",
      icon: Box,
      items: [
        {
          title: "Thêm sản phẩm",
          url: "/vendor/products/create",
          activeKey: "createProduct",
        },
        {
          title: "Danh sách sản phẩm",
          url: "/vendor/products",
          activeKey: "productList",
        },
      ],
    },
    {
      title: "Khác",
      url: "#",
      icon: BookOpen,
      items: [
        { title: "Doanh thu", url: "#", activeKey: "revenue" },
        { title: "Hiệu quả hoạt động", url: "#", activeKey: "performance" },
      ],
    },
  ],
  projects: [
    { name: "Đánh giá & bình luận", url: "#", icon: Star },
    { name: "Địa chỉ lấy hàng", url: "#", icon: MapPinHouse },
    { name: "Hồ sơ cửa hàng", url: "#", icon: Store },
  ],
};

export default function VendorNavigate({ vendorContent }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const t = useTranslations("Header");
  const activeItem = useSelector(
    (state) => state.orderFilterReducer.activeItem,
  );

  const handleSetFilter = (filterKey, activeKey, url) => {
    dispatch(setFilterTab(filterKey));
    dispatch(setFilter(filterKey));
    dispatch(setActiveItem(activeKey));
    router.push(url);
  };

  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes("/vendor/products/create")) {
      dispatch(setActiveItem("createProduct"));
    } else if (path.includes("/vendor/products")) {
      dispatch(setActiveItem("productList"));
    } else {
      dispatch(setActiveItem(null));
    }
  }, [dispatch]);

  return (
    <SidebarProvider>
      <SidebarTrigger className="fixed top-20 left-2 z-50 md:hidden bg-black-secondary text-white-primary w-9 h-9" />
      <UserHeader title={t("vendorTitle")} link="/vendor" />
      <Sidebar collapsible="icon" className="mt-16">
        <SidebarContent className="top-0">
          <SidebarGroup>
            <span className="font-[900] px-2 py-1 text-base border-b mb-2">
              Quản lý
            </span>
            <SidebarMenu className="gap-3">
              {data.navMain.map((section) => (
                <Collapsible
                  key={section.title}
                  asChild
                  defaultOpen={section.isActive}
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between gap-2">
                        {section.icon && <section.icon className="size-4" />}
                        <span>{section.title}</span>
                        <ChevronRight className="ml-auto group-data-[state=open]/collapsible:rotate-90 size-4 cursor-pointer" />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {section.items?.map((subItem) => (
                          <SidebarMenuSubButton key={subItem.title} asChild>
                            <button
                              onClick={() =>
                                handleSetFilter(
                                  subItem.filterKey,
                                  subItem.activeKey,
                                  subItem.url,
                                )
                              }
                              className={`w-full text-sm text-left px-2 py-1 rounded ${
                                activeItem === subItem.activeKey
                                  ? "font-bold bg-white-secondary"
                                  : "hover:bg-white-secondary"
                              }`}
                            >
                              {subItem.title}
                            </button>
                          </SidebarMenuSubButton>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <span className="font-[900] px-2 py-1 text-base border-b mb-2">
              Cửa hàng của tôi
            </span>
            <SidebarMenu>
              {data.projects.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>{vendorContent}</SidebarInset>
    </SidebarProvider>
  );
}
