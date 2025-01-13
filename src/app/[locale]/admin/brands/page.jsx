"use client";

import { ArrowUpDown, MoreHorizontal, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
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
import { PaginationAdminTable } from "@/components/paginations/pagination";
import { Toaster } from "@/components/ui/toaster";
import { useCallback, useEffect, useState } from "react";
import { deleteBrand, getAllBrand } from "@/api/admin/brandRequest";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import DialogAddEditBrand from "@/components/dialogs/dialogAddEditBrand";
import DialogConfirm from "@/components/dialogs/dialogConfirm";
import { useSelector } from "react-redux";
import BrandEmpty from "@/assets/images/brandEmpty.jpg";
import { formatDate } from "@/utils/commonUtils";
import { CircularProgress } from "@mui/material";
import { Label } from "@/components/ui/label";
import ReviewEmpty from "@/assets/images/ReviewEmpty.png";

export default function ManageBrand() {
  const pageSize = 10;
  const [isDialogAddEditOpen, setIsDialogAddEditOpen] = useState(false);
  const [dialogAddEditTitle, setDialogAddEditTitle] = useState("");
  const [dialogAddEditDescription, setDialogAddEditDescription] = useState("");
  const [dialogAddEditNameButton, setDialogAddEditNameButton] = useState("");
  const [listBrand, setListBrand] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [orderBy, setOrderBy] = useState("desc");
  const [totalElement, setTotalElement] = useState(0);
  const { toast } = useToast();
  const [isDialogConfirmOpen, setIsDialogConfirmOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const [brandTableName, setBrandTableName] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  var searchTerm = useSelector((state) => state.searchReducer.searchTerm);
  const [isLoading, setIsLoading] = useState(true);

  const handleNextPage = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handleOrderChange = (value) => {
    setOrderBy(value);
  };

  const fetchAllBrand = useCallback(async () => {
    try {
      const response = await getAllBrand(
        currentPage,
        pageSize,
        sortBy,
        orderBy,
        searchTerm
      );
      setListBrand(response.result.data);
      setTotalPage(response.result.totalPages);
      setTotalElement(response.result.totalElements);
      setHasNext(response.result.hasNext);
      setHasPrevious(response.result.hasPrevious);
      setIsLoading(false);
    } catch (error) {}
  }, [currentPage, sortBy, orderBy, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    fetchAllBrand();
  }, [fetchAllBrand, totalPage, totalElement]);

  const refreshPage = () => {
    fetchAllBrand();
    setIsDialogAddEditOpen(false);
  };

  const handleAddButtonClick = () => {
    setSelectedBrand(null);
    setIsDialogAddEditOpen(true);
    setDialogAddEditTitle("Thêm mới thương hiệu");
    setDialogAddEditDescription(
      "Nhập thông tin cần thiết để thêm mới thương hiệu"
    );
    setDialogAddEditNameButton("Lưu");
  };

  const handleEditButtonClick = (brand) => {
    setSelectedBrand(brand);
    setIsDialogAddEditOpen(true);
    setDialogAddEditTitle("Chỉnh sửa thương hiệu");
    setDialogAddEditDescription(
      "Nhập thông tin cần thiết để chỉnh sửa thương hiệu"
    );
    setDialogAddEditNameButton("Lưu");
  };

  const isCloseDialogAddEdit = () => {
    setIsDialogAddEditOpen(false);
  };

  const isCloseDialogComfirm = () => {
    setIsDialogConfirmOpen(false);
  };

  const handleDeleteButtonClick = (brand) => {
    setBrandToDelete(brand);
    setIsDialogConfirmOpen(true);
    setBrandTableName("thương hiệu");
  };

  const confirmDelete = async () => {
    if (brandToDelete) {
      try {
        await deleteBrand(brandToDelete.id);
        toast({
          description: `Xóa thương hiệu "${brandToDelete.name}" thành công`,
        });
        fetchAllBrand();
        setIsDialogConfirmOpen(false);
        setBrandTableName(null);
      } catch (error) {
        toast({
          title: "Thất bại",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="flex flex-col bg-muted/40">
      <Toaster />
      {isLoading ? (
        <div className="fixed inset-0 flex flex-col justify-center items-center z-[500] space-y-4 bg-black-secondary">
          <CircularProgress />
          <Label className="text-2xl text-white-primary">
            Đang tải dữ liệu...
          </Label>
        </div>
      ) : (
        <div className="flex flex-col sm:gap-4 sm:py-4">
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-4">
            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 gap-1">
                    <ArrowUpDown className="h-3.5 w-3.5" />
                    <Label className="truncate sr-only sm:not-sr-only hover:cursor-pointer">
                      Sắp xếp
                    </Label>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sắp xếp</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={sortBy}
                    onValueChange={(value) => handleSortChange(value)}
                  >
                    <DropdownMenuRadioItem value="createdAt">
                      Ngày tạo
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="name">
                      Tên TH
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={orderBy}
                    onValueChange={(value) => handleOrderChange(value)}
                  >
                    <DropdownMenuRadioItem value="asc">
                      Tăng dần
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="desc">
                      Giảm dần
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setSortBy("");
                      setOrderBy("");
                    }}
                  >
                    Không sắp xếp
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1"
                onClick={handleAddButtonClick}
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <Label className="truncate sr-only sm:not-sr-only hover:cursor-pointer">
                  Thêm mới
                </Label>
              </Button>
            </div>
            {listBrand && listBrand.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>
                    Danh sách tất cả thương hiệu ({totalElement})
                  </CardTitle>
                  <CardDescription>
                    Quản lý tất cả thương hiệu của các nhà sản xuất trong hệ thống
                  </CardDescription>
                </CardHeader>
                <CardContent className="min-h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead></TableHead>
                        <TableHead>Tên thương hiệu</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Mô tả
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Ngày tạo
                        </TableHead>
                        <TableHead>
                          <span className="sr-only">Hành động</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {listBrand.map((brand) => (
                        <TableRow key={brand.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center justify-center">
                              <Image
                                alt={brand.name}
                                className="aspect-square rounded-md object-cover"
                                src={brand.logoUrl ? brand.logoUrl : BrandEmpty}
                                width={50}
                                height={50}
                                unoptimized
                                priority
                              />
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-center">
                            {brand.name}
                          </TableCell>
                          <TableCell className="font-medium text-center min-w-[200px] max-w-[300px] hidden md:table-cell">
                            {brand.description || "(trống)"}
                          </TableCell>
                          <TableCell className="font-medium text-center truncate hidden sm:table-cell">
                            {formatDate(brand.createdAt)}
                          </TableCell>
                          <TableCell className="font-medium text-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-haspopup="true"
                                  size="icon"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                  onClick={() => handleEditButtonClick(brand)}
                                  className="flex items-center justify-between cursor-pointer"
                                >
                                  Sửa
                                  <EditIcon />
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                  onClick={() => handleDeleteButtonClick(brand)}
                                  className="flex items-center justify-between cursor-pointer"
                                >
                                  Xoá
                                  <DeleteIcon />
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
                    hasNext={hasNext}
                    hasPrevious={hasPrevious}
                  />
                </CardFooter>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center border rounded-lg min-h-[750px]">
                <Image
                  alt="ảnh trống"
                  className="mx-auto"
                  src={ReviewEmpty}
                  width={200}
                  height={200}
                />
                <Label className="text-xl text-gray-tertiary text-center m-2">
                  Hiện tại chưa có thương hiệu nào
                </Label>
              </div>
            )}
          </main>
        </div>
      )}
      {isDialogAddEditOpen && (
        <>
          <div className="fixed inset-0 bg-black-primary bg-opacity-85 z-[150]" />
          <DialogAddEditBrand
            title={dialogAddEditTitle}
            description={dialogAddEditDescription}
            nameButton={dialogAddEditNameButton}
            onOpen={isDialogAddEditOpen}
            onClose={isCloseDialogAddEdit}
            refreshPage={refreshPage}
            brandEdit={selectedBrand}
            setIsLoading={setIsLoading}
          />
        </>
      )}
      {isDialogConfirmOpen && (
        <DialogConfirm
          isOpen={isDialogConfirmOpen}
          onClose={isCloseDialogComfirm}
          onConfirm={confirmDelete}
          tableName={brandTableName}
          objectName={brandToDelete?.name}
        />
      )}
    </div>
  );
}
