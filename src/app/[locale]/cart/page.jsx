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
import DialogConfirmSelectCartItem from "./dialogConfirmSelectCartItem";
import ManageCartUserSkeleton from "./skeletonCart";
import { useRouter } from "next/navigation";
import { setStore } from "@/store/features/userSearchSlice";
import { useDispatch } from "react-redux";

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
  const [selectedCartItems, setSelectedCartItems] = useState([]);
  const [isOpenDialogConfirmSelected, setIsOpenDialogConfirmSelected] =
    useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useDispatch();

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
      toast({
        title: "Thành công",
        description: `Bạn đã cập nhật số lượng thành công`,
      });
      updateCartQuantityUI(cartItemId, quantityUpdate);
      updateSelectedCartItems(cartItemId, quantityUpdate);
    } catch (error) {
      toast({
        title: "Thất bại",
        description: error.message,
      });
    }
  };

  const handleInputQuantityChange = (cartItemId, newQuantity) => {
    const quantityUpdate = parseInt(newQuantity, 10);
    if (!isNaN(quantityUpdate) && quantityUpdate > 0) {
      handleQuantityChange(cartItemId, quantityUpdate);
    } else {
      return;
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

  const updateSelectedCartItems = (cartItemId, quantityUpdate) => {
    setSelectedCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === cartItemId) {
          return { ...item, quantity: quantityUpdate };
        }
        return item;
      })
    );
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

  const handleOnClickButtonDeleteSelectCartItem = () => {
    if (selectedCartItems.length > 0) {
      setIsOpenDialogConfirmSelected(true);
    } else {
      toast({
        title: "Thất bại",
        description: `Vui lòng chọn sản phẩm`,
      });
    }
  };

  const handleDeleteSelectCartItems = async () => {
    for (const cartItem of selectedCartItems) {
      try {
        await deleteCartItem(cartItem.id);
        setSelectedCartItems((prevItems) =>
          prevItems.filter((item) => item.id !== cartItem.id)
        );
      } catch (error) {
        break;
      }
    }
    toast({
      title: "Thành công",
      description: `Bạn đã xóa ${selectedCartItems.length} sản phẩm khỏi giỏ hàng thành công`,
    });
    fetchAllCart();
    setIsOpenDialogConfirmSelected(false);
  };

  const handleSelectCartItem = (cartItem, isChecked) => {
    if (isChecked) {
      setSelectedCartItems([...selectedCartItems, cartItem]);
    } else {
      setSelectedCartItems(
        selectedCartItems.filter((item) => item.id !== cartItem.id)
      );
    }
    console.log("cartItem: ", cartItem.id);
  };

  const handleSelectCart = (cart, isChecked) => {
    if (isChecked) {
      const newSelectedItems = cart.items.filter(
        (item) =>
          !selectedCartItems.find((selectedItem) => selectedItem.id === item.id)
      );
      setSelectedCartItems([...selectedCartItems, ...newSelectedItems]);
    } else {
      setSelectedCartItems(
        selectedCartItems.filter(
          (selectedItem) =>
            !cart.items.find((item) => item.id === selectedItem.id)
        )
      );
    }
  };

  const handleSelectAllCartAndCartItem = (isChecked) => {
    if (isChecked) {
      const allItems = carts.reduce((all, cart) => [...all, ...cart.items], []);
      setSelectedCartItems(allItems);
    } else {
      setSelectedCartItems([]);
    }
  };

  const isSelectedCartItem = (cartItem) => {
    return selectedCartItems.some(
      (selectedItem) => selectedItem.id === cartItem.id
    );
  };

  const isSelectedCart = (cart) => {
    return cart.items.every((item) =>
      selectedCartItems.some((selectedItem) => selectedItem.id === item.id)
    );
  };

  const isSelectedCartAndCartItem = () => {
    const totalItems = carts.reduce(
      (count, cart) => count + cart.items.length,
      0
    );
    return (
      selectedCartItems.length > 0 && selectedCartItems.length === totalItems
    );
  };

  const handleOnclickViewShop = (storeId) => {
    router.push("/search");
    dispatch(setStore(storeId));
  };

  const handleOnClickLogo = () => {
    router.push("/");
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

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
    fetchAllCart();
    setLoading(true);
  }, [fetchAllCart, totalPage, totalElement]);

  const calculateTotalSavings = (cartItems) => {
    return cartItems.reduce((totalSavings, cartItem) => {
      const savings =
        cartItem.quantity * (cartItem.originalPrice - cartItem.salePrice);
      return totalSavings + savings;
    }, 0);
  };

  const calculateTotalPriceSelectedCartItem = (cartItems) => {
    return cartItems.reduce((totalPrice, cartItem) => {
      const price = cartItem.quantity * cartItem.salePrice;
      return totalPrice + price;
    }, 0);
  };

  const calculateTotalSavingSelectedCartItem = (cartItems) => {
    return cartItems.reduce((totalSavings, cartItem) => {
      const savings =
        cartItem.quantity * (cartItem.originalPrice - cartItem.salePrice);
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

  return loading ? (
    <div className="flex flex-col min-h-screen w-full bg-muted/4 bg-blue-primary">
      <Toaster />
      <div className="h-[80px] flex items-center justify-between bg-white-primary border-b-2 mt-24 mb-4">
        <div
          className="flex items-center space-x-4 ml-32 hover:cursor-pointer"
          onClick={() => handleOnClickLogo()}
        >
          <div className="flex items-center space-x-2">
            <BriefcaseBusiness size={50} className="text-error" />
            <Label className="text-2xl text-error hover:cursor-pointer">
              HKK
            </Label>
          </div>
          <div className="w-[1px] h-6 bg-error"></div>
          <Label className="text-2xl font-bold text-error hover:cursor-pointer">
            Giỏ Hàng
          </Label>
        </div>
        {/* <div className="w-1/2 flex items-center space-x-2 mr-4">
          <Input placeholder="Tìm kiếm giỏ hàng" />
          <Search className="hover:cursor-pointer" />
        </div> */}
      </div>
      <div className="flex items-center justify-between bg-white-primary my-4 mx-20">
        <div className="w-1/2 flex items-center">
          {/*Checkbox cart và cartItem*/}
          <Checkbox
            className="w-1/6"
            checked={isSelectedCartAndCartItem()}
            onChange={(e) => handleSelectAllCartAndCartItem(e.target.checked)}
          />
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
      <div className="my-4 mx-20 space-y-4">
        {carts.length > 0 ? (
          carts.map((cart, index) => (
            <Card key={index} className="rounded-none">
              <CardTitle className="flex items-center mt-4 mb-4">
                {/*Checkbox (cart)*/}
                <Checkbox
                  className="w-1/12"
                  checked={isSelectedCart(cart)}
                  onChange={(e) => handleSelectCart(cart, e.target.checked)}
                />
                <div
                  className="w-11/12 flex items-center space-x-2 hover:cursor-pointer"
                  onClick={() => handleOnclickViewShop(cart.storeId)}
                >
                  <Image
                    alt="avatar store"
                    src={cart.avatarStore || storeEmpty}
                    height={30}
                    width={30}
                    unoptimized={true}
                    className="rounded-full transition-transform duration-300"
                  />
                  <Label className="text-xl hover:cursor-pointer">
                    {cart.storeName}
                  </Label>
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
                        {/*Checkbox (cartItem)*/}
                        <Checkbox
                          className="w-1/6"
                          checked={isSelectedCartItem(item)}
                          onChange={(e) =>
                            handleSelectCartItem(item, e.target.checked)
                          }
                        />
                        <div className="w-5/6 flex items-center">
                          <div className="w-2/3 flex items-center space-x-4">
                            <Image
                              alt="ảnh sản phẩm"
                              src={item.image || storeEmpty}
                              height={100}
                              width={100}
                              className="mt-4 mb-4"
                            />
                            <div className="flex-1 min-w-0 space-y-4">
                              <Label className="line-clamp-2 text-xl">
                                {item.name}
                              </Label>
                              <div className="flex items-center truncate space-x-2">
                                <Image
                                  alt="logo thương hiệu"
                                  src={item.logoBrand || storeEmpty}
                                  height={30}
                                  width={30}
                                  unoptimized={true}
                                  className="rounded-md"
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
                                {item.value
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
                          <Label className="line-through text-muted-foreground">
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
                            <Minus className="scale-[5]" />
                          </Button>
                          <Input
                            value={item.quantity}
                            onChange={(e) =>
                              handleInputQuantityChange(item.id, e.target.value)
                            }
                            type="number"
                            className="w-1/3 text-xl text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <Button
                            variant="outline"
                            className="w-1/6"
                            onClick={() => handleOnClickButtonPlus(item)}
                          >
                            <Plus className="scale-[5]" />
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
            <Image
              alt="avatar store"
              src={storeEmpty}
              height={1000}
              width={1000}
              unoptimized={true}
              className="rounded-md transition-transform duration-300"
            />
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
      <div className="flex items-center justify-between bg-white-primary min-h-[80px] my-4 mx-20 sticky bottom-0 border-t-2 ">
        {/*Checkbox cart và cartItem*/}
        <Checkbox
          className="w-1/12"
          checked={isSelectedCartAndCartItem()}
          onChange={(e) => handleSelectAllCartAndCartItem(e.target.checked)}
        />
        <div className="w-11/12 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline">
              Chọn tất cả ({selectedCartItems.length})
            </Button>
            {/*Button xóa tất cả các cart hoặc cartItem đã chọn (từ checkbox cha (card) hoặc checkcon con (cartItem)*/}
            <Button
              variant="outline"
              onClick={() => handleOnClickButtonDeleteSelectCartItem()}
            >
              Xóa
            </Button>
          </div>
          <Label variant="outline">
            Tiết kiệm ngay:{" "}
            {formatCurrency(
              calculateTotalSavingSelectedCartItem(selectedCartItems)
            )}
          </Label>
          <div className="flex items-center space-x-4">
            <Label>Tổng sản phẩm ({selectedCartItems.length} sản phẩm):</Label>
            <Label className="text-2xl font-bold">
              {formatCurrency(
                calculateTotalPriceSelectedCartItem(selectedCartItems)
              )}
            </Label>
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
      {isOpenDialogConfirmSelected && (
        <DialogConfirmSelectCartItem
          isOpen={isOpenDialogConfirmSelected}
          onClose={() => setIsOpenDialogConfirmSelected(false)}
          selectedCartItems={selectedCartItems}
          confirmDeleteSelectedCartItem={handleDeleteSelectCartItems}
        />
      )}
    </div>
  ) : (
    <ManageCartUserSkeleton />
  );
}
