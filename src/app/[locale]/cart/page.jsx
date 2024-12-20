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
  Minus,
  PiggyBank,
  Plus,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import DialogConfirmDeleteCartItem from "./dialogConfirmDeleteCartItem";
import DialogConfirmSelectCartItem from "./dialogConfirmSelectCartItem";
import ManageCartUserSkeleton from "./skeletonCart";
import { useRouter } from "next/navigation";
import { setStore } from "@/store/features/userSearchSlice";
import { useDispatch } from "react-redux";
import { setCheckout } from "@/store/features/checkoutSlice";
import CommonHeader from "@/components/headers/commonHeader";
import { Separator } from "@/components/ui/separator";
import ReviewEmpty from "@/assets/images/ReviewEmpty.png";
import storeEmpty from "@/assets/images/storeEmpty.jpg";
import { formatCurrency } from "@/utils/commonUtils";

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
      fetchAllCart();
      updateSelectedCartItems(cartItemId, quantityUpdate);
    } catch (error) {
      toast({
        title: "Cập nhật số lượng thất bại",
        description: error.message,
        variant: "destructive",
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

  // const updateCartQuantityUI = (cartItemId, quantityUpdate) => {
  //   setCarts((prevCarts) => {
  //     return prevCarts.map((cart) => ({
  //       ...cart,
  //       items: cart.items.map((item) => {
  //         if (item.id === cartItemId) {
  //           return { ...item, quantity: quantityUpdate };
  //         }
  //         return item;
  //       }),
  //     }));
  //   });
  // };

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
        variant: "destructive",
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
    if (cartItem.available === false) {
      return;
    }

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
    const availableItems = cart.items.filter((item) => item.available === true);

    if (isChecked) {
      const newSelectedItems = availableItems.filter(
        (item) =>
          !selectedCartItems.find((selectedItem) => selectedItem.id === item.id)
      );
      setSelectedCartItems([...selectedCartItems, ...newSelectedItems]);
    } else {
      setSelectedCartItems(
        selectedCartItems.filter(
          (selectedItem) =>
            !availableItems.find((item) => item.id === selectedItem.id)
        )
      );
    }
  };

  const handleSelectCartAndCartItem = (isChecked) => {
    if (isChecked) {
      const allAvailableItems = carts.reduce(
        (all, cart) => [
          ...all,
          ...cart.items.filter((item) => item.available === true),
        ],
        []
      );
      setSelectedCartItems(allAvailableItems);
    } else {
      setSelectedCartItems([]);
    }
  };

  const isSelectedCartItem = (cartItem) => {
    return (
      cartItem.available === true &&
      selectedCartItems.some((selectedItem) => selectedItem.id === cartItem.id)
    );
  };

  const isCartItemAvailable = (cartItem) => {
    return cartItem.available === true;
  };

  const isSelectedCart = (cart) => {
    const availableItems = cart.items.filter((item) => item.available === true);
    return (
      availableItems.length > 0 &&
      availableItems.every((item) =>
        selectedCartItems.some((selectedItem) => selectedItem.id === item.id)
      )
    );
  };

  const isCartAvailable = (cart) => {
    return cart.items.some((item) => item.available === true);
  };

  const isSelectedCartAndCartItem = () => {
    const totalAvailableItems = carts.reduce(
      (count, cart) =>
        count + cart.items.filter((item) => item.available === true).length,
      0
    );
    const selectedAvailableItems = selectedCartItems.filter(
      (item) => item.available === true
    ).length;
    return (
      selectedAvailableItems > 0 &&
      selectedAvailableItems === totalAvailableItems
    );
  };

  const isCartandCartItemAvailable = carts.some((cart) =>
    isCartAvailable(cart)
  );

  const handleOnclickViewShop = (storeId) => {
    router.push("/search");
    dispatch(setStore(storeId));
  };

  const fetchAllCart = useCallback(async () => {
    try {
      const response = await getAllCart(currentPage);
      setCarts(response.result.data);
      setTotalPage(response.result.totalPages);
      setTotalElement(response.result.totalElements);
      setHasNext(response.result.hasNext);
      setHasPrevious(response.result.hasPrevious);
      console.log("response", response);
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
    return cartItems
      .filter((cartItem) => cartItem.available === true)
      .reduce((totalSavings, cartItem) => {
        const savings =
          cartItem.quantity * (cartItem.originalPrice - cartItem.salePrice);
        return totalSavings + savings;
      }, 0);
  };

  const calculateTotalPriceSelectedAllCartItem = (cartItems) => {
    return cartItems.reduce((totalPrice, cartItem) => {
      const price = cartItem.quantity * cartItem.salePrice;
      return totalPrice + price;
    }, 0);
  };

  const calculateTotalSavingSelectedOneCartItem = (cartItems) => {
    console.log("cartItems: ", cartItems);
    return cartItems.reduce((totalSavings, cartItem) => {
      const savings =
        cartItem.quantity * (cartItem.originalPrice - cartItem.salePrice);
      return totalSavings + savings;
    }, 0);
  };

  const handleCheckout = () => {
    const selectedCartWithItem = carts
      .map((cart) => ({
        ...cart,
        items: cart.items.filter((item) =>
          selectedCartItems.some((selectedItem) => selectedItem.id === item.id)
        ),
      }))
      .filter((cart) => cart.items.length > 0);
    console.log("selectedCartWithItem: ", selectedCartWithItem);
    if (selectedCartWithItem.length === 0) {
      toast({
        title: "Thất bại",
        description: "Vui lòng chọn sản phẩm để mua hàng",
        variant: "destructive",
      });
    } else {
      dispatch(setCheckout(selectedCartWithItem));
      router.push("/checkout");
    }
  };

  return loading ? (
    <div className="flex flex-col min-h-screen w-full bg-muted/4 bg-blue-primary">
      <Toaster />
      <CommonHeader />
      <div className="flex items-center justify-between bg-white-primary my-4 mx-40 shadow-xl border-1 py-2 min-h-[40px]">
        <div className="w-1/2 flex items-center">
          {/*Checkbox cart và cartItem*/}
          <div className="w-1/6 flex items-center justify-center">
            {isCartandCartItemAvailable && (
              <Checkbox
                checked={isSelectedCartAndCartItem()}
                onChange={(e) => handleSelectCartAndCartItem(e.target.checked)}
              />
            )}
          </div>
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

      <div className="my-4 mx-40 space-y-4 h-full mb-[100px]">
        {carts && carts.length > 0 ? (
          carts.map((cart, index) =>
            cart.items && cart.items.length > 0 ? (
              <Card key={index} className="rounded-none">
                <CardTitle className="flex items-center pt-4 pb-4 bg-gradient-to-r from-white-primary to-white-secondary">
                  {/*Checkbox (cart)*/}
                  <div className="w-1/12 flex items-center justify-center">
                    {isCartAvailable(cart) ? (
                      <Checkbox
                        checked={isSelectedCart(cart)}
                        onChange={(e) =>
                          handleSelectCart(cart, e.target.checked)
                        }
                      />
                    ) : null}
                  </div>
                  <div
                    className="flex items-center space-x-2 hover:cursor-pointer"
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
                <Separator className="mx-auto w-full" />
                <CardContent className="w-full flex flex-col items-center min-h-[150px] pr-0 pl-0 pt-4 pb-4">
                  {cart.items.map((item) => (
                    <div
                      key={item.id}
                      className="w-full flex flex-col relative"
                    >
                      <div className="flex items-center">
                        <div className="w-1/2 flex items-center">
                          <div className="w-1/6 relative flex items-center justify-center">
                            {/*Checkbox (cartItem)*/}
                            {isCartItemAvailable(item) && (
                              <Checkbox
                                checked={isSelectedCartItem(item)}
                                onChange={(e) =>
                                  handleSelectCartItem(item, e.target.checked)
                                }
                              />
                            )}
                          </div>
                          <div className="w-5/6 flex items-center">
                            <div className="w-2/3 flex items-center relative">
                              <Image
                                alt="ảnh sản phẩm"
                                src={item.image || storeEmpty}
                                height={68}
                                width={68}
                                className="mt-4 mb-4 max-w-[68px] max-h-[68px] rounded-md"
                              />
                              <div className="flex-1 min-w-0 space-y-4 ml-4">
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
                              {!isCartItemAvailable(item) && (
                                <div className="absolute bg-gray-primary bg-opacity-50 w-full h-full flex items-center justify-center rounded-2xl">
                                  <Label className="text-3xl text-center font-bold font-sans truncate text-red-primary text-opacity-80 -rotate-[8deg] bg-black-primary p-2 rounded-2xl bg-opacity-5">
                                    Số lượng không đủ
                                  </Label>
                                </div>
                              )}
                            </div>
                            <div className="w-1/3 flex flex-col items-center justify-center relative">
                              <Button
                                variant="outline"
                                className="w-5/6 h-full flex flex-col items-center justify-center space-y-1 truncate hover:cursor-default"
                              >
                                <div className="flex items-center space-x-1">
                                  <Label className="text-black-primary text-opacity-75">
                                    Phân loại hàng
                                  </Label>
                                  {!isOpenArrow && <ArrowDown />}
                                  {!isOpenArrow && <ArrowUp />}
                                </div>
                                <Label>
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
                          <div className="w-1/4 flex items-center justify-center text-red-primary/90 space-x-2 mx-2">
                            <Label>{formatCurrency(item.salePrice)}</Label>
                            <Label className="line-through text-muted-foreground truncate">
                              {formatCurrency(item.originalPrice)}
                            </Label>
                          </div>
                          <div className="w-1/4 flex items-center justify-center">
                            <div className="flex items-center justify-center">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleOnClickButtonMinus(item)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Input
                                value={item.quantity}
                                onChange={(e) =>
                                  handleInputQuantityChange(
                                    item.id,
                                    e.target.value
                                  )
                                }
                                type="number"
                                className="w-1/3 text-xl text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleOnClickButtonPlus(item)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
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
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <Separator className="mx-auto mt-4 mb-4"></Separator>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="mb-8 p-0">
                  <PiggyBank className="w-1/12 text-error-dark" />
                  <div className="w-11/12 flex items-center space-x-2">
                    <Label>Tiết kiệm ngay</Label>
                    <Label className="text-xl font-bold text-red-primary">
                      {formatCurrency(calculateTotalSavings(cart.items))}
                    </Label>
                  </div>
                </CardFooter>
              </Card>
            ) : null
          )
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg min-h-[400px] mt-6 space-y-6">
            <Image
              alt="ảnh trống"
              className="mx-auto"
              src={ReviewEmpty}
              width={300}
              height={300}
            />
            <Label className="text-xl text-gray-tertiary text-center">
              Giỏ hàng trống
            </Label>
          </div>
        )}

        {carts && carts.length > 0 && (
          <PaginationAdminTable
            currentPage={currentPage}
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
            totalPage={totalPage}
            setCurrentPage={setCurrentPage}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
          ></PaginationAdminTable>
        )}
      </div>
      <div className="flex items-center fixed bottom-0 justify-between bg-gradient-to-r from-black-tertiary to-black-primary text-white-primary min-h-[80px] w-full border-t-2">
        <div className="w-1/12 flex items-center justify-center">
          {/*Checkbox cart và cartItem*/}
          {isCartandCartItemAvailable && (
            <Checkbox
              checked={isSelectedCartAndCartItem()}
              onChange={(e) => handleSelectCartAndCartItem(e.target.checked)}
            />
          )}
        </div>
        <div className="w-11/12 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="text-black-primary">
              Chọn tất cả ({selectedCartItems.length})
            </Button>
            {/*Button xóa tất cả*/}
            <Button
              variant="outline"
              className="text-black-primary"
              onClick={() => handleOnClickButtonDeleteSelectCartItem()}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <Label variant="outline">
            Tiết kiệm ngay:{" "}
            {formatCurrency(
              calculateTotalSavingSelectedOneCartItem(selectedCartItems)
            )}
          </Label>
          <div className="flex items-center space-x-4">
            <Label>Tổng sản phẩm ({selectedCartItems.length} sản phẩm):</Label>
            <Label className="text-2xl font-bold">
              {formatCurrency(
                calculateTotalPriceSelectedAllCartItem(selectedCartItems)
              )}
            </Label>
          </div>
          <Button
            className="w-1/6 mr-10 bg-red-primary rounded-xl"
            onClick={() => handleCheckout()}
          >
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
