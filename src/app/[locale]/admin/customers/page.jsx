"use client";
import { useEffect, useState } from "react";
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
import DrawerUserDetail from "./drawerUserDetail";
import { getAllUser } from "@/api/admin/customerRequest";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

export default function ManageCustomer() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [users, setUsers] = useState([]); // State for user data
  const [selectedUserId, setSelectedUserId] = useState(null); // State for selected user ID
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const { toast } = useToast();
  const [tab, setTab] = useState("all");
  const [sortDate, setSortDate] = useState("");
  const [sortName, setSortName] = useState("");
  const [totalElement, setTotalElement] = useState(0);

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

  const handleRowClick = (userId) => {
    setSelectedUserId(userId);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedUserId(null);
    console.log("Close Drawer");
  };

  const handleSortDate = (sort) => {
    if (sortDate === sort) {
      setSortDate("");
    } else {
      setSortDate(sort);
    }
  };

  const handleSortName = (sort) => {
    if (sortName === sort) {
      setSortName("");
    } else {
      setSortName(sort);
    }
  };

  useEffect(() => {
    fetchData();
  }, [totalPage, currentPage, totalElement, tab, sortDate, sortName]);

  const fetchData = async () => {
    try {
      const response = await getAllUser(currentPage, tab, sortDate, sortName); // Assuming this returns a promise
      setUsers(response.result.data); // Set the user data to state
      setTotalPage(response.result.totalPages);
      setTotalElement(response.result.totalElements);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Thất bại",
        description:
          error.message === "Unauthenticated"
            ? "Phiên làm việc hết hạn. Vui lòng đăng nhập lại!!!"
            : error.message,
        variant: "destructive",
      });
    }
  };

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
                        Lọc
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Lọc bởi</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      onClick={() => handleSortDate("newest")}
                      checked={sortDate === "newest" ? true : false}
                    >
                      Mới nhất
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      onClick={() => handleSortName("az")}
                      checked={sortName === "az" ? true : false}
                    >
                      {" "}
                      A - Z
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      onClick={() => handleSortDate("oldest")}
                      checked={sortDate === "oldest" ? true : false}
                    >
                      Lâu nhất
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      onClick={() => handleSortName("za")}
                      checked={sortName === "za" ? true : false}
                    >
                      {" "}
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
              </div>
            </div>
            <TabsContent value={tab}>
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Danh sách người dùng ({totalElement})</CardTitle>
                  <CardDescription>
                    Quản lý tất cả người dùng trong hệ thống
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
                        <TableHead></TableHead>
                        <TableHead className="hidden md:table-cell">
                          <span className="sr-only">Hành động</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow
                          key={user.id}
                          onClick={() => handleRowClick(user.id)}
                        >
                          <TableCell className="hidden sm:table-cell">
                            <Avatar>
                              <AvatarImage
                                src={user.imageUrl}
                                alt={user.username}
                              />
                              <AvatarFallback>
                                {user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell className="font-medium">
                            {user.username}
                          </TableCell>
                          <TableCell className="font-medium">
                            {user.name}
                          </TableCell>
                          <TableCell className="font-medium">
                            {new Date(user.created_at).toLocaleString()}{" "}
                            {/* Format date */}
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
      {/* DrawerUserDetail Component */}
      {isDrawerOpen && (
        <DrawerUserDetail
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
          userId={selectedUserId} // Truyền userId vào DrawerUserDetail
        />
      )}
    </div>
  );
}
