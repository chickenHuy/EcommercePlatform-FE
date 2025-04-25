"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BaggageClaim, MessageCircle, StoreIcon, Wallet } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import VnPay from "@/assets/images/vnpay.png";
import { Separator } from "@/components/ui/separator";
import EmptyImage from "@/assets/images/brandEmpty.jpg";
import { Textarea } from "@/components/ui/textarea";
import { checkoutOrders } from "@/api/user/checkout";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";

export default function CheckoutContent(props) {
  const route = useRouter();
  const { stores, selectedAddress, t } = props;
  const calculateSubtotal = (data) => {
    let subtotal = 0;
    data.forEach((store) => {
      store.items.forEach((item) => {
        subtotal += item.originalPrice * item.quantity;
      });
    });
    return subtotal;
  };

  const calculateDiscount = (data) => {
    let discount = 0;
    data.forEach((store) => {
      store.items.forEach((item) => {
        discount += (item.originalPrice - item.salePrice) * item.quantity;
      });
    });
    return discount;
  };

  const subtotal = calculateSubtotal(stores);
  const shippingFee = 24000 * stores.length;
  const discount = calculateDiscount(stores);
  const [onSubmit, setOnSubmit] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const total = subtotal + shippingFee - discount;
  const [note, setNote] = useState("");

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  const handleSubmit = async (e) => {
    if (onSubmit) return;
    setOnSubmit(true);
    if (selectedAddress === undefined) {
      return toast({
        title: t("toast_title_select_address"),
        variant: "destructive",
      });
    }
    console.log("selectedAddress", selectedAddress);
    const orderData = {
      addressId: selectedAddress.id,
      paymentMethod: paymentMethod,
      orders: stores.map((store) => ({
        storeId: store.storeId,
        shippingFee: 24000,
        orderItems: store.items.map((product) => ({
          cartItemId: product.id,
          productId: product.productId,
          variantId: product.variantId,
          quantity: product.quantity,
          salePrice: product.salePrice,
          originalPrice: product.originalPrice,
        })),
      })),
      note: note,
    };

    try {
      const res = await checkoutOrders(orderData);
      if (paymentMethod === "VN_PAY") {
        window.location.href = res.result.paymentUrl;
      } else {
        route.push(`/status/${res.result.paymentId}`);
      }
    } catch (error) {
      setOnSubmit(false);
      toast({
        title: t("toast_title_error_order"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Toaster />
      <div className="space-y-6 p-4 rounded-xl  bg-gradient-to-br from-[#ffffff] via-[#a40b0b] to-[#f64a4a] bg-opacity-5">
        <span className="text-2xl p-4 font-semibold">{t("text_product")}</span>
        {stores.map((store) => (
          <Card key={store.storeId} className="rounded p-0">
            <CardHeader className="flex-row items-center gap-4 pb-2">
              <StoreIcon className="h-6 w-6 text-red-primary">Hot</StoreIcon>
              <h3 className="text-lg font-semibold">{store.storeName}</h3>
            </CardHeader>
            <Separator className="mx-autow-full my-2" />
            <CardContent>
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4">
                <div className="font-medium">{t("text_product")}</div>
                <div className="text-right font-medium">{t("text_unit_price")}</div>
                <div className="text-right font-medium">{t("text_quantity")}</div>
                <div className="text-right font-medium">{t("text_total")}</div>

                {store.items.map((product) => (
                  <React.Fragment key={product.id}>
                    <div className="flex items-start gap-4">
                      <Image
                        src={product.image || EmptyImage}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="rounded-md"
                      />
                      <div className="space-y-1">
                        <h4 className="font-medium">{product.name}</h4>
                        {product.value ? (
                          <p className="text-sm text-muted-foreground">
                            {t("text_classification")}: {product.value.join(" | ")}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <div className="text-right text-gray-tertiary">
                      ₫{product.salePrice.toLocaleString()}
                    </div>
                    <div className="text-right">{product.quantity}</div>
                    <div className="text-right">
                      ₫{(product.salePrice * product.quantity).toLocaleString()}
                    </div>
                  </React.Fragment>
                ))}

                <div className="col-span-4 border-t pt-4">
                  <div className="flex items-start gap-2">
                    <BaggageClaim id="insurance" />
                    <div className="grid gap-1.5">
                      <p className="text-sm text-muted-foreground">
                        {t("text_shipping_method")}{" "}
                        <span className="text-red-primary hover:underline">
                          {t("text_basic")}
                        </span>
                      </p>
                    </div>
                    <div className="ml-auto text-right">₫24.000</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-6 px-4 pt-4 shadow-none">
        <Card>
          <CardTitle className="m-4 flex items-center ">
            <MessageCircle
              className="h-6 w-6 text-black-primary m-
                        2"
            ></MessageCircle>
            <span>{t("text_note")}</span>
          </CardTitle>
          <CardContent className="">
            <Textarea
              className="bg-blue-primary min-h-[100px] bg-opacity-15 font-light"
              value={note}
              onChange={(e) => handleNoteChange(e)}
              placeholder={t("text_enter_note")}
            ></Textarea>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6 p-4">
        <Card className="shadow-none">
          <CardContent className="pt-6">
            <div className="flex items-center mb-4">
              <Wallet className="h-6 w-6 text-black-primary"></Wallet>
              <h3 className="text-lg font-medium ml-2">
                {t("text_payment_method")}
              </h3>
            </div>
            <RadioGroup
              defaultValue="COD"
              onValueChange={setPaymentMethod}
              className="space-y-4"
            >
              <div className="flex items-center space-x-4 rounded-lg border p-4">
                <RadioGroupItem value="COD" id="cod" />
                <Label htmlFor="cod" className="flex-1 cursor-pointer">
                  {t("text_cash_on_delivery")}
                </Label>
                {paymentMethod === "COD" && (
                  <div className="text-sm text-muted-foreground">
                    {t("text_note_payment_method")}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4 rounded-lg border p-4">
                <RadioGroupItem value="VN_PAY" id="vnpay" />
                <Label htmlFor="vnpay" className="flex-1 cursor-pointer">
                  {t("text_VN_PAY")}
                </Label>
                {paymentMethod === "VN_PAY" && (
                  <Image
                    src={VnPay}
                    alt="VN PAY"
                    width={60}
                    height={40}
                    className="ml-auto"
                  />
                )}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="space-y-4 px-4 bg-white-primary border-0 rounded-t-xl border-b-[4px] border-red-primary p-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("text_total_price")}</span>
            <span>₫{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {t("text_total_shipping_cost")}
            </span>
            <span>₫{shippingFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {t("text_total_discount_voucher")}
            </span>
            <span className="text-red-primary">
              -₫{discount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-lg font-medium">
            <span>{t("text_total_payment")}</span>
            <span className="text-red-primary">₫{total.toLocaleString()}</span>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {t("text_message_confirm_click")}{" "}
            <a href="#" className="text-primary hover:underline">
              {t("text_HKK_Uptech_terms")}
            </a>
          </p>
          <Button
            className="w-full"
            size="lg"
            onClick={(e) => handleSubmit(e)}
            disabled={onSubmit}
          >
            {onSubmit ? t("text_processing") : t("text_place_order")}
          </Button>
        </div>
      </div>
    </div>
  );
}
