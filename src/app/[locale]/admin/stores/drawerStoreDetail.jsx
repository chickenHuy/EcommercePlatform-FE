import {
  Drawer,
  DrawerHeader,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Rating } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { getStoreById } from "@/api/admin/storeRequest";
import { useToast } from "@/hooks/use-toast";

export default function DrawerStoreDetail({ isOpen, onClose, storeId }) {
  const { toast } = useToast();
  const [store, setStore] = useState(null);

  const fetchStore = useCallback(async () => {
    try {
      const response = await getStoreById(storeId);
      setStore(response.result);
    } catch (error) {
      toast({
        title: "Lấy thông tin thất bại",
        description: "Không thể lấy thông tin cửa hàng",
        variant: "destructive",
      });
    }
  }, [storeId, toast]);

  useEffect(() => {
    fetchStore();
  }, [fetchStore]);

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Cửa hàng</DrawerTitle>
            <DrawerDescription>
              Thông tin chi tiết về cửa hàng
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex gap-10">
            {/* Sử dụng Flex để chia bố cục */}
            {/* Bên trái */}
            <div className="w-1/3">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">
                  {store?.name ? store?.name : "Chưa đặt tên"}
                </h3>
              </div>
              {/* Tên */}
              <div className="text-center">
                {/* Username */}
                <p className="text-sm text-muted-foreground">
                  {store?.username ? store?.username : "trống"}
                </p>
                {/* Bio */}
                <p className="text-sm mt-2">
                  {store?.bio ? store?.bio : "trống"}
                </p>
                <div className="flex items-center space-x-1">
                  <Rating
                    value={store?.rating ? store?.rating : 0}
                    precision={0.1}
                    readOnly
                  ></Rating>
                  <span>({store?.rating ? store?.rating : 0})</span>
                </div>
              </div>
            </div>
            {/* Bên phải */}
            <div className="w-1/2">
              <div className="mb-2">
                <p className="font-medium">Tổng số sản phẩm</p>
                <p>{store?.totalProduct ? store?.totalProduct : 0}</p>
              </div>
              <div className="mb-2">
                <p className="font-medium">Trạng thái cửa hàng:</p>
                <p>Hoạt động</p>
              </div>
              {/* Ngày tạo */}
              <div className="mb-2">
                <p className="font-medium">Ngày tạo:</p>
                <p>
                  {store?.createdAt
                    ? new Date(store.createdAt).toLocaleString()
                    : ""}
                </p>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Thoát</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
