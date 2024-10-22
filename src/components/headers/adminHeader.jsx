"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { CircleUser, Menu, Package2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "../themeToggles/toggle";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenu,
} from "@/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { AdminSearch } from "../searchBars/adminSearch";

function AdminHeader() {
  const categories = [
    {
      title: "Danh mục",
      href: "/admin/categories",
      description: "Quản lý danh mục sản phẩm và thêm mới danh mục",
    },
    {
      title: "Thành phần sản phẩm",
      href: "/admin/components",
      description:
        "Đây là các thông tin như màu sắc, kích thước, chất liệu, hoặc bất kỳ chi tiết nào liên quan đến sản phẩm mà người bán cần cung cấp",
    },
    {
      title: "Thương hiệu",
      href: "/admin/brands",
      description: "Quản lý và thêm mới các thương thiệu sản phẩm",
    },
  ];

  const users = [
    {
      title: "Khách hàng",
      href: "/admin/customers",
      description: "Quản lý thông tin khách hàng trên toàn hệ thống",
    },
    {
      title: "Stores",
      href: "/admin/stores",
      description: "Quản lý thông tin cửa hàng và người bán",
    },
    {
      title: "Quản trị viên",
      href: "/admin/manages",
      description: "Quản lý thông tin và vai trò của quản trị viên",
    },
  ];

  // ListItem component
  const ListItem = ({ className, title, children, href }) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            href={href} // Ensure href is passed correctly
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  };

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="#"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Package2 className="h-6 w-6" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <Link
          href="/admin"
          className="text-foreground transition-colors hover:text-foreground"
        >
          Dashboard
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <div className="text-muted-foreground transition-colors hover:text-foreground">
                  Danh mục
                </div>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {categories.map((category) => (
                    <ListItem
                      key={category.title}
                      title={category.title}
                      href={category.href}
                    >
                      {category.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/docs" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <div className="text-muted-foreground transition-colors hover:text-foreground">
                    Đơn hàng
                  </div>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <div className="text-muted-foreground transition-colors hover:text-foreground">
                  Người dùng
                </div>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {users.map((user) => (
                    <ListItem
                      key={user.title}
                      title={user.title}
                      href={user.href}
                    >
                      {user.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </nav>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Package2 className="h-6 w-6" />
              <span className="sr-only">Acme Inc</span>
            </Link>
            <Link href="/admin" className="hover:text-foreground">
              Dashboard
            </Link>
            <Link
              href="/admin/categories"
              className="text-muted-foreground hover:text-foreground"
            >
              Danh mục
            </Link>
            <Link
              href="/admin/brands"
              className="text-muted-foreground hover:text-foreground"
            >
              Thương hiệu
            </Link>
            <Link
              href="/admin/components"
              className="text-muted-foreground hover:text-foreground"
            >
              Thành phần SP
            </Link>
            <Link
              href="/admin/orders"
              className="text-muted-foreground hover:text-foreground"
            >
              Đơn hàng
            </Link>
            <Link
              href="/admin/customers"
              className="text-muted-foreground hover:text-foreground"
            >
              Khách hàng
            </Link>
            <Link
              href="/admin/stores"
              className="text-muted-foreground hover:text-foreground"
            >
              Stores
            </Link>
            <Link
              href="/admin/manages"
              className="text-muted-foreground hover:text-foreground"
            >
              Quản trị viên
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <AdminSearch></AdminSearch>
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link href="/admin/setting/profile">Tài khoản của tôi</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/auth">Đăng xuất</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default AdminHeader;
