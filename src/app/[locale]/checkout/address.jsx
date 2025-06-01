"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { getAddresses } from "@/api/user/addressRequest";
import { useCallback, useState, useEffect } from "react";
import ListAddress from "./listAddressPopup";

export default function Address(props) {

    const [addresses, setAddresses] = useState(null);
    const { defaultAddress, setDefaultAddress, t } = props;
    const page = 1;
    const itemsPerPage = 10;
    const [hasNew, setHasNew] = useState(false);
    const fetchAddresses = useCallback(async () => {
        try {
            const response = await getAddresses(page, itemsPerPage);
            setAddresses(response.result.data);
            setDefaultAddress(response.result.data.find((address) => address.is_default));
        } catch (error) {
            console.error("Error fetching addresses:", error);
        } finally {
        }
    }, []);

    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses, hasNew]);
    const [open, setOpen] = useState(false);

    const handleChangeAddress = () => {
        setOpen(!open);
    }

    return (
        <Card className="w-full rounded-md p-3 border-t-[5px] border-t-black-primary animate-fade-in">
            <CardHeader className="p-0">
                <div className="flex flex-row gap-3 justify-start items-center">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-[1em]">{t("text_shipping_address")}</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-row flex-wrap gap-1 justify-between item-center">
                    {
                        defaultAddress ? (
                            <div className="flex flex-row flex-wrap flex-grow max-w-full gap-1 justify-between items-center">
                                <div className="w-full">
                                    <div className="text-[1em]">{defaultAddress?.recipient_name} ({defaultAddress?.phone})</div>
                                    <div className="text-[.9em] text-muted-foreground truncate w-full">{defaultAddress?.first_line + defaultAddress?.second_line}</div>
                                </div>
                                {
                                    defaultAddress?.is_default ?
                                        (<div className="text-red-primary text-[.9em]">
                                            {t("text_default")}
                                        </div>) : null
                                }
                            </div>
                        ) : (
                            <div className="text-[.9em]">{t("text_not_address")}</div>
                        )
                    }
                    <div className="">
                        <Button onClick={() => handleChangeAddress()}>
                            {t("button_change")}
                        </Button>
                        <ListAddress open={open} onOpenChange={setOpen} setHasNew={setHasNew} hasNew={hasNew} setDefaultAddress={setDefaultAddress} defaultId={defaultAddress?.id} addresses={addresses} t={t} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}