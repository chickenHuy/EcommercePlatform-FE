"use client";
import { getAddresses } from "@/api/user/addressRequest";
import Loading from "@/components/loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogOverlay,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PlusIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { set } from "react-hook-form";
export default function listAdress(props) {
    const { open, onOpenChange, defaultId } = props;
    const page = 1;
    const itemsPerPage = 10;
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(defaultId || null);
    const handleRadioChange = (addressId) => {
        console.log(addressId);
        setSelectedAddressId(addressId);
    }

    const fetchAddresses = useCallback(async () => {
        try {
            const response = await getAddresses(page, itemsPerPage);
            setAddresses(response.result.data);
        } catch (error) {
            console.error("Error fetching addresses:", error);
        } finally {
        }
    }, []);

    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogOverlay className="bg-black-tertiary"></DialogOverlay>
            <DialogContent className="sm:max-w-[520px] p-0">
                <DialogHeader>
                    <DialogTitle className="text-xl pl-4 pt-2">
                        Danh sách địa chỉ
                    </DialogTitle>
                </DialogHeader>
                <ScrollArea className="grid gap-4 max-h-[360px] p-4">
                    {addresses.length === 0 ? (
                        <Loading />
                    ) : (

                        <> {
                            addresses.map((address) => (
                                <div
                                    key={address.id}
                                    className={`p-4 border m-1 rounded-md flex flex-col`}
                                >
                                    <div className="flex justify-between items-center">
                                        {/* Radio Button */}
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="address"
                                                value={address.id}
                                                checked={selectedAddressId === address.id}
                                                onChange={() => handleRadioChange(address.id)}
                                                className="form-radio h-5 w-5 text-blue-500"
                                            />
                                            <span className="text-lg font-semibold">
                                                {address.recipient_name} <span>({address.phone})</span>
                                            </span>
                                        </label>
                                    </div>

                                    {/* Thông tin địa chỉ */}
                                    <div className="mt-2 space-y-1">
                                        <p className="text-sm">{address.first_line}</p>
                                        <p className="text-sm">{address.second_line}</p>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {address.is_default && (
                                                <Badge
                                                    variant="secondary"
                                                    className="border-[#151010] text-[#D95040]"
                                                >
                                                    Mặc định
                                                </Badge>
                                            )}
                                            {address.is_store_address && (
                                                <>
                                                    <Badge variant="outline">Địa chỉ lấy hàng</Badge>
                                                    <Badge variant="outline">Địa chỉ trả hàng</Badge>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}



                </ScrollArea>
                <div
                    className="p-4 bg-gray-primary bg-opacity-10"
                >
                    <Button variant="outline" className="hover:cursor-pointer hover:bg-blue-primary m-2">
                        <PlusIcon>
                        </PlusIcon>
                        <span>Thêm địa chỉ mới</span>
                    </Button>
                    <Separator className="bg-black-primary" />
                    <div className="w-full pt-4 flex justify-end ">
                        <Button className="m-2" onClick={
                            onOpenChange
                        }>
                            Hủy
                        </Button>
                        <Button className="bg-red-primary m-2">
                            Xác nhận
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog >
    )
}
