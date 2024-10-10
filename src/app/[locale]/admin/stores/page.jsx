"use client";
import { useState } from "react";
import { File, ListFilter, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaginationAdminTable } from "@/components/paginations/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DrawerUserDetail from "./drawerStoreDetail";
import { Rating } from "@mui/material";

export default function ManageStores() {
  // State để điều khiển Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Hàm mở Drawer
  const handleRowClick = () => {
    setIsDrawerOpen(true);
  };

  // Hàm đóng Drawer
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    console.log("Close Drawer");
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="all">Tất cả</TabsTrigger>
                <TabsTrigger value="active">Hoạt động</TabsTrigger>
                <TabsTrigger value="delete" className="hidden sm:flex">
                  Đã khoá
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 gap-1">
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Lọc
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Lọc bởi</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>
                      Mới nhất
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>A - Z</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Lâu nhất
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Z - A</DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button size="sm" variant="outline" className="h-7 gap-1">
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                  </span>
                </Button>
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Danh sách cửa hàng</CardTitle>
                  <CardDescription>
                    Quản lý tất cả cửa hàng trong hệ thống
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tên cửa hàng</TableHead>
                        <TableHead>Người dùng</TableHead>
                        <TableHead>Ngày tạo</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Đánh giá
                        </TableHead>
                        <TableHead className="hidden md:table-cell"></TableHead>
                        <TableHead>
                          <span className="sr-only">Hành động</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow onClick={handleRowClick}>
                        <TableCell className="font-medium">adminwibu</TableCell>
                        <TableCell className="font-medium">
                          Quải Cả Chưởng
                        </TableCell>
                        <TableCell className="font-medium">
                          2023-07-12 10:42 AM
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Rating value={4.0} readOnly className="" />
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <Lock className="h-4 w-4" />
                            <span className="sr-only">Khoá tài khoản</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    Hiển thị <strong>1-10</strong> trong <strong>32</strong>{" "}
                    cửa hàng
                  </div>
                  <PaginationAdminTable />
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      {/* DrawerUserDetail Component */}
      {isDrawerOpen && (
        <DrawerUserDetail isOpen={isDrawerOpen} onClose={handleCloseDrawer} />
      )}
    </div>
  );
}
