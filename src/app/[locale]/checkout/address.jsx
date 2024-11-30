"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import ListAdress from "./listAddressPopup";
import { getAddresses } from "@/api/user/addressRequest";
import { useCallback, useState, useEffect } from "react";

export default function Address(props) {

    const [addresses, setAddresses] = useState([]);
    const [defaultAddress, setDefaultAddress] = useState(null);
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
        <Card className="m-4 border-0 rounded-none rounded-b-xl border-t-[4px] border-red-primary p-3">
            <CardHeader className="py-0 px-[7px] ">
                <div className="flex flex-row justify-start items-center">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-base">Địa Chỉ Nhận Hàng</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between">
                    <div className="space-y-1 flex justify-between items-start w-full">
                        <div>
                            <div className="font-medium">{defaultAddress?.recipient_name} ({defaultAddress?.phone})</div>
                            <div className="text-sm text-muted-foreground truncate">{defaultAddress?.first_line + defaultAddress?.second_line}</div>
                        </div>
                        {
                            defaultAddress?.is_default ?
                                (<div className="text-red-primary/90 mr-6 text-sm">
                                    Mặc định
                                </div>) : null
                        }
                    </div>
                    <div className="">
                        <Button onClick={() => handleChangeAddress()}>
                            Thay Đổi
                        </Button>
                    </div>
                </div>
            </CardContent>
            <ListAdress open={open} onOpenChange={setOpen} setHasNew={setHasNew} hasNew = {hasNew} setDefaultAddress={setDefaultAddress} defaultId={defaultAddress?.id} addresses={addresses} />
        </Card>
    )
}