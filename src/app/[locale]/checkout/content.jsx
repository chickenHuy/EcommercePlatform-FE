"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  BaggageClaim,
  MessageCircle,
  StoreIcon,
  Wallet,
  ShoppingCart,
  Truck,
  CreditCard,
  FileText,
  CheckCircle
} from "lucide-react";
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

const ProductItem = ({ product, t }) => (
  <div className="rounded-md border p-3">
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-shrink-0">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto sm:mx-0">
          <Image
            src={product.image || EmptyImage}
            alt={product.name}
            fill
            className="rounded-md object-cover"
          />
        </div>
      </div>

      <div className="flex-grow space-y-2">
        <h4 className="line-clamp-2 text-[.9em] sm:text-[1em]">
          {product.name}
        </h4>

        {product.value && (
          <p className="text-[.9em] border px-2 py-1 rounded-lg inline-block">
            {t("text_classification")}: {product.value.join(" | ")}
          </p>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2">
          <div className="flex items-center gap-3">
            <span className="text-[1.1em]">
              ₫{product.salePrice.toLocaleString()}
            </span>
            <span className="text-[.9em]">
              x{product.quantity}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[1.3em] text-red-primary">
              ₫{(product.salePrice * product.quantity).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const StoreSection = ({ store, t }) => (
  <Card className="overflow-hidden border-0 p-0 animate-fade-in">
    <CardHeader className="bg-black-primary p-3 text-white-primary">
      <div className="flex items-center gap-3">
        <div className="relative w-14 h-14 sm:w-16 sm:h-16">
          <Image
            src={store.avatarStore || EmptyImage}
            alt={store.storeName}
            fill
            className="rounded-md object-cover"
          />
        </div>
        <div>
          <CardTitle className="text-[1.1em]">{store.storeName}</CardTitle>
          <p className="text-[.9em]">{store.items.length} sản phẩm</p>
        </div>
      </div>
    </CardHeader>

    <CardContent className="p-3">
      <div className="space-y-3">
        {store.items.map((product) => (
          <ProductItem key={product.id} product={product} t={t} />
        ))}

        <div className="rounded-md p-3 border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <BaggageClaim />
              </div>
              <div>
                <p className="text-[1em]">{t("text_shipping_method")}</p>
                <p className="text-[1em] text-muted-foreground">{t("text_basic")}</p>
              </div>
            </div>
            <span className="text-[1em]">₫24.000</span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const NoteSection = ({ note, onNoteChange, t }) => (
  <Card className="border-0 rounded-md shadow-md animate-fade-in">
    <CardHeader className="p-3 rounded-t-md bg-black-primary text-white-primary">
      <CardTitle className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center">
          <MessageCircle />
        </div>
        <span className="text-[1em]">{t("text_note")}</span>
      </CardTitle>
    </CardHeader>
    <CardContent className="p-3">
      <Textarea
        className="min-h-[100px] resize-none text-[.9em]"
        value={note}
        onChange={onNoteChange}
        placeholder={t("text_enter_note")}
      />
    </CardContent>
  </Card>
);

const PaymentMethodSection = ({ paymentMethod, setPaymentMethod, t }) => (
  <Card className="border-0 p-0 shadow-md rounded-md animate-fade-in">
    <CardHeader className="p-3 rounded-t-md bg-black-primary text-white-primary">
      <CardTitle className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center">
          <Wallet />
        </div>
        <span className="text-lg">{t("text_payment_method")}</span>
      </CardTitle>
    </CardHeader>
    <CardContent className="p-3">
      <RadioGroup
        value={paymentMethod}
        onValueChange={setPaymentMethod}
        className="space-y-1 p-0"
      >
        <div className={`relative rounded-md border-2 p-4 cursor-pointer transition-all duration-200 ${paymentMethod === "COD"
          ? "border-black-primary"
          : ""
          }`}>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="COD" id="cod" />
            <Label htmlFor="cod" className="flex-1 cursor-pointer text-[1em]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center">
                  <Truck />
                </div>
                <span>{t("text_cash_on_delivery")}</span>
              </div>
            </Label>
          </div>
          {paymentMethod === "COD" && (
            <div className="text-[.9em] text-muted-foreground">
              {t("text_note_payment_method")}
            </div>
          )}
        </div>

        <div className={`relative rounded-md border-2 p-4 cursor-pointer transition-all duration-200 ${paymentMethod === "VN_PAY"
          ? "border-black-primary"
          : ""
          }`}>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="VN_PAY" id="vnpay" />
            <Label htmlFor="vnpay" className="flex-1 cursor-pointer text-[1em]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <CreditCard />
                  </div>
                  <span>{t("text_VN_PAY")}</span>
                </div>
                {paymentMethod === "VN_PAY" && (
                  <Image
                    src={VnPay}
                    alt="VN PAY"
                    width={100}
                    height={100}
                    className="rounded-sm"
                  />
                )}
              </div>
            </Label>
          </div>
        </div>
      </RadioGroup>
    </CardContent>
  </Card>
);

const OrderSummary = ({ subtotal, shippingFee, discount, total, t }) => (
  <Card className="border-0 shadow-md rounded-md p-0">
    <CardHeader className="p-3 rounded-t-md bg-black-primary text-white-primary">
      <CardTitle className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center">
          <FileText />
        </div>
        <span className="text-[1em]">{t("text_payment_detail")}</span>
      </CardTitle>
    </CardHeader>
    <CardContent className="p-3">
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2">
          <span className="text-[1em]">{t("text_total_price")}</span>
          <span className="text-[1em]">₫{subtotal.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-[1em]">{t("text_total_shipping_cost")}</span>
          <span className="text-[1em]">₫{shippingFee.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-[1em]">{t("text_total_discount_voucher")}</span>
          <span className="text-[1em]">-₫{discount.toLocaleString()}</span>
        </div>

        <Separator />

        <div className="flex justify-between items-center py-3">
          <span className="text-[1.1em]">{t("text_total_payment")}</span>
          <span className="text-[1.1em] text-red-primary">₫{total.toLocaleString()}</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

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
  const total = subtotal + shippingFee - discount;

  const [onSubmit, setOnSubmit] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [note, setNote] = useState("");

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  const handleSubmit = async (e) => {
    if (onSubmit) return;
    setOnSubmit(true);

    if (selectedAddress === undefined) {
      setOnSubmit(false);
      return toast({
        title: t("toast_title_select_address"),
        variant: "destructive",
      });
    }

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
    <>
      <Toaster />

      <div className="w-full h-fit">
        <div className="my-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <ShoppingCart />
            </div>
            <h1 className="text-[1.3em] sm:text-[1.5em]">
              {t("text_product")}
            </h1>
          </div>
        </div>

        <div className="space-y-7">
          <div className="space-y-3">
            {stores.map((store) => (
              <StoreSection key={store.storeId} store={store} t={t} />
            ))}
          </div>

          <NoteSection
            note={note}
            onNoteChange={handleNoteChange}
            t={t}
          />

          <PaymentMethodSection
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            t={t}
          />

          <OrderSummary
            subtotal={subtotal}
            shippingFee={shippingFee}
            discount={discount}
            total={total}
            t={t}
          />

          <Card className="border-0 shadow-md rounded-md p-0">
            <CardContent className="p-3">
              <div className="space-y-3">
                <p className="text-[.9em]">
                  {t("text_message_confirm_click")}{" "}
                  <a href="#" className="text-[.9em] text-red-primary underline">
                    {t("text_HKK_Uptech_terms")}
                  </a>
                </p>

                <Button
                  className="w-full relative"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={onSubmit}
                >
                  {onSubmit ? (
                    <div className="global_loading_icon white">
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5" />
                      {t("text_place_order")}
                    </div>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}