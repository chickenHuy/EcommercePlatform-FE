"use client";

import { useCallback, useEffect, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Rating } from "@mui/material";
import { Minus, Plus, Trash } from "lucide-react";
import { useInView } from "react-intersection-observer";

import { useDispatch } from "react-redux";
import { setCheckout } from "@/store/features/checkoutSlice";

import {
  changeQuantity,
  deleteCartItem,
  getAllCart,
  getQuantityCartItem,
} from "@/api/cart/cartRequest";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";

import { useToast } from "@/hooks/use-toast";

import DialogConfirmCart from "@/components/dialogs/dialogConfirmCart";
import { CartItemVariantSelector } from "./cartItemVariantSelector";

import ReviewEmpty from "@/assets/images/ReviewEmpty.png";
import StoreEmpty from "@/assets/images/storeEmpty.jpg";

import { useTranslations } from "next-intl";
import Loading from "@/components/loading";
import Link from "next/link";

export default function CartUser() {
  const [listCart, setListCart] = useState([]);
  const [nextPage, setNextPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loadPage, setLoadPage] = useState(true);
  const [loadListCart, setLoadListCart] = useState(false);
  const [selectedListCartItem, setSelectedListCartItem] = useState([]);
  const [cartItemToDelete, setCartItemToDelete] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [actionType, setActionType] = useState("");
  const [inputValues, setInputValues] = useState({});

  const pageSize = 4;
  const router = useRouter();
  const dispatch = useDispatch();
  const t = useTranslations("Cart");
  const listCartMapped = listCart.filter((cart) => cart.items.length > 0);

  const { ref: loadRef, inView } = useInView();
  const { toast } = useToast();

  const fetchAllCart = useCallback(
    async (isInitialLoad = false) => {
      setLoadListCart(true);
      try {
        if (!isInitialLoad) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        const response = await getAllCart(
          isInitialLoad ? 1 : nextPage,
          pageSize,
        );

        const newListCart = response.result.data;

        if (newListCart.length === 0) {
          setListCart([]);
          setNextPage(response.result.nextPage);
          setHasNext(response.result.hasNext);
        } else if (newListCart.length > 0) {
          setListCart((prevListCart) =>
            isInitialLoad ? newListCart : [...prevListCart, ...newListCart],
          );
          setNextPage(response.result.nextPage);
          setHasNext(response.result.hasNext);
        }
      } catch (error) {
        console.error("Error during fetchAllCart: ", error);
      } finally {
        setLoadListCart(false);
        setLoadPage(false);
      }
    },
    [nextPage],
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
      localStorage.getItem("listCartItemFromOrder") || "[]",
    );

    if (listCartItemFromOrder.length > 0 && listCart.length > 0) {
      const updatedSelectedListCartItem = listCartItemFromOrder
        .map((newItem) => {
          const allItems = listCart.flatMap((cart) => cart.items);

          const foundItem = allItems.find(
            (item) => String(item.id) === String(newItem.id),
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
          (selectedItem) => selectedItem.id !== cartItem.id,
        ),
      );
    }
  };

  const checkedCartItem = (cartItem) => {
    return (
      cartItem.available === true &&
      selectedListCartItem.some(
        (selectedItem) => selectedItem.id === cartItem.id,
      )
    );
  };

  const handleCheckedCart = (cart, isChecked) => {
    const availableListCartItem = cart.items.filter(
      (item) => item.available === true,
    );

    if (isChecked) {
      const newListCartItem = availableListCartItem.filter(
        (item) =>
          !selectedListCartItem.find(
            (selectedItem) => selectedItem.id === item.id,
          ),
      );
      setSelectedListCartItem([...selectedListCartItem, ...newListCartItem]);
    } else {
      setSelectedListCartItem(
        selectedListCartItem.filter(
          (selectedItem) =>
            !availableListCartItem.find((item) => item.id === selectedItem.id),
        ),
      );
    }
  };

  const checkedCart = (cart) => {
    const availableListCartItem = cart.items.filter(
      (item) => item.available === true,
    );

    return (
      availableListCartItem.length > 0 &&
      availableListCartItem.every((item) =>
        selectedListCartItem.some(
          (selectedItem) => selectedItem.id === item.id,
        ),
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
        [],
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
      0,
    );

    const selectedAvailableCartItem = selectedListCartItem.filter(
      (item) => item.available === true,
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
        (item) => item.available === true,
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

  const updateSelectedListCartItem = (cartItemId, quantityUpdate) => {
    setSelectedListCartItem((prevItems) =>
      prevItems.map((item) => {
        if (item.id === cartItemId) {
          return { ...item, quantity: quantityUpdate };
        }
        return item;
      }),
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
      })),
    );
  };

  const handleChangeQuantity = async (cartItemId, quantityUpdate) => {
    try {
      await changeQuantity(cartItemId, quantityUpdate);
      updateQuantityUI(cartItemId, quantityUpdate);
      updateSelectedListCartItem(cartItemId, quantityUpdate);
      toast({
        title: t("notify"),
        description: t("change_quantity_success"),
      });
    } catch (error) {
      toast({
        title: t("toast_title_update_fail"),
        description: t("text_insufficient_quantity"),
        variant: "destructive",
      });
    }
  };

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
        .filter((cart) => cart.items.length > 0),
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
          title: t("notify"),
          description: t("toast_description_delete_one", {
            productName: cartItemToDelete.name,
          }),
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
          prevItems.filter((item) => item.id !== cartItem.id),
        );
      } catch (error) {
        break;
      }
    }
    setActionType("");
    setOpenDialog(false);
    toast({
      title: t("notify"),
      description: t("toast_description_delete_list", {
        productLength: selectedListCartItem.length,
      }),
    });
  };

  const handleCheckout = () => {
    const selectedCartWithItem = listCart
      .map((cart) => ({
        ...cart,
        items: cart.items.filter((item) =>
          selectedListCartItem.some(
            (selectedItem) => selectedItem.id === item.id,
          ),
        ),
      }))
      .filter((cart) => cart.items.length > 0);
    if (selectedCartWithItem.length === 0) {
      toast({
        title: t("toast_title_fail"),
        description: t("toast_description_select_checkout"),
        variant: "destructive",
      });
    } else {
      const totalAmount = totalPriceAll(selectedListCartItem);

      if (totalAmount >= 1000000000) {
        toast({
          title: t("toast_title_fail"),
          description: t("toast_description_please_split_the_order"),
          variant: "destructive",
        });
        return;
      }
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

  return (
    <>
      <Toaster />
      {loadPage &&
        <div className="w-full h-fit min-h-screen">
          <Loading />
        </div >
      }

      {
        !loadPage && (
          <div className="w-full h-fit min-h-screen xl:px-28 lg:px-20 sm:px-6 px-4 pt-20 lg:pb-32 pb-48 bg-blue-tertiary">
            <div className="w-full h-full flex flex-col gap-3 shadow-md rounded-md p-3 bg-white-primary">
              <div className="flex justify-end items-center py-3">
                <span className="text-[1em]">{t("text_select_all")}</span>
                {hasCheckboxAll && (
                  <Checkbox
                    checked={checkedAll()}
                    className="mx-3 -translate-y-[2px]"
                    onCheckedChange={(checked) => handleCheckedAll(checked)}
                  />
                )}
              </div>

              <div className="w-full h-full flex flex-col gap-7">
                {listCartMapped.length > 0 &&
                  listCartMapped.map((cart, index) => (
                    <Card
                      key={index}
                      className="rounded-md shadow-sm animate-fade-in-up"
                    >
                      <CardTitle className="w-full h-fit p-3 flex flex-row items-center border-b">
                        <div className="w-fit pl-2 pr-4 flex items-center">
                          {hasCheckboxCart(cart) && (
                            <Checkbox
                              checked={checkedCart(cart)}
                              onCheckedChange={(checked) =>
                                handleCheckedCart(cart, checked)
                              }
                            />
                          )}
                        </div>

                        <Link
                          href={`/search?storeId=${cart.storeId}`}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <Image
                            alt={cart.storeName}
                            src={cart.avatarStore || StoreEmpty}
                            height={50}
                            width={50}
                            className="rounded-full object-cover aspect-square shadow-md"
                          />

                          <span className="text-[1.2em]">{cart.storeName}</span>

                          <Rating
                            value={cart.ratingStore}
                            precision={0.1}
                            readOnly
                          />
                        </Link>
                      </CardTitle>

                      <CardContent className="flex flex-col p-0">
                        {cart.items.length > 0 &&
                          cart.items.map((item) => (
                            <div
                              key={item.id}
                              className="w-full h-fit px-3 flex 2xl:flex-row flex-col items-center border-b"
                            >
                              <div className="2xl:w-1/2 w-full 2xl:border-none border-b lg:flex-row flex-col py-3 h-fit flex items-center">
                                <div className="w-full h-28 py-3 flex-1 flex items-center relative border-b lg:border-none">
                                  <div className="w-fit pl-2 pr-3 flex items-center">
                                    {hasCheckboxCartItem(item) && (
                                      <Checkbox
                                        checked={checkedCartItem(item)}
                                        onCheckedChange={(checked) =>
                                          handleCheckedCartItem(item, checked)
                                        }
                                      />
                                    )}
                                  </div>

                                  <Link
                                    href={`/${item.productSlug}`}
                                    className="lg:w-2/3 w-full h-fit flex items-start gap-3"
                                  >
                                    <Image
                                      alt={item.name}
                                      src={item.image || StoreEmpty}
                                      height={100}
                                      width={100}
                                      className="rounded-md shadow-md object-cover aspect-square"
                                    />

                                    <div className="flex flex-col gap-3 h-full items-start">
                                      <span className="text-[1.1em] line-clamp-2">
                                        {item.name}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <Image
                                          alt={item.brand}
                                          src={item.logoBrand || StoreEmpty}
                                          height={25}
                                          width={25}
                                          className="rounded-md object-cover aspect-square shadow-md"
                                        />
                                        <span className="text-[1em] text-muted-foreground">
                                          {item.brand}
                                        </span>
                                      </div>
                                    </div>

                                    {!hasCheckboxCartItem(item) && (
                                      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center rounded-md bg-white-primary bg-opacity-70">
                                        <span className="text-[1em] text-white-primary bg-black-primary py-3 px-5 rounded-md">
                                          {t("text_insufficient_quantity")}
                                        </span>
                                      </div>
                                    )}
                                  </Link>
                                </div>

                                <div className="lg:w-1/3 w-full px-3 h-28 py-3 flex flex-col justify-start gap-3 lg:border-l">
                                  <span className="text-[.9em] text-center w-full text-muted-foreground">
                                    {t("text_classification")}
                                  </span>

                                  <div className="flex items-center justify-between my-auto gap-2">
                                    <div className="flex flex-row flex-wrap gap-2">
                                      {item.value ? (
                                        item.value.map((value, index) => (
                                          <span
                                            key={index}
                                            className="text-[.9em] text-muted-foreground border rounded-sm shadow-sm px-2"
                                          >
                                            {value}
                                          </span>
                                        ))
                                      ) : (
                                        <span className="text-[.9em] text-muted-foreground">
                                          {t("text_nothing")}
                                        </span>
                                      )}
                                    </div>

                                    {item.value && (
                                      <CartItemVariantSelector
                                        cartItemId={item.id}
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="2xl:w-1/2 w-full flex flex-col lg:flex-row items-center">
                                <div className="lg:w-[60%] w-full h-28 py-3 flex flex-row">
                                  <div className="w-[50%] px-3 h-full flex flex-col justify-start items-center 2xl:border-l">
                                    <span className="text-[.9em] text-muted-foreground">
                                      {t("text_unit_price")}
                                    </span>

                                    <div className="w-full flex flex-col items-center my-auto">
                                      <span className="w-full text-center text-[1.2em] text-red-primary truncate">
                                        {formatCurrency(item.salePrice || 0)}
                                      </span>
                                      <span className="w-full text-center text-[1em] text-muted-foreground line-through">
                                        {formatCurrency(item.originalPrice || 0)}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="w-[50%] h-full px-3 flex flex-col justify-start items-center border-l">
                                    <span className="text-[.9em]  text-muted-foreground">
                                      {t("text_quantity")}
                                    </span>

                                    <div className="flex flex-row items-center justify-center gap-1 my-auto">
                                      <Button
                                        variant="outline"
                                        className="w-11 h-8"
                                        onClick={() => handleClickMinus(item)}
                                      >
                                        <Minus className="h-5 w-5" />
                                      </Button>

                                      <Input
                                        value={
                                          inputValues[item.id] ?? item.quantity
                                        }
                                        onChange={(e) =>
                                          handleOnChangeInput(
                                            item,
                                            e.target.value,
                                          )
                                        }
                                        onKeyDown={(e) =>
                                          handleOnKeyDownInput(item, e)
                                        }
                                        onBlur={(e) => handleOnBlurInput(item, e)}
                                        type="number"
                                        className="w-[70px] h-8 text-[1em] text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                      />

                                      <Button
                                        variant="outline"
                                        className="w-11 h-8"
                                        onClick={() => handleClickPlus(item)}
                                      >
                                        <Plus className="h-5 w-5" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>

                                <div className="lg:w-[40%] w-full lg:border-none border-t h-28 py-3 flex flex-row">
                                  <div className="lg:w-[80%] w-1/2 h-full flex flex-col items-center justify-between lg:border-l">
                                    <span className="text-[.9em] text-muted-foreground">
                                      {t("text_amount")}
                                    </span>
                                    <span className="w-full text-center text-[1.3em] text-red-primary truncate my-auto">
                                      {formatCurrency(
                                        item.quantity * item.salePrice || 0,
                                      )}
                                    </span>
                                  </div>

                                  <div className="lg:w-[20%] w-1/2 h-full pl-3 flex justify-center items-center border-l">
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
                            </div>
                          ))}
                      </CardContent>

                      <CardFooter className="w-full bg-re h-fit p-3 flex flex-row items-center justify-end gap-3">
                        <span className="text-[.9em] text-muted-foreground">
                          {t("text_savings")}
                        </span>
                        <span className="text-[1em]">
                          {formatCurrency(totalSavingsOneCart(cart.items) || 0)}
                        </span>
                      </CardFooter>
                    </Card>
                  ))}

                {!loadPage && listCartMapped.length === 0 && (
                  <div className="min-h-screen flex items-center justify-center">
                    <Image
                      alt="Empty Image"
                      src={ReviewEmpty}
                      width={300}
                      height={300}
                    />
                  </div>
                )}

                {loadListCart && <Loading />}

                {!loadListCart && hasNext && (
                  <div
                    ref={loadRef}
                    className="absolute bottom-0 w-full h-16"
                  ></div>
                )}
              </div>
            </div>

            <div className="w-full h-fit xl:px-28 lg:px-20 sm:px-6 px-4 fixed bottom-0 left-0">
              <div className="w-full h-fit flex flex-row gap-2 flex-wrap justify-between items-center py-4 px-3 rounded-t-md shadow-md bg-black-primary">
                <div className="w-fit flex flex-row gap-3 items-center">
                  <Button
                    variant="outline"
                    onClick={() => handleCheckedAll(!checkedAll())}
                  >
                    {t("text_select_all")} ({countTotalProduct(listCart)})
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleClickDeleteAll()}
                  >
                    {t("text_delete")} ({selectedListCartItem.length})
                  </Button>
                </div>
                <div className="flex flex-row flex-wrap items-center text-white-primary">
                  <span className="text-[1em] px-3 border-l">
                    {t("text_savings")}:{" "}
                    {formatCurrency(
                      totalSavingsListCartItem(selectedListCartItem) || 0,
                    )}
                  </span>

                  <div className="flex items-center gap-1 px-3 border-l">
                    <span className="text-[1em]">
                      {t("text_total_payment")} ({selectedListCartItem.length}{" "}
                      {t("text_product_lower")}):
                    </span>
                    <span className="text-[1.3em]">
                      {formatCurrency(totalPriceAll(selectedListCartItem) || 0)}
                    </span>
                  </div>
                </div>

                <Button
                  className="flex-grow min-w-[250px] bg-red-primary hover:bg-red-primary/90 rounded-md text-[1em]"
                  onClick={() => handleCheckout()}
                >
                  {t("text_checkout")}
                </Button>
              </div>
            </div>
          </div>
        )
      }

      {
        openDialog && (
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
        )
      }
    </>
  );
}
