"use client";

import {
  BookOpen,
  Bot,
  ChevronRight,
  Map,
  PieChart,
  Frame,
  Box,
  SquareTerminal,
  Store,
  MapPinHouse,
  Star,
  ShoppingBag,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import VendorHeader from "../headers/vendorHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveItem,
  setCurrentPage,
  setSearch,
  setShowFilter,
  setTotalPage,
} from "@/store/features/orderSearchSlice";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
          searchKey: "",
        },
        {
          title: "Chờ thanh toán",
          url: "/vendor/orders",
          searchKey: "ON_HOLD",
        },
        {
          title: "Chờ xác nhận",
          url: "/vendor/orders",
          searchKey: "PENDING",
        },
        {
          title: "Đã xác nhận",
          url: "/vendor/orders",
          searchKey: "CONFIRMED",
        },
        {
          title: "Chuẩn bị hàng",
          url: "/vendor/orders",
          searchKey: "PREPARING",
        },
        {
          title: "Chờ vận chuyển",
          url: "/vendor/orders",
          searchKey: "WAITING_FOR_SHIPPING",
        },
        {
          title: "Đã giao cho ĐVVC",
          url: "/vendor/orders",
          searchKey: "PICKED_UP",
        },
        {
          title: "Đang giao hàng",
          url: "/vendor/orders",
          searchKey: "OUT_FOR_DELIVERY",
        },
        {
          title: "Hoàn thành",
          url: "/vendor/orders",
          searchKey: "DELIVERED",
        },
        {
          title: "Đã hủy",
          url: "/vendor/orders",
          searchKey: "CANCELLED",
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
        },
        {
          title: "Danh sách sản phẩm",
          url: "/vendor/products",
        },
      ],
    },
    {
      title: "Khác",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Doanh thu",
          url: "#",
        },
        {
          title: "Hiệu quả hoạt động",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Đánh giá & bình luận",
      url: "#",
      icon: Star,
    },
    {
      name: "Địa chỉ lấy hàng",
      url: "#",
      icon: MapPinHouse,
    },
    {
      name: "Hồ sơ cửa hàng",
      url: "#",
      icon: Store,
    },
  ],
};

export default function VendorNavigate({ vendorContent }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const activeItem = useSelector((state) => state.orderSearch.activeItem);

  const handleSetSearch = (searchKey, url, showFilter) => {
    dispatch(setSearch(searchKey));
    console.log("searchKey ở VendorNavigate: ", searchKey);
    dispatch(setShowFilter(showFilter));
    dispatch(setActiveItem(searchKey));
    router.push(url);
  };

  useEffect(() => {
    if (router && router.asPath) {
      const path = router.asPath;
      if (path.includes("/vendor/orders")) {
        setActiveItem("");
      } else {
        setActiveItem(null);
      }
    }
  }, [router, router.asPath]);

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Quản lý</SidebarGroupLabel>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <button
                                className={`w-full hover:cursor-pointer ${
                                  activeItem === subItem.searchKey
                                    ? "font-bold"
                                    : "font-normal"
                                }`}
                                onClick={() =>
                                  handleSetSearch(
                                    subItem.searchKey,
                                    subItem.url,
                                    subItem.searchKey === ""
                                  )
                                }
                              >
                                {subItem.title}
                              </button>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Cửa hàng của tôi</SidebarGroupLabel>
            <SidebarMenu>
              {data.projects.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <div
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <SidebarTrigger className="size-4" />
                </div>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      {
        <SidebarInset>
          <VendorHeader></VendorHeader>
          {vendorContent}
        </SidebarInset>
      }
    </SidebarProvider>
  );
}
