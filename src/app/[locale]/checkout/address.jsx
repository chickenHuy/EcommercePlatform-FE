"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import ListAdress from "./listAddressPopup";
import { useState } from "react";

const address = {
    id: 1,
    line1: "Khang 0397490429",
    line2: "Hai Bà Trưng,aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa Hà Nội"
}
export default function Address(props) {

    const [open, setOpen] = useState(false);

    const handleChangeAddress = () => {
        setOpen(!open);
    }

    return (
        <Card className="m-4 border-0 border-t-[4px] border-red-primary p-3">
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
                            <div className="font-medium">{address.line1}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-[260px]">{address.line2}</div>
                        </div>
                        <div className="text-red-primary/90 mr-6 text-sm">
                            Mặc định
                        </div>
                    </div>
                    <div className="">
                        <Button onClick={() => handleChangeAddress()}>
                            Thay Đổi
                        </Button>
                    </div>
                </div>
            </CardContent>
            <ListAdress open={open} onOpenChange={handleChangeAddress} />
        </Card>
    )
}