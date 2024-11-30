"use client";
import { useCallback, useEffect, useState } from "react";
import { Eye, File, ListFilter, Lock, EyeClosed, LockOpen } from "lucide-react";
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
import {
  getAllCustomer,
  handleAccountCustomer,
} from "@/api/admin/customerRequest";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import DrawerCustomerDetail from "./drawerUserDetail";

export default function ManageCustomer() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [customers, setCustomers] = useState([]); // State for user data
  const [selectedUserId, setSelectedUserId] = useState(null); // State for selected user ID
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

  var searchTerm = useSelector((state) => state.searchReducer.searchTerm);

  const handleNextPage = () => {
    console.log("Current page:", currentPage, "Total page:", totalPage);
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleCustomerAccount = async (accountId) => {
    try {
      await handleAccountCustomer(accountId, password);
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
    console.log("Current page:", currentPage, "Total page:", totalPage);
  };

  const handleRowClick = (userId) => {
    setSelectedUserId(userId);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedUserId(null);
  };

  const handleSortChange = (type) => {
    setSortType(sortType === type ? "" : type);
  };

  const fetchCustomer = useCallback(async () => {
    try {
      const response = await getAllCustomer(
        currentPage,
        tab,
        sortType,
        searchTerm
      );
      setCustomers(response.result.data);
      setTotalPage(response.result.totalPages);
      setTotalElement(response.result.totalElements);
      setHasNext(response.result.hasNext);
      setHasPrevious(response.result.hasPrevious);
    } catch (error) {
      console.error("Error fetching customers:", error);
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
    fetchCustomer();
  }, [fetchCustomer, totalPage, totalElement, password]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Toaster />
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
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Danh sách khách hàng ({totalElement})</CardTitle>
                  <CardDescription>
                    Quản lý tất cả khách hàng trong hệ thống
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
                      {customers.map((customer) => (
                        <TableRow
                          key={customer.id}
                          onClick={() => handleRowClick(customer.id)}
                        >
                          <TableCell className="hidden sm:table-cell">
                            <div className="flex items-center justify-center">
                              <Avatar>
                                <AvatarImage
                                  src={customer.imageUrl}
                                  alt={customer.username}
                                />
                                <AvatarFallback>
                                  {customer.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-center">
                            {customer.username}
                          </TableCell>
                          <TableCell className="font-medium text-center">
                            {customer.name}
                          </TableCell>
                          <TableCell className="font-medium text-center">
                            {new Date(customer.created_at).toLocaleString()}{" "}
                            {/* Format date */}
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
                                  {customer.is_blocked ? (
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
                                    {customer.is_blocked
                                      ? "Mở khoá tài khoản"
                                      : "Khoá tài khoản"}
                                    :{customer.username}
                                  </DialogTitle>
                                  <DialogDescription>
                                    Vui lòng nhập mật khẩu trước khi thực hiện
                                    thao tác này
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="flex items-center space-x-2">
                                  <div className="grid flex-1 gap-2">
                                    <Label htmlFor="link" className="sr-only">
                                      Link
                                    </Label>
                                    <Input
                                      type={
                                        isPasswordVisible ? "text" : "password"
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
                                      setIsPasswordVisible(!isPasswordVisible)
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
                                        handleCustomerAccount(customer.id);
                                      }}
                                    >
                                      {customer.is_blocked
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
            </TabsContent>
          </Tabs>
        </main>
      </div>
      {/* DrawerUserDetail Component */}
      {isDrawerOpen && (
        <DrawerCustomerDetail
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
          userId={selectedUserId} // Truyền userId vào DrawerUserDetail
        />
      )}
    </div>
  );
}
