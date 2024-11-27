"use client";

import { getAllCart } from "@/api/cart/cartRequest";
import { PaginationAdminTable } from "@/components/paginations/pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Checkbox, Rating } from "@mui/material";
import {
  ArrowDown,
  ArrowUp,
  BriefcaseBusiness,
  PiggyBank,
  Search,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export default function ManageCartUser() {
  const [carts, setCarts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalElement, setTotalElement] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [isOpenArrow, setIsOpenArrow] = useState({});
  const [isOpenVariant, setIsOpenVariant] = useState({});
  const dropdownRef = useRef(null);
  const { toast } = useToast();

  const handleNextPage = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const toggleArrow = (index) => {
    setIsOpenArrow((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
    setIsOpenVariant((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const fetchAllCart = useCallback(async () => {
    try {
      const response = await getAllCart(currentPage);
      console.log("Carts: ", response.result.data);
      setCarts(response.result.data);
      setTotalPage(response.result.totalPages);
      setTotalElement(response.result.totalElements);
      setHasNext(response.result.hasNext);
      setHasPrevious(response.result.hasPrevious);
    } catch (error) {
      toast({
        title: "Thất bại",
        description:
          error.message === "Unauthenticated"
            ? "Phiên làm việc hết hạn. Vui lòng đăng nhập lại!!!"
            : error.message,
        variant: "destructive",
      });
    }
  }, [toast, currentPage]);

  useEffect(() => {
    fetchAllCart();
  }, [fetchAllCart, totalPage, totalElement]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpenVariant(false);
        setIsOpenArrow(true);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpenVariant, isOpenArrow]);

  function formatCurrency(value) {
    return Number(value).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-muted/4 bg-blue-primary space-y-4">
      <div className="h-[80px] flex items-center justify-between bg-white-primary border-b-2">
        <div className="flex items-center space-x-2 ml-4">
          <div className="flex items-center space-x-1">
            <BriefcaseBusiness />
            <Label>HKK</Label>
          </div>
          <div className="w-[1px] h-4 bg-black-primary"></div>
          <div>
            <Label>Giỏ Hàng</Label>
          </div>
        </div>
        <div className="w-1/2 flex items-center space-x-2 mr-4">
          <Input placeholder="Tìm kiếm giỏ hàng" />
          <Search className="hover:cursor-pointer" />
        </div>
      </div>
      <div className="flex items-center justify-between bg-white-primary m-4">
        <div className="w-1/2 flex items-center">
          <Checkbox className="w-1/6" />
          <Label className="w-5/6">Sản phẩm</Label>
        </div>
        <div className="w-1/2 flex items-center justify-between">
          <div className="w-1/4 flex items-center justify-center">
            <Label>Đơn giá</Label>
          </div>
          <div className="w-1/4 flex items-center justify-center">
            <Label>Số lượng</Label>
          </div>
          <div className="w-1/4 flex items-center justify-center">
            <Label>Số tiền</Label>
          </div>
          <div className="w-1/4 flex items-center justify-center">
            <Label>Thao tác</Label>
          </div>
        </div>
      </div>
      <div className="m-4 space-y-4">
        {carts.length > 0 ? (
          carts.map((cart, index) => (
            <Card key={index} className="rounded-none">
              <CardTitle className="flex items-center mt-4 mb-4">
                <Checkbox className="w-1/12" />
                <div className="w-11/12 flex items-center space-x-2">
                  <Image
                    alt="avatar store"
                    src={cart.avatarStore}
                    height={30}
                    width={30}
                    unoptimized={true}
                    className="rounded-full transition-transform duration-300"
                  />
                  <Label className="text-xl">{cart.storeName}</Label>
                  <Rating
                    value={cart.ratingStore}
                    precision={0.1}
                    readOnly
                  ></Rating>
                </div>
              </CardTitle>
              <CardContent className="w-full flex flex-col items-center min-h-[150px] border-t-2 border-b-2 pr-0 pl-0 pt-4 pb-4">
                {cart.items && cart.items.length > 0 ? (
                  cart.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="w-full flex items-center border m-4"
                    >
                      <div className="w-1/2 flex items-center">
                        <Checkbox className="w-1/6" />
                        <div className="w-5/6 flex items-center">
                          <div className="w-2/3 flex items-center space-x-4">
                            <Image
                              alt="ảnh sản phẩm"
                              src={item.image}
                              height={125}
                              width={125}
                              className="mt-4 mb-4"
                            />
                            <div className="flex-1 min-w-0 space-y-4">
                              <Label className="line-clamp-2 text-xl">
                                {item.name}
                              </Label>
                              <div className="flex items-center truncate space-x-2">
                                <Image
                                  alt="logo thương hiệu"
                                  src={item.logoBrand}
                                  height={30}
                                  width={30}
                                  unoptimized={true}
                                />
                                <Label>{item.brand}</Label>
                              </div>
                            </div>
                          </div>
                          <div
                            ref={dropdownRef}
                            className="w-1/3 flex flex-col relative"
                          >
                            <Button
                              variant="outline"
                              className="w-full h-full flex flex-col items-start truncate"
                              onClick={() => toggleArrow(index)}
                            >
                              <div className="flex items-center space-x-1">
                                <Label className="hover:cursor-pointer">
                                  Phân loại hàng:
                                </Label>
                                {!isOpenArrow[index] && (
                                  <ArrowDown className="hover:cursor-pointer" />
                                )}
                                {isOpenArrow[index] && (
                                  <ArrowUp className="hover:cursor-pointer" />
                                )}
                              </div>
                              <Label className="hover:cursor-pointer">
                                {item.value.join(" | ")}
                              </Label>
                            </Button>
                            {isOpenVariant[index] && (
                              <div className="bg-yellow-primary flex flex-col absolute w-[calc(100%+200px)] left-[-100px] top-[70px] z-10">
                                <div className="flex items-center justify-center">
                                  <div className="">mũi tên</div>
                                </div>
                                <div className="w-full flex flex-wrap items-center justify-start p-4 space-x-4">
                                  <Label className="mb-4 overflow-hidden whitespace-nowrap text-ellipsis">
                                    Màu sắc:
                                  </Label>
                                  <Label className="border border-black-tertiary p-2 mb-4 overflow-hidden whitespace-nowrap text-ellipsis hover:cursor-pointer hover:border-red-primary hover:text-red-primary">
                                    1TB - GOLD
                                  </Label>
                                  <Label className="border border-black-tertiary p-2 mb-4 overflow-hidden whitespace-nowrap text-ellipsis hover:cursor-pointer hover:border-red-primary hover:text-red-primary">
                                    512GB - GOLD
                                  </Label>
                                  <Label className="border border-black-tertiary p-2 mb-4 overflow-hidden whitespace-nowrap text-ellipsis hover:cursor-pointer hover:border-red-primary hover:text-red-primary">
                                    1TB - BLACK
                                  </Label>
                                  <Label className="border border-black-tertiary p-2 mb-4 overflow-hidden whitespace-nowrap text-ellipsis hover:cursor-pointer hover:border-red-primary hover:text-red-primary">
                                    512GB - BLACK
                                  </Label>
                                  <Label className="border border-black-tertiary p-2 mb-4 overflow-hidden whitespace-nowrap text-ellipsis hover:cursor-pointer hover:border-red-primary hover:text-red-primary">
                                    512GB - BLACK
                                  </Label>
                                </div>
                                <div className="flex items-center justify-center space-x-6 pb-4">
                                  <Button variant="outline" className="w-1/3">
                                    Trở lại
                                  </Button>
                                  <Button variant="outline" className="w-1/3">
                                    Xác nhận
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="w-1/2 flex items-center justify-between">
                        <div className="w-1/4 flex items-center justify-center space-x-2">
                          <Label className="line-through">
                            {formatCurrency(item.originalPrice)}
                          </Label>
                          <Label>{formatCurrency(item.salePrice)}</Label>
                        </div>
                        <div className="w-1/4 flex items-center justify-center">
                          <div className="flex items-center justify-center border border-black-primary">
                            <Button
                              variant="outline"
                              className="text-2xl text-center"
                            >
                              -
                            </Button>
                          </div>
                          <div className="min-w-14 h-10 flex items-center justify-center border border-black-primary">
                            <Label className="text-xl">{item.quantity}</Label>
                          </div>
                          <div className="flex items-center justify-center border border-black-primary">
                            <Button
                              variant="outline"
                              className="text-2xl text-center"
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        <div className="w-1/4 flex items-center justify-center">
                          <Label>
                            {formatCurrency(item.quantity * item.salePrice)}
                          </Label>
                        </div>
                        <div className="w-1/4 flex items-center justify-center">
                          <Button variant="outline">Xóa</Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <Label className="text-2xl text-center">
                    Không có sản phẩm
                  </Label>
                )}
              </CardContent>
              <CardFooter className="mt-6 mb-6 p-0">
                <PiggyBank className="w-1/12" />
                {cart.items && cart.items.length > 0
                  ? cart.items.map((item, index) => (
                      <div
                        key={index}
                        className="w-11/12 flex items-center space-x-2"
                      >
                        <Label>Tiết kiệm ngay</Label>
                        <Label className="text-xl font-bold">
                          {formatCurrency(item.originalPrice - item.salePrice)}
                        </Label>
                      </div>
                    ))
                  : ""}
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="flex items-center justify-center">
            <Label className="text-2xl text-center">Giỏ hàng trống</Label>
          </div>
        )}

        <PaginationAdminTable
          currentPage={currentPage}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
          totalPage={totalPage}
          setCurrentPage={setCurrentPage}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
        ></PaginationAdminTable>
      </div>
      <div className="flex items-center justify-between bg-white-primary min-h-[80px] m-4 sticky bottom-0 border-t-2 ">
        <Checkbox className="w-1/12" />
        <div className="w-11/12 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline">Chọn tất cả (3)</Button>
            <Button variant="outline">Xóa</Button>
          </div>
          <Button variant="outline">Bỏ sản phẩm không hoạt động</Button>
          <div className="flex items-center space-x-4">
            <Label>Tổng sản phẩm (0 sản phẩm):</Label>
            <Label className="text-2xl font-bold">0 đ</Label>
          </div>
          <Button variant="outline" className="w-1/6 mr-10">
            Mua hàng
          </Button>
        </div>
      </div>
    </div>
  );
}
