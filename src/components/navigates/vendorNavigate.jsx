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
  Store,
  MessageCircle
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

export default function VendorNavigate({ vendorContent }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const tHeader = useTranslations("Header");
  const t = useTranslations("Vendor.navigate");
  const activeItem = useSelector(
    (state) => state.orderFilterReducer.activeItem,
  );

  const data = {
    navMain: [
      {
        title: t("order"),
        url: "#",
        icon: ShoppingBag,
        isActive: true,
        items: [
          {
            title: t("all_order"),
            url: "/vendor/orders",
            filterKey: "",
            activeKey: "all",
          },
          {
            title: t("waiting_for_payment"),
            url: "/vendor/orders",
            filterKey: "ON_HOLD",
            activeKey: "onHold",
          },
          {
            title: t("waiting_for_confirmation"),
            url: "/vendor/orders",
            filterKey: "PENDING",
            activeKey: "pending",
          },
          {
            title: t("confirmed"),
            url: "/vendor/orders",
            filterKey: "CONFIRMED",
            activeKey: "confirmed",
          },
          {
            title: t("preparing"),
            url: "/vendor/orders",
            filterKey: "PREPARING",
            activeKey: "preparing",
          },
          {
            title: t("waiting_for_shipping"),
            url: "/vendor/orders",
            filterKey: "WAITING_FOR_SHIPPING",
            activeKey: "waitingForShipping",
          },
          {
            title: t("delivered_to_the_carrier"),
            url: "/vendor/orders",
            filterKey: "PICKED_UP",
            activeKey: "pickedUp",
          },
          {
            title: t("on_delivery"),
            url: "/vendor/orders",
            filterKey: "OUT_FOR_DELIVERY",
            activeKey: "outForDelivery",
          },
          {
            title: t("completed"),
            url: "/vendor/orders",
            filterKey: "DELIVERED",
            activeKey: "delivered",
          },
          {
            title: t("cancelled"),
            url: "/vendor/orders",
            filterKey: "CANCELLED",
            activeKey: "cancelled",
          },
        ],
      },
      {
        title: t("product"),
        url: "#",
        icon: Box,
        items: [
          {
            title: t("add_new_product"),
            url: "/vendor/products/create",
            activeKey: "createProduct",
          },
          {
            title: t("list_product"),
            url: "/vendor/products",
            activeKey: "productList",
          },
        ],
      },
      {
        title: t("other"),
        url: "#",
        icon: BookOpen,
        items: [
          { title: t("revenue"), url: "/vendor", activeKey: "revenue" },
          {
            title: t("business_performance"),
            url: "/vendor",
            activeKey: "performance",
          },
        ],
      },
    ],
    projects: [
      { name: t("chat_management"), url: "/vendor/chat", icon: MessageCircle },
      { name: t("store_profile"), url: "/vendor/store", icon: Store },
    ],
  };
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
      <UserHeader title={tHeader("vendorTitle")} link="/vendor" />
      <Sidebar collapsible="icon" className="mt-16">
        <SidebarContent className="top-0">
          <SidebarGroup>
            <span className="font-[900] px-2 py-1 text-base border-b mb-2">
              {t('manage')}
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
                              className={`w-full text-[1em] text-left px-2 py-1 rounded-sm ${activeItem === subItem.activeKey
                                  ? "font-[900] bg-white-secondary"
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
              {t('my_store')}
            </span>
            <SidebarMenu>
              {data.projects.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    className="rounded-sm hover:bg-white-secondary"
                    asChild
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span className="text-[1em]">{item.name}</span>
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
