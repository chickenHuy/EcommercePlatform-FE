"use client";
import Image from "next/image";
import { ChevronLeft, DeleteIcon, Package2, PlusCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { getAll, getAllCategory, getCategoryById } from "@/api/admin/categoryRequest";
import { useEffect, useState } from "react";
import { Drawer, DrawerClose, DrawerContent } from "@/components/ui/drawer";
export default function EditCategory({ isOpen, onClose, categoryId }) {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await getCategoryById(categoryId);
        setCategory(response.result);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategory();
  },[]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAll();
        setCategories(response.result);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent className="">
        <ScrollArea className="p-4 max-h-screen overflow-auto">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 h-full">
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
              <div className="flex items-center gap-4">
                <DrawerClose>
                  <Button variant="outline" size="icon" className="h-7 w-7">
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                  </Button>
                </DrawerClose>
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                  Cate Controller
                </h1>
                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                  <Button variant="outline" size="sm">
                    Huỷ bỏ
                  </Button>
                  <Button size="sm">Lưu</Button>
                </div>
              </div>
                {/* Ensure all components are rendered upfront */}
                <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                  {/* Content and cards */}
                  <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                    {/* Card details */}
                    <Card x-chunk="dashboard-07-chunk-0">
                      <CardHeader>
                        <CardTitle>Chi tiết danh mục</CardTitle>
                        <CardDescription>
                          Thông tin chi tiết về danh mục sản phẩm
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-6">
                          {/* Input and description */}
                          <div className="grid gap-3">
                            <Label htmlFor="name">Tên</Label>
                            <Input
                              id="name"
                              type="text"
                              className="w-full"
                              placeholder="Tên danh mục"
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="description">Mô tả</Label>
                            <Textarea
                              id="description"
                              placeholder="Nhập mô tả danh mục"
                              className="min-h-32"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Product components */}
                    <Card x-chunk="dashboard-07-chunk-1">
                      <CardHeader>
                        <CardTitle>Thành phần sản phẩm</CardTitle>
                        <CardDescription>
                          Sản phẩm thuộc danh mục sẽ điền thông tin về các thành
                          phần này
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[250px]">
                                Tên thành phần
                              </TableHead>
                              <TableHead>Bắt buộc nhập</TableHead>
                              <TableHead className="w-[100px]"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {/* Table data */}
                            <TableRow>
                              <TableCell className="font-semibold">
                                GGPC-001
                              </TableCell>
                              <TableCell>
                                <Badge variant="success">Có</Badge>
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" className="gap-1">
                                  <DeleteIcon className="h-3.5 w-3.5" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CardContent>
                      <CardFooter className="justify-center border-t p-4">
                        <Button size="sm" variant="ghost" className="gap-1">
                          <PlusCircle className="h-3.5 w-3.5" />
                          Thêm
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>

                  {/* Other cards */}
                  <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                    {/* Parent category selection */}
                    <Card x-chunk="dashboard-07-chunk-3">
                      <CardHeader>
                        <CardTitle>Danh mục cha</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-6">
                          <div className="grid gap-3">
                            <Select>
                              <SelectTrigger
                                id="status"
                                aria-label="Chọn danh mục cha"
                              >
                                <SelectValue placeholder="Chọn danh mục cha" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((cat) => (
                                  <SelectItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Category image */}
                    <Card
                      className="overflow-hidden"
                      x-chunk="dashboard-07-chunk-4"
                    >
                      <CardHeader>
                        <CardTitle>Hình ảnh danh mục</CardTitle>
                        <CardDescription>
                          Lựa chọn ảnh nền cho danh mục
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-2">
                          <Image
                            alt="Cate image"
                            className="aspect-square w-full rounded-md object-cover"
                            height="200"
                            src="/placeholder.svg"
                            width="200"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Category icon */}
                    <Card x-chunk="dashboard-07-chunk-5">
                      <CardHeader>
                        <CardTitle>Icon danh mục</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-2">
                          <Image
                            alt="Icon"
                            className="aspect-square w-full rounded-md object-cover"
                            height="200"
                            src="/placeholder.svg"
                            width="200"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
            </div>
          </main>
        </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
