"use client";

import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import StoreEmpty from "@/assets/images/storeEmpty.jpg";
import ReviewEmpty from "@/assets/images/ReviewEmpty.png";
import { CircularProgress, Rating } from "@mui/material";
import { Button } from "@/components/ui/button";
import { Minus, PiggyBank, Plus, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useState } from "react";
import {
  changeQuantity,
  deleteCartItem,
  getAllCart,
  getQuantityCartItem,
} from "@/api/cart/cartRequest";
import { useInView } from "react-intersection-observer";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setStore } from "@/store/features/userSearchSlice";
import { Toaster } from "@/components/ui/toaster";
import { setCheckout } from "@/store/features/checkoutSlice";
import DialogConfirmCart from "@/components/dialogs/dialogConfirmCart";
import UserHeader from "@/components/headers/mainHeader";
import { useTranslations } from "next-intl";

export default function CartUser() {
  const [listCart, setListCart] = useState([]);
  const [nextPage, setNextPage] = useState(1);
  const pageSize = 4;
  const [hasNext, setHasNext] = useState(false);
  const [loadPage, setLoadPage] = useState(true);
  const [loadListCart, setLoadListCart] = useState(false);
  const { ref: loadRef, inView } = useInView();

  const [selectedListCartItem, setSelectedListCartItem] = useState([]);

  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useDispatch();

  const [cartItemToDelete, setCartItemToDelete] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [actionType, setActionType] = useState("");
  const t = useTranslations("Cart");

  const fetchAllCart = useCallback(
    async (isInitialLoad = false) => {
      if (isInitialLoad) {
        setLoadPage(false);
      }

      setLoadListCart(true);
      try {
        if (!isInitialLoad) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        const response = await getAllCart(
          isInitialLoad ? 1 : nextPage,
          pageSize
        );

        const newListCart = response.result.data;

        if (newListCart.length === 0) {
          setListCart([]);
          setNextPage(response.result.nextPage);
          setHasNext(response.result.hasNext);
        } else if (newListCart.length > 0) {
          setListCart((prevListCart) =>
            isInitialLoad ? newListCart : [...prevListCart, ...newListCart]
          );
          setNextPage(response.result.nextPage);
          setHasNext(response.result.hasNext);
        }
      } catch (error) {
        console.error("Error during fetchAllCart: ", error);
      } finally {
        setLoadListCart(false);
      }
    },
    [nextPage]
  );

  useEffect(() => {
    fetchAllCart(true);
  }, []);

  useEffect(() => {
    if (inView && hasNext) {
      fetchAllCart(false);
    }
  }, [inView, hasNext]);

  useEffect(() => {
    const listCartItemFromOrder = JSON.parse(
      localStorage.getItem("listCartItemFromOrder") || "[]"
    );

    console.log("listCartItemFromOrder: ", listCartItemFromOrder);

    if (listCartItemFromOrder.length > 0 && listCart.length > 0) {
      const updatedSelectedListCartItem = listCartItemFromOrder
        .map((newItem) => {
          const allItems = listCart.flatMap((cart) => cart.items);

          const foundItem = allItems.find(
            (item) => String(item.id) === String(newItem.id)
          );

          return foundItem || null;
        })
        .filter(Boolean);

      setSelectedListCartItem((prevSelectedItems) => [
        ...prevSelectedItems,
        ...updatedSelectedListCartItem,
      ]);

      localStorage.removeItem("listCartItemFromOrder");
    }
  }, [listCart]);

  const hasCheckboxCartItem = (cartItem) => {
    return cartItem.available === true;
  };

  const hasCheckboxCart = (cart) => {
    return cart.items.some((item) => item.available === true);
  };

  const hasCheckboxAll = listCart.some((cart) => hasCheckboxCart(cart));

  const handleCheckedCartItem = (cartItem, isChecked) => {
    if (cartItem.available === false) {
      return;
    }

    if (isChecked) {
      setSelectedListCartItem([...selectedListCartItem, cartItem]);
    } else {
      setSelectedListCartItem(
        selectedListCartItem.filter(
          (selectedItem) => selectedItem.id !== cartItem.id
        )
      );
    }
  };

  const checkedCartItem = (cartItem) => {
    return (
      cartItem.available === true &&
      selectedListCartItem.some(
        (selectedItem) => selectedItem.id === cartItem.id
      )
    );
  };

  const handleCheckedCart = (cart, isChecked) => {
    const availableListCartItem = cart.items.filter(
      (item) => item.available === true
    );

    if (isChecked) {
      const newListCartItem = availableListCartItem.filter(
        (item) =>
          !selectedListCartItem.find(
            (selectedItem) => selectedItem.id === item.id
          )
      );
      setSelectedListCartItem([...selectedListCartItem, ...newListCartItem]);
    } else {
      setSelectedListCartItem(
        selectedListCartItem.filter(
          (selectedItem) =>
            !availableListCartItem.find((item) => item.id === selectedItem.id)
        )
      );
    }
  };

  const checkedCart = (cart) => {
    const availableListCartItem = cart.items.filter(
      (item) => item.available === true
    );

    return (
      availableListCartItem.length > 0 &&
      availableListCartItem.every((item) =>
        selectedListCartItem.some((selectedItem) => selectedItem.id === item.id)
      )
    );
  };

  const handleCheckedAll = (isChecked) => {
    if (isChecked) {
      const allAvailableCartItem = listCart.reduce(
        (all, cart) => [
          ...all,
          ...cart.items.filter((item) => item.available === true),
        ],
        []
      );
      setSelectedListCartItem(allAvailableCartItem);
    } else {
      setSelectedListCartItem([]);
    }
  };

  const checkedAll = () => {
    const allAvailableCartItem = listCart.reduce(
      (count, cart) =>
        count + cart.items.filter((item) => item.available === true).length,
      0
    );

    const selectedAvailableCartItem = selectedListCartItem.filter(
      (item) => item.available === true
    ).length;

    return (
      selectedAvailableCartItem > 0 &&
      selectedAvailableCartItem === allAvailableCartItem
    );
  };

  const totalSavingsOneCart = (listCartItem) => {
    return listCartItem
      .filter((item) => item.available === true)
      .reduce((totalSavings, item) => {
        const savings = item.quantity * (item.originalPrice - item.salePrice);
        return totalSavings + savings;
      }, 0);
  };

  const countTotalProduct = (listCart) => {
    return listCart.reduce((total, cart) => {
      const availableItems = cart.items.filter(
        (item) => item.available === true
      );
      return total + availableItems.length;
    }, 0);
  };

  const totalSavingsListCartItem = (listCartItem) => {
    return listCartItem.reduce((totalSavings, cartItem) => {
      const savings =
        cartItem.quantity * (cartItem.originalPrice - cartItem.salePrice);
      return totalSavings + savings;
    }, 0);
  };

  const totalPriceAll = (listCartItem) => {
    return listCartItem.reduce((totalPrice, item) => {
      const price = item.quantity * item.salePrice;
      return totalPrice + price;
    }, 0);
  };

  const handleClickViewShop = (storeId) => {
    dispatch(setStore(storeId));
    router.push("/search");
  };

  const handleClickViewProduct = (slug) => {
    router.push(`/${slug}`);
  };

  const updateSelectedListCartItem = (cartItemId, quantityUpdate) => {
    setSelectedListCartItem((prevItems) =>
      prevItems.map((item) => {
        if (item.id === cartItemId) {
          return { ...item, quantity: quantityUpdate };
        }
        return item;
      })
    );
  };

  const updateQuantityUI = async (cartItemId, quantityUpdate) => {
    const response = await getQuantityCartItem(cartItemId);
    const quantityCurrent = response.result;
    const updatedAvailable = quantityUpdate <= quantityCurrent;

    setListCart((prevListCart) =>
      prevListCart.map((cart) => ({
        ...cart,
        items: cart.items.map((item) => {
          if (item.id === cartItemId) {
            return {
              ...item,
              quantity: quantityUpdate,
              available: updatedAvailable,
            };
          }
          return item;
        }),
      }))
    );
  };

  const handleChangeQuantity = async (cartItemId, quantityUpdate) => {
    try {
      await changeQuantity(cartItemId, quantityUpdate);
      updateQuantityUI(cartItemId, quantityUpdate);
      updateSelectedListCartItem(cartItemId, quantityUpdate);
      toast({
        description: t("change_quantity_success"),
      });
    } catch (error) {
      toast({
        title: t("toast_title_update_fail"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const [inputValues, setInputValues] = useState({});

  const handleChangeInput = (cartItem, newQuantity) => {
    const quantityUpdate = parseInt(newQuantity, 10);

    if (quantityUpdate === cartItem.quantity) {
      return;
    }

    if (!isNaN(quantityUpdate) && quantityUpdate > 0) {
      handleChangeQuantity(cartItem.id, quantityUpdate);
      setInputValues((prev) => ({
        ...prev,
        [cartItem.id]: undefined,
      }));
    } else {
      toast({
        title: t("toast_title_fail"),
        description: t("text_invalid_quantity"),
        variant: "destructive",
      });
    }
  };

  const handleClickMinus = (item) => {
    const currentInputValue = inputValues[item.id];
    let quantityUpdate;

    if (
      currentInputValue === "" ||
      currentInputValue < 0 ||
      currentInputValue === "0"
    ) {
      quantityUpdate = 1;
    } else {
      const newQuantity = parseInt(currentInputValue, 10);
      if (!isNaN(newQuantity)) {
        quantityUpdate = newQuantity - 1;
      } else {
        quantityUpdate = item.quantity - 1;
      }
    }

    if (quantityUpdate === 0) {
      setOpenDialog(true);
      setActionType("deleteOne");
      setCartItemToDelete(item);
    } else {
      handleChangeQuantity(item.id, quantityUpdate);
      setInputValues((prev) => ({
        ...prev,
        [item.id]: undefined,
      }));
    }
  };

  const handleClickPlus = (item) => {
    const currentInputValue = inputValues[item.id];
    let quantityUpdate;

    if (
      currentInputValue === "" ||
      currentInputValue < 0 ||
      currentInputValue === "0"
    ) {
      quantityUpdate = 1;
    } else {
      const newQuantity = parseInt(currentInputValue, 10);
      if (!isNaN(newQuantity)) {
        quantityUpdate = newQuantity + 1;
      } else {
        quantityUpdate = item.quantity + 1;
      }
    }

    handleChangeQuantity(item.id, quantityUpdate);
    setInputValues((prev) => ({
      ...prev,
      [item.id]: undefined,
    }));
  };

  const handleClickDeleteOne = (cartItem) => {
    setOpenDialog(true);
    setActionType("deleteOne");
    setCartItemToDelete(cartItem);
  };

  const updateListCart = (cartItem) => {
    setListCart((prevListCart) =>
      prevListCart
        .map((cart) => ({
          ...cart,
          items: cart.items.filter((item) => item.id !== cartItem.id),
        }))
        .filter((cart) => cart.items.length > 0)
    );
  };

  const confirmDeleteOne = async () => {
    if (cartItemToDelete) {
      try {
        await deleteCartItem(cartItemToDelete.id);
        updateListCart(cartItemToDelete);
        setCartItemToDelete(null);
        setActionType("");
        setOpenDialog(false);
        toast({
          description: t("toast_description_delete_one", {productName: cartItemToDelete.name}),
        });
      } catch (error) {
        toast({
          title: t("toast_title_fail"),
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleClickDeleteAll = () => {
    if (selectedListCartItem.length === 0) {
      toast({
        title: t("toast_title_fail"),
        description: t("toast_description_select_delete"),
        variant: "destructive",
      });
    } else if (selectedListCartItem.length > 0) {
      setActionType("deleteList");
      setOpenDialog(true);
    }
  };

  const confirmDeleteList = async () => {
    for (const cartItem of selectedListCartItem) {
      try {
        await deleteCartItem(cartItem.id);
        updateListCart(cartItem);
        setSelectedListCartItem((prevItems) =>
          prevItems.filter((item) => item.id !== cartItem.id)
        );
      } catch (error) {
        break;
      }
    }
    setActionType("");
    setOpenDialog(false);
    toast({
      description: t("toast_description_delete_list", {productLength: selectedListCartItem.length}),
    });
  };

  const handleCheckout = () => {
    const selectedCartWithItem = listCart
      .map((cart) => ({
        ...cart,
        items: cart.items.filter((item) =>
          selectedListCartItem.some(
            (selectedItem) => selectedItem.id === item.id
          )
        ),
      }))
      .filter((cart) => cart.items.length > 0);
    console.log("selectedCartWithItem: ", selectedCartWithItem);
    if (selectedCartWithItem.length === 0) {
      toast({
        title: t("toast_title_fail"),
        description: t("toast_description_select_checkout"),
        variant: "destructive",
      });
    } else {
      dispatch(setCheckout(selectedCartWithItem));
      router.push("/checkout");
    }
  };

  const handleOnChangeInput = (cartItem, newValue) => {
    setInputValues((prev) => ({
      ...prev,
      [cartItem.id]: newValue,
    }));
  };

  const handleOnKeyDownInput = (cartItem, event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleChangeInput(cartItem, event.target.value);
      cartItem.isEnterPressed = true;
      setTimeout(() => {
        cartItem.isEnterPressed = false;
      }, 0);
      event.target.blur();
    }
  };

  const handleOnBlurInput = (cartItem, event) => {
    if (cartItem.isEnterPressed) {
      return;
    }
    const timeoutId = setTimeout(() => {
      handleChangeInput(cartItem, event.target.value);
    }, 1000);

    event.target.onfocus = () => clearTimeout(timeoutId);
  };

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return "0 ₫";

    const absoluteValue = Math.abs(Number(value));

    if (absoluteValue >= 1e9) {
      const billions = (absoluteValue / 1e9).toFixed(2);
      const formatted = billions.endsWith(".00")
        ? billions.replace(".00", "")
        : billions;

      return `${formatted} tỷ`;
    }

    const formatted = absoluteValue.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

    return value < 0 ? `- ${formatted}` : formatted;
  };

  const listCartMapped = listCart.filter((cart) => cart.items.length > 0);

  return (
    <>
      <Toaster />

      {loadPage && (
        <div className="fixed inset-0 flex flex-col justify-center items-center z-[500] gap-4 bg-black-primary">
          <CircularProgress></CircularProgress>
          <Label className="text-2xl text-white-primary">
            {t("message_load_page")}
          </Label>
        </div>
      )}

      {!loadPage && (
        <div className="min-h-screen min-w-[1200px] flex flex-col bg-blue-primary">
          <UserHeader />

          <div className="min-h-16 flex justify-between items-center mx-20 mt-4 bg-white-primary shadow-xl">
            <div className="w-1/2 flex items-center">
              <div className="w-1/6 flex justify-center">
                {/* Checkbox cart và cartItem */}
                {hasCheckboxAll && (
                  <Checkbox
                    checked={checkedAll()}
                    onCheckedChange={(checked) => handleCheckedAll(checked)}
                  />
                )}
              </div>
              <Label className="w-5/6 text-sm">{t("text_product")}</Label>
            </div>
            <div className="w-1/2 flex items-center gap-8">
              <Label className="w-1/4 text-sm text-center line-clamp-1 text-black-primary text-opacity-50">
                {t("text_unit_price")}
              </Label>
              <Label className="w-1/4 text-sm text-center line-clamp-1 text-black-primary text-opacity-50">
                {t("text_quantity")}
              </Label>
              <Label className="w-1/4 text-sm text-center line-clamp-1 text-black-primary text-opacity-50">
                {t("text_amount")}
              </Label>
              <Label className="w-1/4 text-sm text-center line-clamp-1 text-black-primary text-opacity-50">
                {t("text_action")}
              </Label>
            </div>
          </div>

          <div className="flex flex-col mx-20 my-8 gap-8 min-h-screen relative">
            {listCartMapped.length > 0 &&
              listCartMapped.map((cart, index) => (
                <Card key={index} className="rounded-none">
                  <CardTitle className="min-h-16 flex items-center border-b bg-gradient-to-r from-white-primary to-white-secondary">
                    <div className="w-1/12 flex justify-center">
                      {/*Checkbox (cart)*/}
                      {hasCheckboxCart(cart) && (
                        <Checkbox
                          checked={checkedCart(cart)}
                          onCheckedChange={(checked) =>
                            handleCheckedCart(cart, checked)
                          }
                        />
                      )}
                    </div>

                    <div
                      onClick={() => handleClickViewShop(cart.storeId)}
                      className="flex items-center space-x-4 hover:cursor-pointer"
                    >
                      <Image
                        alt={cart.storeName}
                        src={cart.avatarStore || StoreEmpty}
                        height={30}
                        width={30}
                        className="rounded-full"
                      />

                      <Label className="text-lg hover:cursor-pointer">
                        {cart.storeName}
                      </Label>

                      <Rating
                        value={cart.ratingStore}
                        precision={0.1}
                        readOnly
                      />
                    </div>
                  </CardTitle>

                  <CardContent className="flex flex-col p-0">
                    {cart.items.length > 0 &&
                      cart.items.map((item) => (
                        <div
                          key={item.id}
                          className="min-h-32 flex items-center border-b"
                        >
                          <div className="w-1/2 flex items-center">
                            <div className="w-1/6 flex justify-center">
                              {/*Checkbox (cartItem)*/}
                              {hasCheckboxCartItem(item) && (
                                <Checkbox
                                  checked={checkedCartItem(item)}
                                  onCheckedChange={(checked) =>
                                    handleCheckedCartItem(item, checked)
                                  }
                                />
                              )}
                            </div>

                            <div className="w-5/6 flex items-center">
                              <div className="w-2/3 flex items-center gap-[4px] relative">
                                <Image
                                  alt={item.name}
                                  src={item.image || StoreEmpty}
                                  height={80}
                                  width={80}
                                  onClick={() => {
                                    handleClickViewProduct(item.productSlug);
                                  }}
                                  className="rounded-md object-contain w-20 h-20 hover:cursor-pointer hover:scale-110"
                                />

                                <div className="flex flex-col gap-[8px]">
                                  <Label
                                    className="text-lg line-clamp-2 hover:cursor-pointer hover:text-xl"
                                    onClick={() => {
                                      handleClickViewProduct(item.productSlug);
                                    }}
                                  >
                                    {item.name}
                                  </Label>
                                  <div className="flex items-center gap-[4px]">
                                    <Image
                                      alt={item.brand}
                                      src={item.logoBrand || StoreEmpty}
                                      height={28}
                                      width={28}
                                      className="rounded-md"
                                    />
                                    <Label className="text-sm">
                                      {item.brand}
                                    </Label>
                                  </div>
                                </div>

                                {!hasCheckboxCartItem(item) && (
                                  <div className="absolute w-full h-full flex flex-col justify-center items-center rounded-xl bg-gray-primary bg-opacity-50">
                                    <Label className="text-2xl text-red-primary font-bold text-opacity-75 -rotate-6 bg-black-primary bg-opacity-5 p-[8px] rounded-xl">
                                      {t("text_insufficient_quantity")}
                                    </Label>
                                  </div>
                                )}
                              </div>

                              <div className="w-1/3 flex flex-col justify-center items-center gap-[4px] hover:cursor-pointer">
                                <Label className="text-sm text-black-primary text-opacity-50 hover:cursor-pointer">
                                  {t("text_classification")}
                                </Label>
                                <Label className="text-sm hover:cursor-pointer">
                                  {item.value
                                    ? item.value.join(" | ")
                                    : t("text_nothing")}
                                </Label>
                              </div>
                            </div>
                          </div>

                          <div className="w-1/2 flex items-center gap-8">
                            <div className="w-1/4 flex flex-col justify-center items-center gap-[4px]">
                              <Label className="text-sm text-red-primary">
                                {formatCurrency(item.salePrice || 0)}
                              </Label>
                              <Label className="text-sm text-black-primary text-opacity-50 line-through truncate">
                                {formatCurrency(item.originalPrice || 0)}
                              </Label>
                            </div>

                            <div className="w-1/4 flex justify-center items-center gap-[4px]">
                              <Button
                                variant="outline"
                                className="w-[48px] h-8"
                                onClick={() => handleClickMinus(item)}
                              >
                                <Minus className="h-5 w-5" />
                              </Button>

                              <Input
                                value={inputValues[item.id] ?? item.quantity}
                                onChange={(e) =>
                                  handleOnChangeInput(item, e.target.value)
                                }
                                onKeyDown={(e) => handleOnKeyDownInput(item, e)}
                                onBlur={(e) => handleOnBlurInput(item, e)}
                                type="number"
                                className="w-[80px] h-8 text-lg text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />

                              <Button
                                variant="outline"
                                className="w-[48px] h-8"
                                onClick={() => handleClickPlus(item)}
                              >
                                <Plus className="h-5 w-5" />
                              </Button>
                            </div>

                            <Label className="w-1/4 text-sm text-center">
                              {formatCurrency(
                                item.quantity * item.salePrice || 0
                              )}
                            </Label>

                            <div className="w-1/4 flex justify-center">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  handleClickDeleteOne(item);
                                }}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </CardContent>

                  <CardFooter className="min-h-16 p-0">
                    <PiggyBank className="w-1/12 text-sm text-error-dark" />
                    <div className="w-11/12 flex items-center gap-[4px]">
                      <Label className="text-sm">{t("text_savings")}</Label>
                      <Label className="text-lg font-bold text-red-primary">
                        {formatCurrency(totalSavingsOneCart(cart.items) || 0)}
                      </Label>
                    </div>
                  </CardFooter>
                </Card>
              ))}

            {listCartMapped.length === 0 && (
              <div className="min-h-screen flex flex-col items-center justify-center">
                <Image
                  alt="ảnh trống"
                  src={ReviewEmpty}
                  width={200}
                  height={200}
                />
                <Label className="text-xl text-center">{t("text_empty_cart")}</Label>
              </div>
            )}

            {loadListCart && (
              <div className="w-full h-16 flex items-center justify-center">
                <div className="flex space-x-4">
                  <div className="w-4 h-4 bg-red-primary rounded-full animate-bounce"></div>
                  <div className="w-4 h-4 bg-red-primary rounded-full animate-bounce [animation-delay:-.1s]"></div>
                  <div className="w-4 h-4 bg-red-primary rounded-full animate-bounce [animation-delay:-.5s]"></div>
                </div>
              </div>
            )}

            {!loadListCart && hasNext && (
              <div
                ref={loadRef}
                className="absolute bottom-0 w-full h-16"
              ></div>
            )}
          </div>

          <div className="min-h-20 flex justify-between items-center mx-20 bg-white-primary shadow-xl sticky bottom-0 border-t">
            <div className="w-1/2 flex items-center">
              <div className="w-1/6 flex justify-center">
                {/*Checkbox cart và cartItem*/}
                {hasCheckboxAll && (
                  <Checkbox
                    checked={checkedAll()}
                    onCheckedChange={(checked) => handleCheckedAll(checked)}
                  />
                )}
              </div>

              <div className="w-5/6 flex justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => handleCheckedAll(!checkedAll())}
                  >
                    {t("text_select_all")} ({countTotalProduct(listCart)})
                  </Button>

                  {/*Button xóa tất cả*/}
                  <Button
                    variant="outline"
                    onClick={() => handleClickDeleteAll()}
                  >
                    {t("text_delete")} ({selectedListCartItem.length})
                  </Button>
                </div>
                <Label className="text-sm text-center line-clamp-2">
                  {t("text_savings")}:{" "}
                  {formatCurrency(
                    totalSavingsListCartItem(selectedListCartItem) || 0
                  )}
                </Label>
              </div>
            </div>

            <div className="w-1/2 flex justify-center items-center gap-8">
              <div className="flex items-center gap-[4px]">
                <Label className="text-sm text-center line-clamp-2">
                  {t("text_total_payment")} ({selectedListCartItem.length} {t("text_product_lower")}):
                </Label>
                <Label className="text-xl font-bold text-center line-clamp-2">
                  {formatCurrency(totalPriceAll(selectedListCartItem) || 0)}
                </Label>
              </div>

              <Button
                className="w-1/4 bg-red-primary rounded-md"
                onClick={() => handleCheckout()}
              >
                {t("text_checkout")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {openDialog && (
        <>
          <div className="fixed inset-0 bg-black-primary bg-opacity-85 z-[150]" />
          <DialogConfirmCart
            onOpen={openDialog}
            onClose={() => setOpenDialog(false)}
            onDeleteOne={confirmDeleteOne}
            onDeleteList={confirmDeleteList}
            cartItemToDelete={cartItemToDelete}
            selectedListCartItem={selectedListCartItem}
            actionType={actionType}
          />
        </>
      )}
    </>
  );
}
