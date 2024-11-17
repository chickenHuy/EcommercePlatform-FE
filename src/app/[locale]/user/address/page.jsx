"use client";

import { Plus, PlusCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddressForm from "@/components/dialogs/dialogEditAddress";
import { Toaster } from "@/components/ui/toaster";
import {
  deleteAddress,
  getAddresses,
  setDefaultAddress,
} from "@/api/user/addressRequest";
import { toast } from "@/hooks/use-toast";
import Loading from "@/components/loading";

export default function Component() {
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const currentPage = 1;
  const itemsPerPage = 10;
  const [id, setId] = useState(null);
  const handleDefaultAddress = (id) => {
    setDefaultAddress(id)
      .then((response) => {
        toast({
          title: "Thành công",
          description: "Thay đổi địa chỉ mặt định thành công",
          variant: "success",
        });
        fetchAddresses();
      })
      .catch((error) => {
        toast({
          title: "Thất bại",
          description: error.message,
          variant: "destructive",
        });
      });
  };

  const handleDeleteAddress = (id) => {
    deleteAddress(id)
      .then((response) => {
        toast({
          title: "Thành công",
          description: "Xóa địa chỉ thành công",
          variant: "success",
        });
        fetchAddresses();
      })
      .catch((error) => {
        toast({
          title: "Thất bại",
          description: error.message,
          variant: "destructive",
        });
      });
  };

  const fetchAddresses = useCallback(async () => {
    try {
      const response = await getAddresses(currentPage, itemsPerPage);
      setAddresses(response.result.data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
    }
  }, [currentPage]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses, showAddressForm]);

  return (
    <div className="container mx-auto p-4">
      <Toaster className="z-50" />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Địa chỉ của tôi</h1>
        <Button
          onClick={() => {
            setId(null);
            setShowAddressForm(true);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Thêm địa chỉ mới
        </Button>
      </div>
      <div className="grid gap-4">
        {addresses.length === 0 ? (
          <Loading />
        ) : (
          addresses.map((address) => (
            <Card key={address.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="">
                  {address.recipient_name} <span>({address.phone})</span>
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="link"
                    onClick={() => {
                      setId(address?.id);
                      setShowAddressForm(true);
                    }}
                  >
                    Cập nhật
                  </Button>
                  {!address.isDefault && (
                    <Button
                      variant="link"
                      onClick={() => {
                        handleDeleteAddress(address?.id);
                      }}
                    >
                      Xóa
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-sm">{address.first_line}</p>
                  <p className="text-sm">{address.second_line}</p>
                  <div className="mt-2 flex flex-wrap gap-2 justify-between">
                    <div>
                      {address.is_default && (
                        <Badge
                          variant="secondary"
                          className="border-[#151010] text-[#D95040] m-2"
                        >
                          Mặc định
                        </Badge>
                      )}
                      {address.is_store_address && (
                        <>
                          <Badge variant="outline" className="m-2">
                            Địa chỉ lấy hàng
                          </Badge>
                          <Badge variant="outline" className="m-2">
                            Địa chỉ trả hàng
                          </Badge>
                        </>
                      )}
                    </div>
                    {!address.is_default && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-2 mr-4"
                        onClick={() => handleDefaultAddress(address.id)}
                      >
                        Thiết lập mặc định
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      <AddressForm
        open={showAddressForm}
        onOpenChange={setShowAddressForm}
        id={id}
      />
    </div>
  );
}
