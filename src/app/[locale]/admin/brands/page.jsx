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
import { useCallback, useEffect, useState } from "react";
import { deleteBrand, getAllBrand } from "@/api/admin/brandRequest";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import DialogAddEditBrand from "@/components/dialogs/dialogAddEditBrand";
import iconNotFound from "../../../../../public/images/iconNotFound.png";
import DialogImageBrand from "@/components/dialogs/dialogImageBrand";

export default function ManageBrand() {
  const [isDialogAddEditOpen, setIsDialogAddEditOpen] = useState(false);
  const [dialogAddEditTitle, setDialogAddEditTitle] = useState("");
  const [dialogAddEditDescription, setDialogAddEditDescription] = useState("");
  const [dialogAddEditNameButton, setDialogAddEditNameButton] = useState("");
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [tab, setTab] = useState("all");
  const [sortType, setSortType] = useState("");
  const [totalElement, setTotalElement] = useState(0);
  const { toast } = useToast();
  const [isDialogImageOpen, setIsDialogImageOpen] = useState(false);
  const [dialogImageTitle, setDiaLogImageTitle] = useState("");
  const [dialogImageDescription, setDiaLogImageDescription] = useState("");
  const [dialogImageNameButton, setDiaLogImageNameButton] = useState("");

  const handleNextPage = () => {
    console.log("Current page:", currentPage, "Total page:", totalPage);
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    console.log("Current page:", currentPage, "Total page:", totalPage);
  };

  const handleSortChange = (type) => {
    setSortType(sortType === type ? "" : type);
  };

  const fetchBrand = useCallback(async () => {
    try {
      const response = await getAllBrand(currentPage, tab, sortType);
      setBrands(response.result.data);
      setTotalPage(response.result.totalPages);
      setTotalElement(response.result.totalElements);
    } catch (error) {
      toast({
        title: "Thất bại",
        description:
          error.message === "Unauthenticated"
            ? "Phiên làm việc hết hạn. Vui lòng đăng nhập lại!!!"
            : error.message,
        variant: "destructive",
      });
    }
  }, [toast, currentPage, tab, sortType]);

  useEffect(() => {
    fetchBrand();
  }, [fetchBrand, totalPage, totalElement]);

  const refreshPage = () => {
    fetchBrand();
    setIsDialogAddEditOpen(false);
    setIsDialogImageOpen(false);
  };

  const handleAddButtonClick = () => {
    setSelectedBrand(null);
    setIsDialogAddEditOpen(true);
    setDialogAddEditTitle("Thêm mới thương hiệu");
    setDialogAddEditDescription(
      "Nhập đầy đủ thông tin để thêm thương hiệu mới"
    );
    setDialogAddEditNameButton("Thêm mới");
  };

  const handleEditButtonClick = (brand) => {
    setSelectedBrand(brand);
    setIsDialogAddEditOpen(true);
    setDialogAddEditTitle("Sửa thương hiệu");
    setDialogAddEditDescription(
      "Nhập đầy đủ thông tin để chỉnh sửa thương hiệu"
    );
    setDialogAddEditNameButton("Lưu thay đổi");
  };

  const handleUploadImageClick = (brand) => {
    setSelectedBrand(brand);
    setIsDialogImageOpen(true);
    setDiaLogImageTitle("Cập nhật logo thương hiệu");
    setDiaLogImageDescription("Chọn ảnh logo thương hiệu phù hợp để cập nhật");
    setDiaLogImageNameButton("Cập nhật");
  };

  const isCloseDialogAddEdit = () => {
    setIsDialogAddEditOpen(false);
  };

  const isCloseDialogImage = () => {
    setIsDialogImageOpen(false);
  };

  const handleDeleteButtonClick = async (brandId) => {
    try {
      await deleteBrand(brandId);
      toast({
        title: "Thành công",
        description: "Thương hiệu đã được xóa",
      });
      refreshPage();
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
                <TabsTrigger value="all" onClick={() => setTab("all")}>
                  Tất cả
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
                    <DropdownMenuLabel>Sắp xếp theo</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      onClick={() => handleSortChange("newest")}
                      checked={sortType === "newest"}
                    >
                      Mới nhất
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      onClick={() => handleSortChange("az")}
                      checked={sortType === "az"}
                    >
                      A - Z
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      onClick={() => handleSortChange("oldest")}
                      checked={sortType === "oldest"}
                    >
                      Lâu nhất
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      onClick={() => handleSortChange("za")}
                      checked={sortType === "za"}
                    >
                      Z - A
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
            <TabsContent value={tab}>
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>
                    Danh sách các thương hiệu ({totalElement})
                  </CardTitle>
                  <CardDescription>
                    Quản lý các thương hiệu của sản phẩm trong hệ thống
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead></TableHead>
                        <TableHead>Tên thương hiệu</TableHead>
                        <TableHead>Mô tả</TableHead>
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
                              priority
                            />
                          </TableCell>
                          <TableCell>{brand.name}</TableCell>
                          <TableCell>{brand.description}</TableCell>
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
                                  className="cursor-pointer"
                                >
                                  Sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                  onClick={() =>
                                    handleDeleteButtonClick(brand.id)
                                  }
                                  className="cursor-pointer"
                                >
                                  Xoá
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                  onClick={() => handleUploadImageClick(brand)}
                                  className="cursor-pointer"
                                >
                                  Cập nhật Logo
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
                  <PaginationAdminTable
                    currentPage={currentPage}
                    handleNextPage={handleNextPage}
                    handlePrevPage={handlePrevPage}
                    totalPage={totalPage}
                    setCurrentPage={setCurrentPage}
                  />
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      {isDialogAddEditOpen && (
        <DialogAddEditBrand
          title={dialogAddEditTitle}
          description={dialogAddEditDescription}
          nameButton={dialogAddEditNameButton}
          isOpen={isDialogAddEditOpen}
          onClose={isCloseDialogAddEdit}
          onSuccess={refreshPage}
          brandDataEdit={selectedBrand}
        />
      )}
      {isDialogImageOpen && (
        <DialogImageBrand
          title={dialogImageTitle}
          description={dialogImageDescription}
          nameButton={dialogImageNameButton}
          isOpen={isDialogImageOpen}
          onClose={isCloseDialogImage}
          brandImage={selectedBrand}
          refreshPage={refreshPage}
        />
      )}
    </div>
  );
}
