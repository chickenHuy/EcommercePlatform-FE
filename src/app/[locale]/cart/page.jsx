"use client";

import {
  changeQuantity,
  deleteCartItem,
  getAllCart,
} from "@/api/cart/cartRequest";
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
  Minus,
  PiggyBank,
  Plus,
  Search,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import storeEmpty from "@/assets/images/storeEmpty.jpg";
import { Toaster } from "@/components/ui/toaster";
import DialogConfirmDeleteCartItem from "./dialogConfirmDeleteCartItem";

export default function ManageCartUser() {
  const [carts, setCarts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalElement, setTotalElement] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [isOpenArrow, setIsOpenArrow] = useState(true);
  const [isOpenVariant, setIsVariant] = useState(false);
  const [isOpenDialogConfirm, setIsOpenDialogConfirm] = useState(false);
  const [cartItemToDelete, setCartItemToDelete] = useState(null);
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
  const toggleArrow = () => {
    setIsOpenArrow(!isOpenArrow);
    setIsVariant(!isOpenVariant);
  };

  const handleQuantityChange = async (cartItemId, quantityUpdate) => {
    try {
      await changeQuantity(cartItemId, quantityUpdate);
      console.log("quantityUpdate: ", quantityUpdate);
      toast({
        title: "Thành công",
        description: `Bạn đã cập nhật số lượng thành công`,
      });
      updateCartQuantityUI(cartItemId, quantityUpdate);
    } catch (error) {
      toast({
        title: "Thất bại",
        description: error.message,
      });
    }
  };

  const updateCartQuantityUI = (cartItemId, quantityUpdate) => {
    setCarts((prevCarts) => {
      return prevCarts.map((cart) => ({
        ...cart,
        items: cart.items.map((item) => {
          if (item.id === cartItemId) {
            return { ...item, quantity: quantityUpdate };
          }
          return item;
        }),
      }));
    });
  };

  const handleOnClickButtonMinus = (item) => {
    const quantityUpdate = item.quantity - 1;
    if (quantityUpdate === 0) {
      setCartItemToDelete(item);
      setIsOpenDialogConfirm(true);
    } else {
      handleQuantityChange(item.id, quantityUpdate);
    }
  };

  const handleOnClickButtonPlus = (item) => {
    const quantityUpdate = item.quantity + 1;
    handleQuantityChange(item.id, quantityUpdate);
  };

  const handleDeleteCartItem = async () => {
    if (cartItemToDelete) {
      try {
        await deleteCartItem(cartItemToDelete.id);
        toast({
          title: "Thành công",
          description: `Bạn đã xóa sản phẩm ${cartItemToDelete.name} khỏi giỏ hàng thành công`,
        });
        setIsOpenDialogConfirm(false);
        fetchAllCart();
      } catch (error) {
        toast({
          title: "Thất bại",
          description: error.message,
        });
      }
    }
  };

  const handleOnclickButtonDeleteCartItem = (cartItem) => {
    setIsOpenDialogConfirm(true);
    setCartItemToDelete(cartItem);
  };

  const fetchAllCart = useCallback(async () => {
    try {
      const response = await getAllCart(currentPage);
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

  const calculateTotalSavings = (cartItems) => {
    return cartItems.reduce((totalSavings, item) => {
      const savings = item.quantity * (item.originalPrice - item.salePrice);
      return totalSavings + savings;
    }, 0);
  };

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
      <Toaster />
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
                    src={cart.avatarStore || storeEmpty}
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
                  cart.items.map((item) => (
                    <div
                      key={item.id}
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
                          <div className="w-1/3 flex flex-col relative">
                            <Button
                              variant="outline"
                              className="w-full h-full flex flex-col items-start truncate"
                              onClick={toggleArrow}
                            >
                              <div className="flex items-center space-x-1">
                                <Label className="hover:cursor-pointer">
                                  Phân loại hàng:
                                </Label>
                                {isOpenArrow && (
                                  <ArrowDown className="hover:cursor-pointer" />
                                )}
                                {!isOpenArrow && (
                                  <ArrowUp className="hover:cursor-pointer" />
                                )}
                              </div>
                              <Label className="hover:cursor-pointer">
                                {item.value && item.value > 0
                                  ? item.value.join(" | ")
                                  : "(không có)"}
                              </Label>
                            </Button>
                            {isOpenVariant && (
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
                          <Button
                            variant="outline"
                            className="w-1/6"
                            onClick={() => handleOnClickButtonMinus(item)}
                          >
                            <Minus className="scale-[4]" />
                          </Button>
                          <Input
                            value={item.quantity}
                            className="w-1/3 text-2xl text-center"
                          />
                          <Button
                            variant="outline"
                            className="w-1/6"
                            onClick={() => handleOnClickButtonPlus(item)}
                          >
                            <Plus className="scale-[4]" />
                          </Button>
                        </div>
                        <div className="w-1/4 flex items-center justify-center">
                          <Label>
                            {formatCurrency(item.quantity * item.salePrice)}
                          </Label>
                        </div>
                        <div className="w-1/4 flex items-center justify-center">
                          <Button
                            variant="outline"
                            onClick={() => {
                              handleOnclickButtonDeleteCartItem(item);
                            }}
                          >
                            Xóa
                          </Button>
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
                <div className="w-11/12 flex items-center space-x-2">
                  <Label>Tiết kiệm ngay</Label>
                  <Label className="text-xl font-bold">
                    {formatCurrency(calculateTotalSavings(cart.items))}
                  </Label>
                </div>
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
      {isOpenDialogConfirm && (
        <DialogConfirmDeleteCartItem
          isOpen={isOpenDialogConfirm}
          onClose={() => setIsOpenDialogConfirm(false)}
          cartItem={cartItemToDelete}
          confirmDeleteCartItem={handleDeleteCartItem}
        />
      )}
    </div>
  );
}
