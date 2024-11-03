"use client";
import { File, ListFilter } from "lucide-react";
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
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaginationAdminTable } from "@/components/paginations/pagination";
import { Toaster } from "@/components/ui/toaster";
import { useState } from "react";
export default function ManageComponent() {
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState({
    hasNext: false,
    hasPrevious: false,
    currentPage: currentPage,
    totalPage: 1,
    totalElements: 0,
    handleNextPage: () => {
      loadComponents(currentPage + 1);
    },
    handlePrevPage: () => {
      loadComponents(currentPage + 1);
    },
    setCurrentPage: (page) => {
      loadComponents(page);
    },
  });

  const loadComponents = async (page) => {};

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Toaster />
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="available">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger
                  value="available"
                  onClick={() => setTab("available")}
                >
                  Công khai
                </TabsTrigger>
                <TabsTrigger
                  value="unAvailable"
                  onClick={() => setTab("unAvailable")}
                >
                  Ẩn
                </TabsTrigger>
                <TabsTrigger
                  value="blocked"
                  onClick={() => setTab("blocked")}
                  className="hidden sm:flex"
                >
                  Bị khoá
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 gap-1">
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Sắp xếp
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Sắp xếp</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup>
                      <DropdownMenuRadioItem value="newest">
                        Tăng dần
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="oldest">
                        Giảm dần
                      </DropdownMenuRadioItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioItem value="name">
                        Tên
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="salePrice">
                        Giá bán
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="orignalPrice">
                        Giá gốc
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Rating">
                        Đánh giá
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="createdAt">
                        Ngày tạo
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <TabsContent value="available">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle className="text-[18px] font-extrabold">
                    Danh sách sản phẩm
                  </CardTitle>
                  <CardDescription className="text-black-primary font-bold text-[15px]">
                    Quản lý tất cả các sản phẩm của cửa hàng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Hình ảnh</TableHead>
                        <TableHead>Tên sản phẩm</TableHead>
                        <TableHead>Số lượng</TableHead>
                        <TableHead>Giá bán</TableHead>
                        <TableHead className="hidden lg:table-cell">
                          Ngày tạo
                        </TableHead>
                        <TableHead className="hidden lg:table-cell">
                          Ngày cập nhật
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Hành động
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody></TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="relative">
                  <div className="w-full text-xs text-muted-foreground">
                    Hiển thị{" "}
                    <strong>
                      {1 +
                        pageSize * (currentPage - 1) +
                        " - " +
                        pageSize * currentPage}
                    </strong>{" "}
                    trong <strong>{paginationData.totalElements}</strong> thành
                    phần
                  </div>
                  <div className="absolute right-1/2 translate-x-1/2">
                    <PaginationAdminTable
                      hasNext={paginationData.hasNext}
                      hasPrevious={paginationData.hasPrevious}
                      handleNextPage={paginationData.handleNextPage}
                      handlePrevPage={paginationData.handlePrevPage}
                      currentPage={paginationData.currentPage}
                      totalPage={paginationData.totalPage}
                      setCurrentPage={paginationData.setCurrentPage}
                    />
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
