"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  CircleOff,
  Eye,
  ListFilter,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  deleteProduct,
  getProducts,
  updateProductStatus,
} from "@/api/vendor/productRequest";
import { formatCurrency, formatDate } from "@/utils";
import ReviewEmpty from "@/assets/images/ReviewEmpty.png";

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
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";
import { PaginationAdminTable } from "@/components/paginations/pagination";
import { ProductUpdateDialog } from "@/app/[locale]/vendor/products/_update/productUpdateDialog";
import Loading from "@/components/loading";
import { useTranslations } from "next-intl";

const FilterSortDropdown = ({
  order,
  sortBy,
  handleOrderChange,
  handleSortChange,
  t,
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" className="gap-2">
        <ListFilter className="h-5 w-5" />
        <span className="text-[1em]">{t("sort")}</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-[170px]">
      <DropdownMenuLabel>{t("sort")}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuRadioGroup value={order} onValueChange={handleOrderChange}>
        <DropdownMenuRadioItem value="asc">
          {t("increasing")}
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="desc">
          {t("descreasing")}
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
      <DropdownMenuSeparator />
      <DropdownMenuRadioGroup value={sortBy} onValueChange={handleSortChange}>
        <DropdownMenuRadioItem value="name">{t("name")}</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="salePrice">
          {t("selling_price")}
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="orignalPrice">
          {t("original_price")}
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="Rating">
          {t("evaluate")}
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="createdAt">
          {t("created_at")}
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={() => {
          handleSortChange("");
          handleOrderChange("");
        }}
      >
        {t("unsort")}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const ProductActionsMenu = ({
  product,
  tab,
  handleHideProduct,
  handleDeleteProduct,
  openUpdateDialog,
  t,
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button aria-haspopup="true" size="icon">
        <MoreHorizontal className="h-5 w-5" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>{t("action")}</DropdownMenuLabel>
      <DropdownMenuSeparator />

      {tab !== "blocked" && (
        <>
          <DropdownMenuItem
            className="flex flex-row justify-between items-center cursor-pointer"
            onClick={() => handleHideProduct(product.id)}
          >
            {tab === "available" ? (
              <>
                <span>{t("hidden")}</span>
                <CircleOff className="h-4 w-4" />
              </>
            ) : (
              <>
                <span>{t("show")}</span>
                <Eye className="h-4 w-4" />
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </>
      )}

      <DropdownMenuItem
        className="flex flex-row justify-between items-center cursor-pointer"
        onClick={() => handleDeleteProduct(product.id)}
      >
        <span>{t("delete")}</span>
        <Trash2 className="h-4 w-4" />
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        className="flex flex-row justify-between items-center cursor-pointer"
        onClick={() => openUpdateDialog(product.id)}
      >
        <span>{t("update")}</span>
        <Pencil className="h-4 w-4" />
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const ProductsTable = ({
  products,
  currentPage,
  tab,
  handleHideProduct,
  handleDeleteProduct,
  openUpdateDialog,
  t,
}) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead></TableHead>
        <TableHead>{t("image")}</TableHead>
        <TableHead>{t("name")}</TableHead>
        <TableHead>{t("quantity")}</TableHead>
        <TableHead>{t("selling_price")}</TableHead>
        <TableHead>{t("original_price")}</TableHead>
        <TableHead>{t("evaluate")}</TableHead>
        <TableHead>{t("action")}</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody className="text-[1em]">
      {products.map((product, index) => (
        <TableRow key={product.id}>
          <TableCell className="text-center">
            {index + 1 + (currentPage - 1) * 10}
          </TableCell>
          <TableCell className="flex justify-center items-center border-none">
            <Image
              className="rounded-full aspect-square object-cover border shadow-md"
              src={product.mainImageUrl}
              width={70}
              height={70}
              alt="Product Image"
            />
          </TableCell>
          <TableCell>{product.name}</TableCell>
          <TableCell className="text-center">{product.quantity}</TableCell>
          <TableCell className="text-center">
            {formatCurrency(product.salePrice)}
          </TableCell>
          <TableCell className="text-center">
            {formatDate(product.createdAt)}
          </TableCell>
          <TableCell className="text-center">{product.rating || 0}</TableCell>
          <TableCell className="text-center">
            <ProductActionsMenu
              product={product}
              tab={tab}
              handleHideProduct={handleHideProduct}
              handleDeleteProduct={handleDeleteProduct}
              openUpdateDialog={openUpdateDialog}
              t={t}
            />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const EmptyState = () => (
  <Image
    alt="Review Empty"
    className="mx-auto my-10"
    src={ReviewEmpty}
    width={400}
    height={400}
  />
);

export default function ManageComponent() {
  const [products, setProducts] = useState([]);
  const [productSelected, setProductSelected] = useState(null);
  const [isDialogUpdateOpen, setIsDialogUpdateOpen] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [updated, setUpdated] = useState(false);

  const [tab, setTab] = useState("available");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalElement, setTotalElement] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const t = useTranslations("Vendor.product");

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handleOrderChange = (value) => {
    setOrder(value);
  };

  const handleHideProduct = async (id) => {
    try {
      await updateProductStatus(id);
      toast({
        title: t("notify"),
        description: t("show_hidden_success", {
          action: tab === "available" ? t("hidden") : t("show"),
        }),
      });
      setUpdated(true);
    } catch (error) {
      toast({
        title: t("notify"),
        variant: "destructive",
        description: t("show_hidden_fail", {
          action: tab === "available" ? t("hidden") : t("show"),
          error: error.message,
        }),
      });
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      toast({
        title: t("notify"),
        description: t("delete_success"),
      });
      setUpdated(true);
    } catch (error) {
      toast({
        title: t("notify"),
        variant: "destructive",
        description: t("delete_fail"),
      });
    }
  };

  const openUpdateDialog = (id) => {
    setProductSelected(id);
    setIsDialogUpdateOpen(true);
  };

  const loadProducts = async (page, sortBy, order, tab, search) => {
    setIsTableLoading(true);
    try {
      const response = await getProducts(page, sortBy, order, tab, search);
      const data = response.result;

      setProducts(data.data);
      setTotalElement(data.totalElements);
      setTotalPage(data.totalPages);
      setCurrentPage(data.currentPage);
      setHasNext(data.hasNext);
      setHasPrevious(data.hasPrevious);
    } catch (error) {
      toast({
        title: t("notify"),
        variant: "destructive",
        description: t("can_not_load_list_product", { error: error.message }),
      });
    } finally {
      setIsTableLoading(false);
    }
  };

  useEffect(() => {
    setProductSelected(null);
    loadProducts(currentPage, sortBy, order, tab, search);
    setUpdated(false);
  }, [tab, sortBy, order, search, currentPage, updated]);

  return (
    <div className="flex min-h-screen w-full min-w-[1200px] flex-col pt-[70px]">
      <Toaster />
      <div className="flex items-start p-3">
        <Tabs defaultValue="available" value={tab} className="w-full h-fit">
          <div className="flex items-center">
            <TabsList className="shadow-md rounded-md">
              <TabsTrigger
                className="min-w-28"
                value="available"
                onClick={() => setTab("available")}
              >
                <span>{t("public")}</span>
              </TabsTrigger>
              <TabsTrigger
                className="min-w-28"
                value="unAvailable"
                onClick={() => setTab("unAvailable")}
              >
                <span>{t("hidden")}</span>
              </TabsTrigger>
              <TabsTrigger
                className="min-w-28"
                value="blocked"
                onClick={() => setTab("blocked")}
              >
                <span>{t("locked")}</span>
              </TabsTrigger>
            </TabsList>

            <div className="ml-auto flex items-center gap-2">
              <FilterSortDropdown
                order={order}
                sortBy={sortBy}
                handleOrderChange={handleOrderChange}
                handleSortChange={handleSortChange}
                t={t}
              />
            </div>
          </div>

          <TabsContent value={tab}>
            <Card>
              <CardHeader>
                <CardTitle className="text-[1.3em] font-[900]">
                  {t("list_product", { total: totalElement })}
                </CardTitle>
                <div className="flex items-center justify-between">
                  <CardDescription className="text-[1em]">
                    {t("manage_all_product_of_the_store")}
                  </CardDescription>
                  <div className="w-1/3 min-w-[400px] relative">
                    <Input
                      className="pr-10 pl-5"
                      placeholder={t("find_product")}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      value={search}
                    />
                    <Search className="h-5 w-5 absolute top-1/2 -translate-y-1/2 right-3" />
                  </div>
                </div>
              </CardHeader>

              {products && products.length > 0 ? (
                <>
                  <CardContent>
                    {isTableLoading ? (
                      <div className="flex justify-center items-center py-8">
                        <Loading />
                      </div>
                    ) : (
                      <ProductsTable
                        products={products}
                        currentPage={currentPage}
                        tab={tab}
                        handleHideProduct={handleHideProduct}
                        handleDeleteProduct={handleDeleteProduct}
                        openUpdateDialog={openUpdateDialog}
                        t={t}
                      />
                    )}
                    <ProductUpdateDialog
                      productId={productSelected}
                      isOpen={isDialogUpdateOpen}
                      onClose={() => setIsDialogUpdateOpen(false)}
                      setUpdated={setUpdated}
                    />
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
                </>
              ) : (
                <EmptyState />
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
