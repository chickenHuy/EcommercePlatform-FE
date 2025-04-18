"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Rating } from "@mui/material";
import { getStoreByUserId, updateStore } from "@/api/vendor/storeRequest";
import CbbAddresses from "./cbbDefaultAddress";
import { Toaster } from "@/components/ui/toaster";
import { useTranslations } from "next-intl";
import AddressForm from "@/components/dialogs/dialogEditAddress";


export default function ManageStoreInfo() {
  const [store, setStore] = useState([]);
  const [defaultAddressToUpdate, setDefaultAddressToUpdate] = useState(null);
  const [addressError, setAddressError] = useState("");
  const t = useTranslations("VendorStoreInfo");
  const { toast } = useToast();
  const [isOpenDialogAddredd, setIsOpenDialogAddredd] = useState(false);
  const [isAddNewAddress, setIsAddNewAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const storeSchema = z.object({
    name: z.string().trim().min(1, {
      message: t('store_name_required'),
    }),
    bio: z.string().nullable(),
  });

  const formData = useForm({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
      bio: "",
    },
  });

  const fetchStoreByUserId = useCallback(async () => {
    try {
      const response = await getStoreByUserId();
      setStore(response.result);
      formData.reset(response.result);

      if (response.result.defaultAddress === null) {
        setDefaultAddressToUpdate({
          defaultAddressStr: t('select_pickup_address'),
          defaultAddressId: null,
        });
      } else {
        setDefaultAddressToUpdate({
          defaultAddressStr: response.result.defaultAddress,
          defaultAddressId: null,
        });
      }
    } catch (error) {
      toast({
        title: t('notify'),
        description: error.message,
        variant: "destructive",
      });
    }
  }, [toast, formData]);

  useEffect(() => {
    fetchStoreByUserId();
  }, [fetchStoreByUserId]);

  const handleUpdate = async (storeData) => {
    console.log(defaultAddressToUpdate);
    if (!defaultAddressToUpdate?.defaultAddressId) {
      setAddressError(t('select_address_error'));
      return;
    }
    setAddressError("");
    const payload = {
      ...storeData,
      bio:
        storeData.bio && storeData.bio.trim() === ""
          ? null
          : storeData.bio?.trim(),
      defaultAddressId: defaultAddressToUpdate?.defaultAddressId,
    };
    try {
      setIsSubmitting(true);
      await updateStore(payload);
      toast({
        title: t('notify'),
        description: t('update_success'),
      });
      fetchStoreByUserId();
    } catch (error) {
      toast({
        title: t('notify'),
        description: error.message,
        variant: "destructive",
      });
    }
    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full pt-24 xl:px-10 px-5">
      <Toaster />
      <Card className="shadow-lg rounded-lg text-[1em]">
        <CardHeader className="w-2/3 text-center border-b py-5 mx-auto">
          <CardTitle className="text-[1.5em] font-[900]">{t('store_profile')}</CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex flex-col items-center gap-7">
          <form
            onSubmit={formData.handleSubmit(handleUpdate)}
            className="w-full"
          >
            <div className="pt-7 pb-14 space-y-4">
              <div className="flex flex-col space-y-2">
                <span>{t('store_name')}</span>
                <Input
                  {...formData.register("name")}
                  placeholder={t('store_name_placeholder')}
                  className="w-full h-12 p-3 text-[1em]"
                />
                {formData.formState.errors.name && (
                  <p className="text-sm text-red-primary col-start-2 col-span-3 px-3">
                    {formData.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <span>{t('bio')}</span>
                <Textarea
                  {...formData.register("bio")}
                  placeholder={t('bio_placeholder')}
                  className="w-full h-48 p-3 text-[1em]"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <span>{t('store_rating')}</span>
                  <span className="px-2 py-[3px] bg-black-secondary rounded-md text-white-primary shadow-sm shadow-black-secondary">{store?.rating ? store?.rating.toFixed(1) : "0.0"}</span>
                  <Rating
                    value={store?.rating ? store?.rating : 0}
                    precision={0.1}
                    readOnly
                  ></Rating>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span>{t('total_products')}</span>
                  <span className="px-2 py-[3px] bg-black-secondary rounded-md text-white-primary shadow-sm shadow-black-secondary">{store?.totalProduct ? store?.totalProduct : 0} {t('total_products_value')}</span>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <span>{t('pickup_address_list')}</span>
                <div className="flex lg:flex-row flex-col justify-between items-center gap-3">
                  <CbbAddresses
                    isAddNewAddress={isAddNewAddress}
                    setIsAddNewAddress={setIsAddNewAddress}
                    defaultAddressToUpdate={defaultAddressToUpdate}
                    onAddressSelect={setDefaultAddressToUpdate}
                  />
                  <Button onClick={() => setIsOpenDialogAddredd(!isOpenDialogAddredd)} >{t('add_new_address')}</Button>
                </div>
                {addressError && (
                  <p className="px-3 text-sm text-red-primary col-start-2 col-span-3">
                    {addressError}
                  </p>
                )}
              </div>
            </div>
            <div className="border-t px-6 py-4 flex justify-center">
              <Button type="submit" className="text-[1.1em] font-bold w-1/3 min-w-[200px] h-10 shadow-sm shadow-black-secondary relative">
                {isSubmitting ? (
                  <div className="global_loading_icon white"></div>
                ) : t('update_button')}
              </Button>
            </div>
          </form>
        </CardContent>
        <AddressForm open={isOpenDialogAddredd} onOpenChange={setIsOpenDialogAddredd} setIsAddNewAddress={setIsAddNewAddress} />
      </Card>
    </div>
  );
}
