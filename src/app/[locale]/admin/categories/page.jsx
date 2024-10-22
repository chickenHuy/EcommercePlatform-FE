"use client";

import { useCallback, useEffect, useState } from "react";
import { Delete, File, ListFilter, Lock, PlusCircle } from "lucide-react";
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
import { PaginationAdminTable } from "@/components/paginations/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { deleteCategory, getAllCategory } from "@/api/admin/categoryRequest";
import EditCategory from "./editCategories";
import DialogConfirm from "@/components/dialogs/dialogConfirm";
import { useSelector } from "react-redux";

export default function ManageCategories() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [sortType, setSortType] = useState("");
  const [totalElement, setTotalElement] = useState(0);
  const { toast } = useToast();
  const [selectedCate, setSelectedCate] = useState(null);
  const [isDialogConfirmOpen, setIsDialogConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [categoryTableName, setCategoryTableName] = useState(null);
  var searchTerm = useSelector((state) => state.searchReducer.searchTerm);

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

  const handleRowClick = (slug) => {
    setIsDrawerOpen(true);
    setSelectedCate(slug);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleAddNewCategory = () => {
    setIsDrawerOpen(true);
    setSelectedCate(null);
  };

  const fetchCategory = useCallback(async () => {
    try {
      const response = await getAllCategory(currentPage, sortType, searchTerm);
      setCategories(response.result.data);
      console.log("Categories: ", response.result.data);
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
  }, [toast, currentPage, sortType, searchTerm]);

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory, totalPage, totalElement, isDrawerOpen]);

  const handleDeleteButtonClick = (category) => {
    setCategoryToDelete(category);
    setIsDialogConfirmOpen(true);
    setCategoryTableName("danh mục");
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      try {
        await deleteCategory(categoryToDelete.id);
        toast({
          title: "Thành công",
          description: `Danh mục "${categoryToDelete.name}" đã được xóa`,
        });
        fetchCategory();
        setIsDialogConfirmOpen(false);
        setCategoryTableName(null);
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
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Toaster />
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
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
            <Button
              size="sm"
              variant="outline"
              className="h-7 gap-1"
              onClick={() => {
                handleAddNewCategory();
              }}
            >
              <PlusCircle className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Thêm mới
              </span>
            </Button>
          </div>
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Danh sách danh mục ({totalElement})</CardTitle>
              <CardDescription>
                Quản lý tất cả danh mục trong hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Icon</TableHead>
                    <TableHead>Tên</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Danh mục cha</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="hidden md:table-cell">
                      <span className="sr-only">Hành động</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow
                      key={category.id}
                      onClick={() => handleRowClick(category.slug)}
                    >
                      <TableCell className="hidden sm:table-cell">
                        <Avatar>
                          <AvatarImage
                            src={category.iconUrl}
                            alt={category.name}
                          />
                          <AvatarFallback>
                            {category.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        {category.name}
                      </TableCell>
                      <TableCell className="font-medium">
                        {category.slug}
                      </TableCell>
                      <TableCell className="font-medium">
                        {category.parentName ? category.parentName : "Không"}
                      </TableCell>
                      <TableCell className="font-medium">
                        {new Date(category.createdAt).toLocaleString()}{" "}
                        {/* Format date */}
                      </TableCell>
                      <TableCell className=" md:table-cell">
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteButtonClick(category);
                          }}
                        >
                          <Delete className="h-4 w-4" />
                          <span className="sr-only">Xoá</span>
                        </Button>
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
        </main>
      </div>
      <EditCategory
        isOpen={isDrawerOpen}
        onClose={() => handleCloseDrawer()}
        categorySlug={selectedCate}
      />
      <DialogConfirm
        isOpen={isDialogConfirmOpen}
        onClose={() => setIsDialogConfirmOpen(false)}
        onConfirm={confirmDelete}
        tableName={categoryTableName}
        objectName={categoryToDelete?.name}
      />
    </div>
  );
}
