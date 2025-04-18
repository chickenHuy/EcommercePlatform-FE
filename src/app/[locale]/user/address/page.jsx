"use client";

import { useCallback, useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import Loading from "@/components/loading";
import AddressForm from "@/components/dialogs/dialogEditAddress";
import DialogConfirm from "@/components/dialogs/dialogConfirm";

import {
  deleteAddress,
  getAddresses,
  setDefaultAddress,
} from "@/api/user/addressRequest";
import { toast } from "@/hooks/use-toast";

export default function Component() {
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isDialogConfirmOpen, setIsDialogConfirmOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  const fetchAddresses = useCallback(async () => {
    try {
      const response = await getAddresses(1, 10);
      setAddresses(response.result.data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses, showAddressForm]);

  const handleSetDefault = async (id) => {
    try {
      await setDefaultAddress(id);
      toast({
        title: "Thành công",
        description: "Thay đổi địa chỉ mặc định thành công",
        variant: "success",
      });
      fetchAddresses();
    } catch (error) {
      toast({
        title: "Thất bại",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (address) => {
    setAddressToDelete(address);
    setIsDialogConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!addressToDelete) return;
    try {
      await deleteAddress(addressToDelete.id);
      toast({
        title: "Thành công",
        description: `Địa chỉ "${addressToDelete.first_line} + ${addressToDelete.second_line}" đã được xóa thành công`,
      });
      fetchAddresses();
    } catch (error) {
      toast({
        title: "Thất bại",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setAddressToDelete(null);
      setIsDialogConfirmOpen(false);
    }
  };

  return (

    addresses.length === 0 ? (
      <div className="w-full h-fit lg:pl-[300px]">
        <Loading />
      </div>
    ) : (
      <div className="w-full h-fit lg:pl-[300px] flex justify-center items-center">
        <Toaster className="z-50" />
        <div className="min-w-[350px] w-[95%] px-5 py-10 shadow-xl rounded-xl flex flex-col items-center justify-between gap-5">
          <div className="w-full flex flex-row justify-between items-center">
            <h1 className="text-2xl font-bold">Địa chỉ của tôi</h1>
            <Button
              onClick={() => {
                setSelectedId(null);
                setShowAddressForm(true);
              }}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm địa chỉ mới
            </Button>
          </div>
          <div className="w-full grid gap-4">
            {
              addresses?.map((address) => {
                const {
                  id,
                  recipient_name,
                  phone,
                  first_line,
                  second_line,
                  is_default,
                  is_store_address,
                } = address;

                return (
                  <Card key={id}>
                    <CardHeader className="flex flex-col lg:flex-row items-start justify-between pb-0">
                      <CardTitle>
                        {recipient_name} <span>({phone})</span>
                      </CardTitle>
                      <div className="flex flex-row justify-end w-full lg:w-fit gap-2">
                        <Button
                          onClick={() => {
                            setSelectedId(id);
                            setShowAddressForm(true);
                          }}
                        >
                          Cập nhật
                        </Button>
                        {!is_default && (
                          <Button
                            variant="outline"
                            onClick={() => handleDeleteClick(address)}
                          >
                            Xóa
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        <p className="text-sm">{first_line}</p>
                        <p className="text-sm">{second_line}</p>
                        <div className="pt-2 flex flex-wrap justify-start">
                          <div>
                            {is_default && (
                              <span
                                className="text-sm text-red-primary border shadow-sm px-3 py-2 rounded-sm"
                              >
                                Mặc định
                              </span>
                            )}
                            {is_store_address && (
                              <>
                                <span
                                  className="text-sm text-red-primary border shadow-sm px-3 py-2 rounded-sm"
                                >
                                  Địa chỉ lấy hàng
                                </span>
                                <span
                                  className="text-sm text-red-primary border shadow-sm px-3 py-2 rounded-sm"
                                >
                                  Địa chỉ trả hàng
                                </span>
                              </>
                            )}
                          </div>
                          {!is_default && (
                            <Button
                              onClick={() => handleSetDefault(id)}
                            >
                              Thiết lập mặc định
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            }
          </div>
        </div>

        <AddressForm
          open={showAddressForm}
          onOpenChange={setShowAddressForm}
          id={selectedId}
        />

        {isDialogConfirmOpen && addressToDelete && (
          <DialogConfirm
            isOpen={isDialogConfirmOpen}
            onClose={() => setIsDialogConfirmOpen(false)}
            onConfirm={confirmDelete}
            tableName="địa chỉ"
            objectName={`${addressToDelete.first_line} + ${addressToDelete.second_line}`}
          />
        )}
      </div>
    )
  );
}
