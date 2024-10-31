"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Rating } from "@mui/material";
import { getStore, updateStore } from "@/api/vendor/storeRequest";
import CbbAddresses from "./cbbDefaultAddress";
import { Toaster } from "@/components/ui/toaster";

const storeSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Họ và tên không được để trống",
  }),
  bio: z.string().trim(),
});

export default function ManageStoreInfo() {
  const [store, setStore] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const { toast } = useToast();

  const formData = useForm({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
      bio: "",
    },
  });

  const fetchStore = useCallback(async () => {
    try {
      const response = await getStore();
      setStore(response.result);
      formData.reset(response.result);
      if (response.result.defaultAddress) {
        const defaultAddress = response.result.defaultAddress;
        setSelectedAddress({
          defaultAddressStr: defaultAddress,
          defaultAddressId: response.result.defaultAddressId,
        });
      }
    } catch (error) {
      console.error("fetchStore thất bại: ", error);
      toast({
        title: "Thất bại",
        description: "Xảy ra lỗi khi lấy thông tin cửa hàng",
        variant: "destructive",
      });
    }
  }, [toast, formData]);

  useEffect(() => {
    fetchStore();
  }, [fetchStore]);

  const handleUpdate = async (storeData) => {
    const payload = {
      ...storeData,
      bio: storeData.bio.trim() === "" ? null : storeData.bio.trim(),
      defaultAddressId: selectedAddress?.defaultAddressId,
    };
    console.log("Payload: ", payload);
    try {
      const userId = "acc3420c-5db5-481e-b2e7-761cad8263d5";
      const updated = await updateStore(userId, payload);
      toast({
        title: "Thành công",
        description: "Thông tin cửa hàng đã được cập nhật",
      });
      setStore(updated.result);
      fetchStore();
    } catch (error) {
      toast({
        title: "Thất bại",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-lg rounded-lg">
      <Toaster />
      <CardHeader className="text-center border-b py-6">
        <CardTitle className="text-2xl font-bold">Hồ sơ cửa hàng</CardTitle>
      </CardHeader>
      <CardContent className="p-6 flex flex-col items-center gap-6">
        <form
          onSubmit={formData.handleSubmit(handleUpdate)}
          className="w-full space-y-4"
        >
          <div>
            <Label htmlFor="name" className="block text-sm font-medium">
              Tên cửa hàng
            </Label>
            <div className="w-full space-y-2">
              <Input
                {...formData.register("name")}
                placeholder="họ và tên"
                className="mt-1 w-full border rounded-lg p-2"
              />
              {formData.formState.errors.name && (
                <p className="text-sm text-error col-start-2 col-span-3">
                  {formData.formState.errors.name.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="bio" className="block text-sm font-medium">
              Bio
            </Label>
            <Textarea
              {...formData.register("bio")}
              placeholder="bio"
              className="mt-1 w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="rating" className="block text-sm font-medium">
                Đánh giá
              </Label>
              <span>({store?.rating ? store?.rating.toFixed(1) : "0.0"})</span>
            </div>
            <Rating
              value={store?.rating ? store?.rating : 0}
              precision={0.1}
              readOnly
            ></Rating>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <Label
                htmlFor="totalProduct"
                className="block text-sm font-medium"
              >
                Tổng số sản phẩm :
              </Label>
              <p>{store?.totalProduct ? store?.totalProduct : 0}</p>
            </div>
          </div>

          <div>
            <Label
              htmlFor="defaultAddressId"
              className="block text-sm font-medium"
            >
              Địa chỉ mặc định
            </Label>
            <CbbAddresses
              selectedAddress={selectedAddress}
              onAddressSelect={setSelectedAddress}
            />
          </div>

          <div className="border-t px-6 py-4 flex justify-center">
            <Button type="submit" className="text-xl font-bold">
              Lưu
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
