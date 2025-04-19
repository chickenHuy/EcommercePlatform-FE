"use client";

import { useCallback, useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useTranslations } from "next-intl";

export default function Component() {
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isDialogConfirmOpen, setIsDialogConfirmOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const t = useTranslations("User.address");

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
        title: t("toast_success"),
        description: t("toast_description_set_default"),
        variant: "success",
      });
      fetchAddresses();
    } catch (error) {
      toast({
        title: t("toast_error"),
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
        title: t("toast_success"),
        description: t("toast_description_delete", {
          address: `${addressToDelete.first_line} ${addressToDelete.second_line}`,
        }),
      });
      fetchAddresses();
    } catch (error) {
      toast({
        title: t("toast_error"),
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
            <h1 className="text-2xl font-bold">{t("title")}</h1>
            <Button
              onClick={() => {
                setSelectedId(null);
                setShowAddressForm(true);
              }}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              {t("button_add_new")}
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
                          {t("button_update")}
                        </Button>
                        {!is_default && (
                          <Button
                            variant="outline"
                            onClick={() => handleDeleteClick(address)}
                          >
                            {t("button_delete")}
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
                                {t("text_is_default")}
                              </span>
                            )}
                            {is_store_address && (
                              <>
                                <span
                                  className="text-sm text-red-primary border shadow-sm px-3 py-2 rounded-sm"
                                >
                                  {t("text_store_pickup")}
                                </span>
                                <span
                                  className="text-sm text-red-primary border shadow-sm px-3 py-2 rounded-sm"
                                >
                                  {t("text_store_return")}
                                </span>
                              </>
                            )}
                          </div>
                          {!is_default && (
                            <Button
                              onClick={() => handleSetDefault(id)}
                            >
                              {t("text_set_default")}
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
            tableName={t("tableName")}
            objectName={`${addressToDelete.first_line} ${addressToDelete.second_line}`}
          />
        )}
      </div>
    )
  );
}
