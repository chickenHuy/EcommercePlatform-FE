"use client";

import Image from "next/image";
import { ChevronLeft, DeleteIcon, PlusCircle } from "lucide-react";
import placeholder from "@/assets/placeholder.svg";
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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  addComponentByCategoryId,
  createCategory,
  getAll,
  getCategoryBySlug,
  updateCategory,
  uploadCategoryIcon,
  uploadCategoryImage,
} from "@/api/admin/categoryRequest";
import { useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { getAllComponent } from "@/api/admin/componentRequest.js";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { CircularProgress } from "@mui/material";

const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, {
      message: "Tên danh mục phải từ 2 đến 30 ký tự",
    })
    .max(30, {
      message: "Tên danh mục phải từ 2 đến 30 ký tự",
    }),
  description: z
    .string()
    .trim()
    .max(255, {
      message: "Mô tả không được vượt quá 255 ký tự",
    })
    .nullable(),
  parentId: z.number().nullable(),
});

export default function EditCategory({ isOpen, onClose, categorySlug }) {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState([]);
  const [imageCate, setImageCate] = useState(null);
  const [imageCateUrl, setImageCateUrl] = useState(null);
  const [iconCate, setIconCate] = useState(null);
  const [iconCateUrl, setIconCateUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    const fetchCategory = async () => {
      setImageCate(null);
      setImageCateUrl(null);
      setIconCate(null);
      setIconCateUrl(null);
      try {
        if (categorySlug) {
          const response = await getCategoryBySlug(categorySlug);
          setCategory(response.result);
          setSelectedComponent(response.result.listComponent);
          reset({
            name: response.result.name,
            description: response.result.description
              ? response.result.description
              : null,
            parentId: response.result.parentId,
          });
          setIsLoading(false);
        } else {
          setCategory(null);
          setSelectedComponent([]);
          reset({
            name: "",
            description: "",
            parentId: null,
          });
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategory();
  }, [categorySlug, reset, isOpen]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAll();
        setCategories(response.result);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [onClose]);

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const response = await getAllComponent();
        setComponents(response.result);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching components:", error);
      }
    };

    fetchComponents();
  }, []);

  const handleDeleteComponent = (id) => {
    setSelectedComponent((prev) =>
      prev.filter((selectedComponent) => selectedComponent.id !== id)
    );
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      var response = null;
      if (!categorySlug) {
        response = await createCategory(data);
      } else {
        response = await updateCategory(category.id, data);
      }

      const createdId = response.result.id;

      const componentData = {
        listComponent: selectedComponent.map((component) => component.id),
      };

      await addComponentByCategoryId(createdId, componentData);

      if (imageCate) {
        await uploadCategoryImage(createdId, imageCate);
      }

      if (iconCate) {
        await uploadCategoryIcon(createdId, iconCate);
      }

      toast({
        title: "Thành công",
        description: "Danh mục đã được tạo",
        variant: "success",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Thất bại",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Thất bại",
        description: "Chỉ chấp nhận các tệp JPG hoặc PNG",
        variant: "destructive",
      });
      return;
    }

    setImageCate(file);
    setImageCateUrl(URL.createObjectURL(file));
  };

  const handleIconUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Thất bại",
        description: "Chỉ chấp nhận các tệp JPG hoặc PNG",
        variant: "destructive",
      });
      return;
    }

    setIconCate(file);
    setIconCateUrl(URL.createObjectURL(file));
  };

  return (
    <>
      {isLoading ? (
        <div className="fixed inset-0 flex flex-col justify-center items-center z-[100] space-y-4 bg-black-secondary">
          <CircularProgress />
          <p className="text-2xl text-white-primary">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <Drawer open={isOpen} onClose={onClose}>
          <DrawerTitle></DrawerTitle>
          <DrawerDescription></DrawerDescription>
          <DrawerContent>
            <ScrollArea className="p-4 max-h-screen overflow-auto pt-20">
              <div className="flex flex-col sm:gap-4 sm:py-4 h-full">
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                  <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
                    <div className="flex items-center gap-4">
                      <DrawerClose>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span className="sr-only">Back</span>
                        </Button>
                      </DrawerClose>
                      <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                        {categorySlug ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
                      </h1>
                      <div className="hidden items-center gap-2 md:ml-auto md:flex">
                        <DrawerClose>
                          <Button variant="outline" size="sm">
                            Huỷ bỏ
                          </Button>
                        </DrawerClose>
                        <Button size="sm" onClick={handleSubmit(onSubmit)}>
                          Lưu
                        </Button>
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
                                  {...register("name")}
                                  id="name"
                                  type="text"
                                  className="w-full"
                                  placeholder="Tên danh mục"
                                />
                                {errors.name && (
                                  <p className="text-error text-sm">
                                    {errors.name.message}
                                  </p>
                                )}
                              </div>
                              <div className="grid gap-3">
                                <Label htmlFor="description">Mô tả</Label>
                                <Textarea
                                  id="description"
                                  placeholder="Nhập mô tả danh mục"
                                  className="min-h-32"
                                  defaultValue=""
                                  {...register("description")}
                                />
                                {errors.description && (
                                  <p className="text-error text-sm">
                                    {errors.description.message}
                                  </p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Cate components */}
                        <Card x-chunk="dashboard-07-chunk-1">
                          <CardHeader>
                            <CardTitle>Thành phần sản phẩm</CardTitle>
                            <CardDescription>
                              Sản phẩm thuộc danh mục sẽ điền thông tin về các
                              thành phần này
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
                                {selectedComponent.map((component) => (
                                  <TableRow key={component.id}>
                                    <TableCell className="font-semibold">
                                      {component.name}
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant="success">
                                        {component.required ? "Có" : "Không"}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <Button
                                        variant="ghost"
                                        className="gap-1"
                                        onClick={() =>
                                          handleDeleteComponent(component.id)
                                        }
                                      >
                                        <DeleteIcon className="h-3.5 w-3.5" />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </CardContent>
                          <CardFooter className="justify-center border-t p-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="gap-1"
                                >
                                  <PlusCircle className="h-3.5 w-3.5" />
                                  Thêm
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="overflow-y-auto max-h-60"
                              >
                                <DropdownMenuLabel>
                                  Danh sách thông số
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {components.map((component) => (
                                  <DropdownMenuCheckboxItem
                                    key={component.id}
                                    checked={
                                      selectedComponent
                                        ? selectedComponent.some(
                                            (selected) =>
                                              selected.id === component.id
                                          )
                                        : false
                                    }
                                    onCheckedChange={(isChecked) => {
                                      if (isChecked) {
                                        setSelectedComponent((prev) => [
                                          ...prev,
                                          component,
                                        ]);
                                      } else {
                                        setSelectedComponent((prev) =>
                                          prev.filter(
                                            (selected) =>
                                              selected.id !== component.id
                                          )
                                        );
                                      }
                                    }}
                                  >
                                    {component.name}
                                  </DropdownMenuCheckboxItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </CardFooter>
                        </Card>
                      </div>

                      <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                        {/* Parent category selection */}
                        <Card x-chunk="dashboard-07-chunk-3">
                          <CardHeader>
                            <CardTitle>Danh mục cha</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid gap-6">
                              <div className="grid gap-3">
                                <Select
                                  {...register("parentId")}
                                  onValueChange={(value) =>
                                    setValue("parentId", value)
                                  }
                                  value={watch("parentId")}
                                >
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
                                {errors.parentId && (
                                  <p className="text-error text-sm">
                                    {errors.parentId.message}
                                  </p>
                                )}
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
                              <label
                                htmlFor="categoryImageUpload"
                                className="cursor-pointer"
                              >
                                <Image
                                  alt="Cate image"
                                  className="aspect-square w-full rounded-md object-cover"
                                  height="200"
                                  src={
                                    imageCate
                                      ? imageCateUrl
                                      : categorySlug
                                      ? category?.imageUrl || placeholder
                                      : placeholder
                                  }
                                  width="200"
                                />
                                <input
                                  type="file"
                                  id="categoryImageUpload"
                                  accept="image/jpeg, image/png"
                                  style={{ display: "none" }}
                                  onChange={(e) => handleImageUpload(e)}
                                />
                              </label>
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
                              <label
                                htmlFor="categoryIconUpload"
                                className="cursor-pointer"
                              >
                                <Image
                                  alt="Icon Cate"
                                  className="aspect-square w-full rounded-md object-cover"
                                  height="200"
                                  src={
                                    iconCate
                                      ? iconCateUrl
                                      : categorySlug
                                      ? category?.iconUrl || placeholder
                                      : placeholder
                                  }
                                  width="200"
                                />
                                <input
                                  type="file"
                                  id="categoryIconUpload"
                                  accept="image/jpeg, image/png"
                                  style={{ display: "none" }}
                                  onChange={(e) => handleIconUpload(e)}
                                />
                              </label>
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
      )}
    </>
  );
}
