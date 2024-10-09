"use client";
import Image from "next/image";
import { File, ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";

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
  DropdownMenuItem,
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
import DialogAddEditBrand from "@/app/[locale]/admin/brands/dialogAddEditBrand";
import { PaginationAdminTable } from "@/components/paginations/pagination";
import { useEffect, useState } from "react";
import axios from "@/configs/axiosConfig";

export const description =
  "An products dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. It displays a list of products in a table with actions.";

export default function ManageBrand() {
  const [brands, setBrands] = useState([]);

  const getAllBrands = async () => {
    const config = {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3Q6ODA4MCIsInN1YiI6IkFETUlOIiwiZXhwIjoxNzI4NDQzOTMzLCJpYXQiOjE3Mjg0NDAzMzMsImp0aSI6ImJjNGI5YjdmLTkyY2UtNDg1OS05NDA1LTMyYTQxNWU1OWJiNyIsInNjb3BlIjoiUk9MRV9BRE1JTiJ9.evsiNK6QliUgEOxrCJlJ-XMYoCdXD3HZWgLwdeDCV-dYVTCqZHT4csJJE7BDz40N5LpZUzTjwLGYSaJaW44Xrw`,
      },
    };
    try {
      const response = await axios.get(`/api/v1/brands`, config);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch brands:", error);
      throw error;
    }
  };

  const deleteBrand = async (id) => {
    const config = {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3Q6ODA4MCIsInN1YiI6IkFETUlOIiwiZXhwIjoxNzI4NDQzNjk2LCJpYXQiOjE3Mjg0NDAwOTYsImp0aSI6ImI0MWRhMTAzLTcyMmMtNDc1YS1hMzE3LTM3MWIxY2IxY2JjYyIsInNjb3BlIjoiUk9MRV9BRE1JTiJ9.Mu6uZh3SsQkunu_S0ivRrxMF7eRPWd1nJNbJt4KlgH6rIBQ_zjYRaiLPLfBjP7G-x_uc95MZubIhV4-0DLrYYw`,
      },
    };
    try {
      await axios.delete(`/api/v1/brands/${id}`, config);
      setBrands((prevBrands) => prevBrands.filter((brand) => brand.id !== id));
    } catch (error) {
      console.error("Failed to delete brand:", error);
    }
  };

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await getAllBrands();
        console.log(response);
        const brandData =
          response.result && Array.isArray(response.result.data)
            ? response.result.data
            : [];
        setBrands(brandData);
      } catch (error) {
        console.error("Failed to fetch brands:", error);
        setBrands([]);
      }
    };

    fetchBrands();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="all">Tất cả</TabsTrigger>
                <TabsTrigger value="active">Hoạt động</TabsTrigger>
                <TabsTrigger value="draft">Đã xóa</TabsTrigger>
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
                    <DropdownMenuCheckboxItem checked>
                      Name
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Description
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      CreatedAt
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button size="sm" variant="outline" className="h-7 gap-1">
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Xuất
                  </span>
                </Button>
                <DialogAddEditBrand title="Thêm thương hiệu" />
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Thương hiệu</CardTitle>
                  <CardDescription>Quản lý các thương hiệu</CardDescription>
                </CardHeader>
                <CardContent>
                  {brands.length === 0 ? (
                    <div className="py-10 text-center text-xl text-muted-foreground">
                      Không có thương hiệu nào
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="hidden w-[100px] sm:table-cell">
                            <span className="sr-only">Image</span>
                          </TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Created at</TableHead>
                          <TableHead>Last updated at</TableHead>
                          <TableHead>
                            <span className="sr-only">Actions</span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {brands.map((brand) => (
                          <TableRow key={brand.id}>
                            <TableCell className="hidden sm:table-cell">
                              <Image
                                alt="Brand image"
                                className="aspect-square rounded-md object-cover"
                                height={64}
                                src={
                                  brand.logoUrl
                                    ? brand.logoUrl
                                    : "/placeholder.svg"
                                }
                                width={64}
                                unoptimized
                                priority
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              {brand.name}
                            </TableCell>
                            <TableCell className="font-medium">
                              {brand.description}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {new Date(brand.createdAt).toLocaleString()}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {new Date(brand.lastUpdatedAt).toLocaleString()}
                            </TableCell>
                            <TableCell>
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
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                  >
                                    <DialogAddEditBrand
                                      title="Chỉnh sửa thương hiệu"
                                      edit={true}
                                      id={brand.id}
                                      brand={{
                                        name: brand.name,
                                        description: brand.description,
                                      }}
                                    />
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onSelect={() => deleteBrand(brand.id)}
                                  >
                                    Xóa
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
                <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    Hiển thị <strong>{brands.length}</strong> thương hiệu
                  </div>
                  <PaginationAdminTable />
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
