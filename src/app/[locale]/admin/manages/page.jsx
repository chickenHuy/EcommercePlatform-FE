"use client";
import { useCallback, useEffect, useState } from "react";
import { Eye, ListFilter, Lock, EyeClosed, LockOpen } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaginationAdminTable } from "@/components/paginations/pagination";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { getAllAdmin, handleAccountAdmin } from "@/api/admin/manageRequest";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import DrawerAdminDetail from "./drawerAdminDetail";
import { useSelector } from "react-redux";
import { formatDate } from "@/utils";
import Image from "next/image";
import ReviewEmpty from "@/assets/images/ReviewEmpty.png";
import { CircularProgress } from "@mui/material";

export default function ManageAdmin() {
  const pageSize = 10;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const { toast } = useToast();
  const [tab, setTab] = useState("all");
  const [sortType, setSortType] = useState("");
  const [totalElement, setTotalElement] = useState(0);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [password, setPassword] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  var searchTerm = useSelector((state) => state.searchReducer.searchTerm);

  const handleNextPage = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleAdminAccount = async (accountId) => {
    try {
      await handleAccountAdmin(accountId, password);
      toast({
        tiltel: "Thành công",
        description: "Thay đổi trạng thái tài khoản thành công",
      });
    } catch (error) {
      toast({
        title: "Thất bại",
        description:
          error.message === "Unauthenticated"
            ? "Phiên làm việc hết hạn. Vui lòng đăng nhập lại!!!"
            : error.message,
        variant: "destructive",
      });
    } finally {
      setPassword(null);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleRowClick = (adminId) => {
    setSelectedAdminId(adminId);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedAdminId(null);
  };

  const handleSortChange = (type) => {
    setSortType(sortType === type ? "" : type);
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await getAllAdmin(
        currentPage,
        pageSize,
        tab,
        sortType,
        searchTerm
      );
      setAdmins(response.result.data);
      setTotalPage(response.result.totalPages);
      setTotalElement(response.result.totalElements);
      setHasNext(response.result.hasNext);
      setHasPrevious(response.result.hasPrevious);
    } catch (error) {
      console.error("Error fetching stores:", error);
      toast({
        title: "Thất bại",
        description:
          error.message === "Unauthenticated"
            ? "Phiên làm việc hết hạn. Vui lòng đăng nhập lại!!!"
            : error.message,
        variant: "destructive",
      });
    }
  }, [toast, currentPage, tab, sortType, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    setIsLoading(true);
    fetchData();
    setIsLoading(false);
  }, [fetchData, totalPage, totalElement, password]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Toaster />
      {isLoading ? (
        <div className="fixed inset-0 flex flex-col justify-center items-center z-[100] space-y-4 bg-black-secondary">
          <CircularProgress />
          <p className="text-2xl text-white-primary">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <div className="flex flex-col sm:gap-4 sm:py-4">
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Tabs defaultValue="all" value={tab}>
              <div className="flex items-center">
                <TabsList>
                  <TabsTrigger value="all" onClick={() => setTab("all")}>
                    Tất cả
                  </TabsTrigger>
                  <TabsTrigger value="active" onClick={() => setTab("active")}>
                    Hoạt động
                  </TabsTrigger>
                  <TabsTrigger
                    value="blocked"
                    onClick={() => setTab("blocked")}
                    className="hidden sm:flex"
                  >
                    Đã khoá
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
                </div>
              </div>
              <TabsContent value={tab}>
                {admins && admins.length > 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        Danh sách quản trị viên ({totalElement})
                      </CardTitle>
                      <CardDescription>
                        Quản lý tất cả quản trị viên trong hệ thống
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="hidden w-[100px] sm:table-cell">
                              <span className="sr-only">Image</span>
                            </TableHead>
                            <TableHead>Username</TableHead>
                            <TableHead>Tên</TableHead>
                            <TableHead>Ngày tạo</TableHead>
                            <TableHead className="hidden md:table-cell">
                              <span className="sr-only">Hành động</span>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {admins.map((admin) => (
                            <TableRow
                              key={admin.id}
                              onClick={() => handleRowClick(admin.id)}
                            >
                              <TableCell className="hidden sm:table-cell">
                                <div className="flex items-center justify-center">
                                  <Avatar>
                                    <AvatarImage
                                      src={admin.imageUrl}
                                      alt={admin.username}
                                    />
                                    <AvatarFallback>
                                      {admin.name?.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                </div>
                              </TableCell>
                              <TableCell className="font-medium text-center">
                                {admin.username}
                              </TableCell>
                              <TableCell className="font-medium text-center">
                                {admin.name}
                              </TableCell>
                              <TableCell className="font-medium text-center">
                                {formatDate(admin.created_at)}
                              </TableCell>
                              <TableCell className="hidden md:table-cell text-center">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      aria-haspopup="true"
                                      size="icon"
                                      variant="ghost"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                      }}
                                    >
                                      {admin.is_blocked ? (
                                        <LockOpen className="h-4 w-4" />
                                      ) : (
                                        <Lock className="h-4 w-4" />
                                      )}
                                      <span className="sr-only">
                                        Khoá tài khoản
                                      </span>
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent
                                    className="sm:max-w-md"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                    }}
                                  >
                                    <DialogHeader>
                                      <DialogTitle>
                                        {admin.is_blocked
                                          ? "Mở khoá tài khoản"
                                          : "Khoá tài khoản"}
                                        :{admin.username}
                                      </DialogTitle>
                                      <DialogDescription>
                                        Vui lòng nhập mật khẩu trước khi thực
                                        hiện thao tác này
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex items-center space-x-2">
                                      <div className="grid flex-1 gap-2">
                                        <Label
                                          htmlFor="link"
                                          className="sr-only"
                                        >
                                          Link
                                        </Label>
                                        <Input
                                          type={
                                            isPasswordVisible
                                              ? "text"
                                              : "password"
                                          }
                                          id="password"
                                          placeholder="Nhập mật khẩu"
                                          value={password}
                                          onChange={(e) =>
                                            setPassword(e.target.value)
                                          }
                                        />
                                      </div>
                                      <Button
                                        type="button"
                                        size="sm"
                                        className="px-3"
                                        onClick={() =>
                                          setIsPasswordVisible(
                                            !isPasswordVisible
                                          )
                                        }
                                      >
                                        {isPasswordVisible ? (
                                          <EyeClosed className="h-5 w-4" />
                                        ) : (
                                          <Eye className="h-5 w-4" />
                                        )}
                                      </Button>
                                    </div>
                                    <DialogFooter className="sm:justify-start">
                                      <DialogClose asChild>
                                        <Button
                                          type="button"
                                          variant="secondary"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleAdminAccount(admin.id);
                                          }}
                                        >
                                          {admin.is_blocked
                                            ? "Mở khoá tài khoản"
                                            : "Khoá tài khoản"}
                                        </Button>
                                      </DialogClose>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
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
                  <div className="flex flex-col items-center justify-center border rounded-lg min-h-[400px] mt-6">
                    <Image
                      alt="ảnh trống"
                      className="mx-auto"
                      src={ReviewEmpty}
                      width={200}
                      height={200}
                    />
                    <Label className="text-xl text-gray-tertiary text-center m-2">
                      Hiện tại chưa có quản trị viên nào
                    </Label>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </main>
        </div>
      )}
      {isDrawerOpen && (
        <DrawerAdminDetail
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
          adminId={selectedAdminId}
        />
      )}
    </div>
  );
}
