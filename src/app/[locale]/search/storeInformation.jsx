import Image from "next/image";
import StoreEmpty from "@/assets/images/storeEmpty.jpg";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { getStore } from "@/api/search/searchApi";

export function StoreInformation() {
  const storeId = useSelector((state) => state.searchFilter.store);
  const [store, setStore] = useState(null);

  const fetchStore = useCallback(async () => {
    try {
      const response = await getStore(storeId);
      setStore(response.result);
    } catch (error) {
      console.log("Error get store: ", error);
    }
  }, [storeId]);

  useEffect(() => {
    fetchStore();
  }, [fetchStore]);
  return (
    <div className="flex items-center">
      <div className="w-1/3 shrink-0">
        <Image
          src={store?.avatarStore || StoreEmpty}
          alt={store?.name}
          width={80}
          height={80}
          className="rounded-full object-cover ml-4"
        />
      </div>
      <div className="w-2/3 flex flex-col space-y-1 ml-2">
        <Label className="truncate text-xl font-semibold">
          {store?.name || "(tên cửa hàng)"}
        </Label>
        <Label className="truncate">
          Số sản phẩm: {store?.totalProduct || 0}
        </Label>
        <div className="flex items-center space-x-2">
          <Star
            className="text-yellow-primary hover:cursor-default"
            size={20}
          />
          <Label className="text-xs">{store?.rating || 0}</Label>
        </div>
      </div>
    </div>
  );
}
