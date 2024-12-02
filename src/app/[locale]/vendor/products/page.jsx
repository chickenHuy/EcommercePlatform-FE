"use client";
import {
  CircleOff,
  DeleteIcon,
  Eye,
  File,
  ListFilter,
  MoreHorizontal,
} from "lucide-react";
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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSubContent,
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
import {
  deleteProduct,
  getProducts,
  updateProductStatus,
} from "@/api/vendor/productRequest";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, Update, UpdateSharp } from "@mui/icons-material";
import { ReloadIcon, UpdateIcon } from "@radix-ui/react-icons";
import { toast } from "@/hooks/use-toast";
export default function ManageComponent() {
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [tab, setTab] = useState("available");
  const [totalPage, setTotalPage] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("");
  const [search, setSearch] = useState("");
  const [totalElement, setTotalElement] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleOnChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleHideProduct = async (id) => {
    try {
      await updateProductStatus(id);
      toast({
        title: "Thành công",
        description:
          (tab === "available" ? "Ẩn" : "Hiện") + " sản phẩm thành công",
      });
    } catch (error) {
      toast({
        title: "Thất bại",
        description: "Ẩn sản phẩm thất bại",
      });
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      toast({
        title: "Thành công",
        description: "Xoá sản phẩm thành công",
      });
    } catch (error) {
      toast({
        title: "Thất bại",
        description: "Xoá sản phẩm thất bại",
      });
    }
  };

  const handleUpdateProduct = async (id) => {
    try {
      toast({
        title: "Thành công",
        description: "Ẩn sản phẩm thành công",
      });
    } catch (error) {
      toast({
        title: "Thất bại",
        description: "Ẩn sản phẩm thất bại",
      });
    }
  };

  const loadComponents = async (page, sortBy, order, tab, search) => {
    try {
      const response = await getProducts(page, sortBy, order, tab, search);
      const data = response.result;
      setTotalElement(data.totalElements);
      setTotalPage(data.totalPages);
      setCurrentPage(data.currentPage);
      setHasNext(data.hasNext);
      setHasPrevious(data.hasPrevious);
      setProducts(data.data);
      console.log(data.data);
    } catch (error) {
      console.error("Error during get products:", error);
    }
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handleOrderChange = (value) => {
    setOrder(value);
  };

  function formatCurrency(number) {
    const num = parseFloat(number);

    if (isNaN(num)) {
      return "";
    }

    const formattedNumber = num % 1 === 0 ? num.toFixed(0) : num.toFixed(2);
    return formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  useEffect(() => {
    loadComponents(currentPage, sortBy, order, tab, search);
  }, [
    tab,
    sortBy,
    order,
    search,
    currentPage,
    handleHideProduct,
    handleDeleteProduct,
  ]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 pt-[65px]">
      <Toaster />
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="available" value={tab}>
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger
                  value="available"
                  onClick={() => setTab("available")}
                >
                  Công khai
                </TabsTrigger>
                <TabsTrigger
                  value="unAvailable"
                  onClick={() => setTab("unAvailable")}
                >
                  Ẩn
                </TabsTrigger>
                <TabsTrigger
                  value="blocked"
                  onClick={() => setTab("blocked")}
                  className="hidden sm:flex"
                >
                  Bị khoá
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
                  <DropdownMenuContent align="end" className="w-[150px]">
                    <DropdownMenuLabel>Sắp xếp</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={order}
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
                    <DropdownMenuRadioGroup
                      value={sortBy}
                      onValueChange={(value) => handleSortChange(value)}
                    >
                      <DropdownMenuRadioItem value="name">
                        Tên
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="salePrice">
                        Giá bán
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="orignalPrice">
                        Giá gốc
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Rating">
                        Đánh giá
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="createdAt">
                        Ngày tạo
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setSortBy("");
                        setOrder("");
                      }}
                    >
                      Không sắp xếp
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <TabsContent value={tab}>
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle className="text-[18px] font-extrabold">
                    Danh sách sản phẩm ({totalElement})
                  </CardTitle>
                  <div className="flex">
                    <CardDescription className="text-black-primary font-bold text-[15px]">
                      Quản lý tất cả các sản phẩm của cửa hàng
                    </CardDescription>
                    <div className="ml-auto flex items-center gap-2">
                      <Input
                        onChange={(e) => handleOnChange(e.target.value)}
                      ></Input>
                      <Search className="h-5 w-5" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Hình ảnh</TableHead>
                        <TableHead>Tên sản phẩm</TableHead>
                        <TableHead>Số lượng</TableHead>
                        <TableHead className="hidden lg:table-cell">
                          Giá bán
                        </TableHead>
                        <TableHead className="hidden lg:table-cell">
                          Ngày tạo
                        </TableHead>
                        <TableHead className="hidden lg:table-cell">
                          Đánh giá
                        </TableHead>
                        <TableHead>Hành động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product, index) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium text-center">
                            {index + 1 + (currentPage - 1) * 10}
                          </TableCell>
                          <TableCell className="flex justify-center items-center border-none">
                            <Avatar>
                              <AvatarImage
                                src={product.mainImageUrl}
                                alt={product.name}
                              />
                              <AvatarFallback>
                                {product.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell className="font-medium">
                            {product.name}
                          </TableCell>
                          <TableCell className="font-medium text-center">
                            {product.quantity}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-center">
                            {formatCurrency(product.salePrice) + " đ"}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-center">
                            {new Date(product.createdAt).toLocaleString()}{" "}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-center">
                            {product.rating}
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
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                {tab !== "blocked" && (
                                  <>
                                    <DropdownMenuItem
                                      className="flex flex-row justify-between items-center cursor-pointer"
                                      onClick={() =>
                                        handleHideProduct(product.id)
                                      }
                                    >
                                      {tab === "available" && (
                                        <>
                                          <span> Ẩn</span>
                                          <CircleOff className="scale-75" />
                                        </>
                                      )}
                                      {tab === "unAvailable" && (
                                        <>
                                          <span> Hiện</span>
                                          <Eye className="scale-75" />
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                  </>
                                )}

                                <DropdownMenuItem
                                  className="flex flex-row justify-between items-center cursor-pointer"
                                  onClick={() =>
                                    handleDeleteProduct(product.id)
                                  }
                                >
                                  <span> Xoá</span>
                                  <DeleteIcon className="scale-75" />
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="flex flex-row justify-between items-center cursor-pointer"
                                  onClick={() =>
                                    handleUpdateProduct(product.id)
                                  }
                                >
                                  <span> Cập nhật</span>
                                  <UpdateSharp className="scale-75" />
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="relative">
                  <div className="absolute right-1/2 translate-x-1/2">
                    <PaginationAdminTable
                      currentPage={currentPage}
                      handleNextPage={handleNextPage}
                      handlePrevPage={handlePrevPage}
                      totalPage={totalPage}
                      setCurrentPage={setCurrentPage}
                      hasNext={hasNext}
                      hasPrevious={hasPrevious}
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
