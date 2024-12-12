"use client";
import { useCallback, useEffect, useState } from "react";
import { ListFilter, Lock, Unlock } from "lucide-react";
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
import { Rating } from "@mui/material";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { changeStatus, getAllStore } from "@/api/admin/storeRequest";
import DrawerStoreDetail from "./drawerStoreDetail";
import { useSelector } from "react-redux";
import { Label } from "@/components/ui/label";
import DialogConfirmSecond from "@/components/dialogs/dialogConfirmSecond";
import { formatDate, roundToNearest } from "@/utils/commonUtils";

export default function ManageStores() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const { toast } = useToast();
  const [tab, setTab] = useState("active");
  const [sortType, setSortType] = useState("");
  const [totalElement, setTotalElement] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
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

  const handleRowClick = (storeId) => {
    setSelectedStoreId(storeId);
    setIsDrawerOpen(true);
  };

  const handleChangeBanned = () => {
    changeStatus(selectedStoreId)
      .then((res) => {
        toast({
          title: "Thành công",
          description: "Thay đổi trạng thái cửa hàng thành công",
          variant: "success",
        });
        setConfirmDialogOpen(false);
        fetchStore();
      })
      .catch((error) => {
        toast({
          title: "Thất bại",
          description: error.message,
          variant: "destructive",
        });
      });
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedStoreId(null);
  };

  const handleSortChange = (type) => {
    setSortType(sortType === type ? "" : type);
  };

  const fetchStore = useCallback(async () => {
    try {
      const response = await getAllStore(
        currentPage,
        tab,
        sortType,
        searchTerm
      );
      setStores(response.result.data);
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
    fetchStore();
  }, [fetchStore, totalPage, totalElement]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Toaster />
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="active">
            <div className="flex items-center">
              <TabsList>
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
                  <CardTitle>Danh sách cửa hàng ({totalElement})</CardTitle>
                  <CardDescription>
                    Quản lý tất cả cửa hàng trong hệ thống
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tên cửa hàng</TableHead>
                        <TableHead>Người dùng</TableHead>
                        <TableHead>Ngày tạo</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Đánh giá
                        </TableHead>
                        <TableHead>
                          <span className="sr-only">Hành động</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stores.map((store) => (
                        <TableRow
                          key={store.id}
                          onClick={() => handleRowClick(store.id)}
                        >
                          <TableCell className="font-medium text-center">
                            {store.name}
                          </TableCell>
                          <TableCell className="font-medium text-center">
                            {store.username}
                          </TableCell>
                          <TableCell className="font-medium text-center">
                            {formatDate(store.created_at)}
                          </TableCell>
                          <TableCell className="flex items-center space-x-2 justify-center border-none">
                            <Rating
                              value={
                                store?.rating
                                  ? roundToNearest(store?.rating, 1)
                                  : 0
                              }
                              precision={0.1}
                              readOnly
                            />
                            <Label>
                              (
                              {store?.rating
                                ? roundToNearest(store?.rating, 1)
                                : 0}
                              )
                            </Label>
                          </TableCell>

                          <TableCell className="hidden md:table-cell text-center">
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedStoreId(store.id);
                                setConfirmDialogOpen(true);
                              }}
                            >
                              {tab === "active" ? (
                                <>
                                  <Lock className="h-4 w-4" />
                                  <span className="sr-only">
                                    Khoá tài khoản
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Unlock className="h-4 w-4" />
                                  <span className="sr-only">
                                    Khoá tài khoản
                                  </span>
                                </>
                              )}
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
                    hasNext={hasNext}
                    hasPrevious={hasPrevious}
                  />
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      {/* DrawerStoreDetail Component */}
      {isDrawerOpen && (
        <DrawerStoreDetail
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
          storeId={selectedStoreId}
        />
      )}
      <DialogConfirmSecond
        isOpen={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleChangeBanned}
        title={`Xác nhận ${tab === "active" ? "khóa" : "mở khóa"} cửa hàng`}
        content={`Bạn có chắc chắn muốn ${
          tab === "active" ? "khóa" : "mở khóa"
        } cửa hàng này không?`}
      />
    </div>
  );
}
