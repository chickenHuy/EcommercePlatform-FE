"use client";
import { File, ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";
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
  DropdownMenuItem,
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
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { deleteBrand, getAllBrand } from "@/api/admin/brandRequest";
import Image from "next/image";
import DialogAddEditBrand from "@/components/dialogs/dialogAddEditBrand";
import iconNotFound from "../../../../../public/images/iconNotFound.png";
import { useToast } from "@/hooks/use-toast";
import { del } from "@/lib/httpClient";

export const description =
  "An products dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. It displays a list of products in a table with actions.";
export default function ManageBrand() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState("Thêm mới thương hiệu");
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getAllBrand(1);
      setBrands(response.result.data);
      console.log(response.result.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const refreshData = () => {
    fetchData();
    setIsDialogOpen(false);
  };

  const handleAddButtonClick = () => {
    setDialogContent("Thêm mới thương hiệu");
    setSelectedBrand(null);
    setIsDialogOpen(true);
  };

  const handleEditButtonClick = (brand) => {
    setDialogContent("Sửa thương hiệu");
    setSelectedBrand(brand);
    setIsDialogOpen(true);
  };

  const isCloseDialog = () => {
    setIsDialogOpen(false);
    console.log("Close Dialog");
  };

  const handleDeleteButtonClick = async (id) => {
    try {
      await deleteBrand(id);
      toast({
        title: "Thành công",
        description: "Thương hiệu đã được xóa.",
      });
      refreshData();
    } catch (error) {
      toast({
        title: "Thất bại",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Toaster />
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="all">Tất cả</TabsTrigger>
                <TabsTrigger value="active">Hoạt động</TabsTrigger>
                <TabsTrigger value="delete" className="hidden sm:flex">
                  Đã xoá
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
                    <DropdownMenuCheckboxItem>Cũ nhất</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>A - Z</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Bắt buộc
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Không bắt buộc
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button size="sm" variant="outline" className="h-7 gap-1">
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                  </span>
                </Button>
                <Button
                  size="sm"
                  className="h-7 gap-1"
                  onClick={handleAddButtonClick}
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Thêm mới
                  </span>
                </Button>
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Thương hiệu</CardTitle>
                  <CardDescription>
                    Quản lý các thương hiệu của sản phẩm (SP)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead></TableHead>
                        <TableHead>Tên thương hiệu</TableHead>
                        <TableHead>Mô tả</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Ngày tạo
                        </TableHead>
                        <TableHead>
                          <span className="sr-only">Hành động</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {brands.map((brand) => (
                        <TableRow key={brand.id}>
                          <TableCell className="hidden sm:table-cell">
                            <Image
                              alt="Ảnh thương hiệu"
                              className="aspect-square rounded-md object-cover"
                              src={brand.logoUrl ? brand.logoUrl : iconNotFound}
                              width="64"
                              height="64"
                              unoptimized
                            />
                          </TableCell>
                          <TableCell>{brand.name}</TableCell>
                          <TableCell>{brand.description}</TableCell>
                          <TableCell>
                            {!brand.deleted ? "Hoạt động" : "Đã xóa"}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {new Date(brand.createdAt).toLocaleString()}{" "}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-haspopup="true"
                                  size="icon"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                  onClick={() => handleEditButtonClick(brand)}
                                >
                                  Sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                  onClick={() =>
                                    handleDeleteButtonClick(brand.id)
                                  }
                                >
                                  Xoá
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <PaginationAdminTable />
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      {isDialogOpen && (
        <DialogAddEditBrand
          content={dialogContent}
          description={
            "Sản phẩm thuộc danh mục có thương hiệu này sẽ có thể điền nội dung vào"
          }
          nameButton={
            dialogContent === "Thêm mới thương hiệu"
              ? "Thêm mới"
              : "Lưu thay đổi"
          }
          isOpen={isDialogOpen}
          onClose={isCloseDialog}
          onSuccess={refreshData}
          brand={selectedBrand}
        />
      )}
    </div>
  );
}
