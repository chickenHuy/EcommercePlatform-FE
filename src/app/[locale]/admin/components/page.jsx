"use client";
import { File, ListFilter, MoreHorizontal } from "lucide-react";
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
import Loading from "@/components/loading";
import { formatDate } from "@/utils/commonUtils";
import { useToast } from "@/hooks/use-toast";
import { useSelector } from "react-redux";

export default function ManageComponent() {
  const { toast } = useToast();
  const pageSize = 20;
  const [listComponents, setListComponents] = useState(null);
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
  const [sortOption, setSortOption] = useState("newest");
  const [requirementOption, setRequirementOption] = useState("all");

  const loadComponents = async (page) => {
    setListComponents(null);

    const response = await getComponent(page, pageSize);
    let data = response?.result?.data || [];

    setCurrentPage(response?.result?.currentPage || 1);
    setPaginationData({
      ...paginationData,
      hasNext: response?.result?.hasNext || false,
      hasPrevious: response?.result?.hasPrevious || false,
      totalPage: response?.result?.totalPages || 1,
      currentPage: response?.result?.currentPage || 1,
      totalElements: response?.result?.totalElements || 0,
    });

    data = sortData(data, sortOption);
    data = filterData(data, requirementOption);
    setListComponents(data);
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
    loadComponents(currentPage);
  }, [sortOption, requirementOption]);

  const handleCreateComponent = (data) => {
    createComponent(data)
      .then(() => {
        loadComponents(currentPage);
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
        loadComponents(currentPage);
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

  const handleRemoveComponent = (id) => {
    removeComponent(id)
      .then(() => {
        loadComponents(currentPage);
        toast({
          title: "Thành công",
          description: "Xóa thành phần thành công",
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

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Toaster />
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
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
                <Button size="sm" variant="outline" className="h-7 gap-1">
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                  </span>
                </Button>
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
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
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
                              <TableCell className="text-center">
                                {index + pageSize * (currentPage - 1) + 1}
                              </TableCell>
                              <TableCell>{component.name}</TableCell>
                              <TableCell className="text-center">
                                <Badge
                                  variant="outline"
                                  className="px-5 text-[14px] font-bold"
                                >
                                  {component.required ? "Có" : "Không"}
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden lg:table-cell text-center">
                                {formatDate(component.createdAt)}
                              </TableCell>
                              <TableCell className="hidden lg:table-cell text-center">
                                {formatDate(component.lastUpdatedAt)}
                              </TableCell>
                              <TableCell className="text-center">
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
                                        handleSaveChange={handleUpdateComponent}
                                      />
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="flex flex-row justify-between items-center cursor-pointer"
                                      onClick={() =>
                                        handleRemoveComponent(component.id)
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
                  {listComponents === null && <Loading />}
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
