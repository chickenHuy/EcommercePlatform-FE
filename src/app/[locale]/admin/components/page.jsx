"use client";
import { ListFilter, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { PaginationAdminTable } from "@/components/paginations/pagination";
import { Toaster } from "@/components/ui/toaster";
import DialogEditComponent from "@/components/dialogs/dialogEditComponent";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useEffect, useState } from "react";
import {
  createComponent,
  getComponent,
  removeComponent,
  updateComponent,
} from "@/api/admin/componentRequest";
import { formatDate } from "@/utils/commonUtils";
import { useToast } from "@/hooks/use-toast";
import DialogConfirm from "@/components/dialogs/dialogConfirm";
import { useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import ReviewEmpty from "@/assets/images/ReviewEmpty.png";

export default function ManageComponent() {
  const { toast } = useToast();
  const searchTerm = useSelector((state) => state.searchReducer.searchTerm);
  const pageSize = 10;
  const [listComponents, setListComponents] = useState(null);
  let currentPageGlobal = 1;
  const [paginationData, setPaginationData] = useState({
    hasNext: false,
    hasPrevious: false,
    currentPage: currentPageGlobal,
    totalPage: 1,
    totalElements: 0,
    handleNextPage: () => {
      loadComponents(currentPageGlobal + 1);
    },
    handlePrevPage: () => {
      loadComponents(currentPageGlobal - 1);
    },
    setCurrentPage: (page) => {
      loadComponents(page);
    },
  });
  const [sortOption, setSortOption] = useState("newest");
  const [requirementOption, setRequirementOption] = useState("all");
  const [isDialogConfirmOpen, setIsDialogConfirmOpen] = useState(false);
  const [componentToDelete, setComponentToDelete] = useState(null);
  const [componentTableName, setComponentTableName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadComponents = async (page) => {
    setListComponents(null);

    const response = await getComponent(page, pageSize, searchTerm);
    let data = response?.result?.data || [];

    currentPageGlobal = response.result.currentPage;
    setPaginationData((prevData) => ({
      ...prevData,
      hasNext: response?.result?.hasNext || false,
      hasPrevious: response?.result?.hasPrevious || false,
      totalPage: response?.result?.totalPages || 1,
      currentPage: response?.result?.currentPage || 1,
      totalElements: response?.result?.totalElements || 0,
    }));

    data = sortData(data, sortOption);
    data = filterData(data, requirementOption);
    setListComponents(data);
    setIsLoading(false);
  };

  const filterData = (data, filter) => {
    if (filter === "required") {
      return data.filter((item) => item.required);
    }
    if (filter === "noRequired") {
      return data.filter((item) => !item.required);
    }
    return data;
  };

  const sortData = (data, sortOption) => {
    if (sortOption === "newest") {
      return data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    }
    if (sortOption === "oldest") {
      return data.sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
    }
    if (sortOption === "az") {
      return data.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    }
    if (sortOption === "za") {
      return data.sort((a, b) => {
        return b.name.localeCompare(a.name);
      });
    }

    return data;
  };

  useEffect(() => {
    loadComponents(currentPageGlobal);
  }, [sortOption, requirementOption]);

  useEffect(() => {
    loadComponents(currentPageGlobal);
  }, [searchTerm]);

  const handleCreateComponent = (data) => {
    createComponent(data)
      .then(() => {
        loadComponents(currentPageGlobal);
        toast({
          title: "Thành công",
          description: "Thêm thông số sản phẩm thành công",
        });
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Thất bại",
          description: error.message,
        });
        console.log(error);
      });
  };

  const handleUpdateComponent = (id, data) => {
    updateComponent(data, id)
      .then(() => {
        loadComponents(currentPageGlobal);
        toast({
          title: "Thành công",
          description: "Cập nhật thành phần thành công",
        });
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Thất bại",
          description: error.message,
        });
        console.log(error);
      });
  };

  const handleClickButtonRemoveComponent = (component) => {
    setComponentToDelete(component);
    setIsDialogConfirmOpen(true);
    setComponentTableName("thông số kỹ thuật");
  };

  const confirmDelete = async () => {
    if (componentToDelete) {
      try {
        await removeComponent(componentToDelete.id);
        toast({
          title: "Thành công",
          description: `Thông số kỹ thuật "${componentToDelete.name}" đã được xóa`,
        });
        loadComponents(currentPageGlobal);
        setIsDialogConfirmOpen(false);
        setComponentTableName(null);
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
          {isLoading ? (
            <div className="fixed inset-0 flex flex-col justify-center items-center z-[100] space-y-4 bg-black-secondary">
              <CircularProgress />
              <p className="text-2xl text-white-primary">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <Tabs defaultValue="all">
              <div className="flex items-center">
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
                      <DropdownMenuRadioGroup
                        value={sortOption}
                        onValueChange={setSortOption}
                      >
                        <DropdownMenuRadioItem value="newest">
                          Mới nhất
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="oldest">
                          Cũ nhất
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="az">
                          A - Z
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="za">
                          Z - A
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup
                        value={requirementOption}
                        onValueChange={setRequirementOption}
                      >
                        <DropdownMenuRadioItem value="all">
                          Tất cả
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="required">
                          Bắt buộc
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="notRequired">
                          Không bắt buộc
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DialogEditComponent
                    name={"Thêm thành phần"}
                    content={"Thêm thành phần mới"}
                    description={
                      "Sản phẩm thuộc danh mục có thành phần này sẽ có thể điền nội dung vào"
                    }
                    nameButton={"Thêm mới"}
                    typeDisplay={"button"}
                    icon={<AddCircleOutlineIcon />}
                    handleSaveChange={handleCreateComponent}
                  />
                </div>
              </div>
              <TabsContent value="all" className="mt-4">
                {listComponents && listComponents.length > 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[18px] font-extrabold">
                        Thành Phần Thông Số Kỹ Thuật
                      </CardTitle>
                      <CardDescription className="text-black-primary font-bold text-[15px]">
                        Quản lý các thành phần thông số kỹ thuật của sản phẩm.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>Tên thành phần</TableHead>
                            <TableHead>Bắt buộc</TableHead>
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
                        <TableBody>
                          {listComponents !== null &&
                            listComponents.map((component, index) => {
                              return (
                                <TableRow key={index}>
                                  <TableCell className="font-medium text-center">
                                    {index +
                                      pageSize * (currentPageGlobal - 1) +
                                      1}
                                  </TableCell>
                                  <TableCell className="font-medium">{component.name}</TableCell>
                                  <TableCell className="font-medium text-center">
                                    <Badge
                                      variant="outline"
                                      className="px-5 text-[14px] font-medium"
                                    >
                                      {component.required ? "Có" : "Không"}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="font-medium hidden lg:table-cell text-center">
                                    {formatDate(component.createdAt)}
                                  </TableCell>
                                  <TableCell className="font-medium hidden lg:table-cell text-center">
                                    {formatDate(component.lastUpdatedAt)}
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
                                          <span className="sr-only">
                                            Toggle menu
                                          </span>
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>
                                          Hành động
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                          onSelect={(e) => e.preventDefault()}
                                        >
                                          <DialogEditComponent
                                            id={component.id}
                                            initValue={component.name}
                                            name={"Sửa"}
                                            icon={<EditIcon />}
                                            content={"Sửa thành phần"}
                                            nameButton={"Lưu thay đổi"}
                                            handleSaveChange={
                                              handleUpdateComponent
                                            }
                                          />
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          className="flex flex-row justify-between items-center cursor-pointer"
                                          onClick={() =>
                                            handleClickButtonRemoveComponent(
                                              component
                                            )
                                          }
                                        >
                                          <span>Xoá</span>
                                          <DeleteIcon className="scale-75" />
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter className="relative">
                      <div className="w-full text-xs text-muted-foreground">
                        Hiển thị{" "}
                        <strong>
                          {1 +
                            pageSize * (currentPageGlobal - 1) +
                            " - " +
                            pageSize * currentPageGlobal}
                        </strong>{" "}
                        trong <strong>{paginationData.totalElements}</strong>{" "}
                        thành phần
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
                ) : (
                  <div className="flex flex-col items-center justify-center border rounded-lg min-h-[400px] mt-6">
                    <Image
                      alt="ảnh trống"
                      className="mx-auto"
                      src={ReviewEmpty}
                      width={200}
                      height={200}
                    />
                    <Label className="text-xl text-gray-tertiary text-center m-2">
                      Hiện tại chưa có thông số kỹ thuật nào
                    </Label>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>
      {isDialogConfirmOpen && (
        <DialogConfirm
          isOpen={isDialogConfirmOpen}
          onClose={() => setIsDialogConfirmOpen(false)}
          onConfirm={confirmDelete}
          tableName={componentTableName}
          objectName={componentToDelete.name}
        />
      )}
    </div>
  );
}
