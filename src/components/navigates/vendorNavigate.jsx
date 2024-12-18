"use client";

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
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarRail,
  SidebarInset,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import VendorHeader from "../headers/vendorHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveItem,
  setFilter,
  setShowFilter,
} from "@/store/features/orderFilterSlice";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  const activeItem = useSelector(
    (state) => state.orderFilterReducer.activeItem
  );

  const handleSetFilter = (filterKey, url, showFilter, activeKey) => {
    dispatch(setFilter(filterKey));
    dispatch(setShowFilter(showFilter));
    dispatch(setActiveItem(activeKey));
    router.push(url);
  };

  useEffect(() => {
    if (router && router.asPath) {
      const path = router.asPath;
      if (path.includes("/vendor/products/create")) {
        dispatch(setActiveItem("createProduct"));
      } else if (path.includes("/vendor/products")) {
        dispatch(setActiveItem("productList"));
      } else {
        dispatch(setActiveItem(null));
      }
    }
  }, [router, router.asPath, dispatch]);

  return (
    <SidebarProvider>
      <VendorHeader />
      <Sidebar collapsible="icon" className="mt-16">
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
                                  activeItem === subItem.activeKey
                                    ? "font-bold"
                                    : "font-normal"
                                }`}
                                onClick={() =>
                                  handleSetFilter(
                                    subItem.filterKey,
                                    subItem.url,
                                    subItem.filterKey === "",
                                    subItem.activeKey
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
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
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
      <SidebarInset>{vendorContent}</SidebarInset>
    </SidebarProvider>
  );
}
