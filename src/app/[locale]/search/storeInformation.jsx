import Image from "next/image";
import StoreEmpty from "@/assets/images/storeEmpty.jpg";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getStore } from "@/api/search/searchApi";

export function StoreInformation({ storeId, t }) {
  const [store, setStore] = useState(null);

  const fetchStore = useCallback(async () => {
    if (storeId) {
      try {
        const response = await getStore(storeId);
        setStore(response.result);
      } catch (error) {
        console.error("Error fetching store:", error);
      }
    } else {
      setStore(null);
    }
  }, [storeId]);

  useEffect(() => {
    fetchStore();
  }, [fetchStore]);

  if (!store) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-gray-primary p-6 border border-dashed border-gray-primary rounded-lg">
        <Image src={StoreEmpty} alt="Store not found" width={80} height={80} />
        <Label className="text-center text-lg">{t("text_store_not_found")}</Label>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-4 border border-gray-primary shadow-sm rounded-lg bg-white-primary hover:shadow-md transition-shadow duration-200">
      {/* Avatar */}
      <div className="w-1/3 shrink-0">
        <Image
          src={store.avatarStore || StoreEmpty}
          alt={store.name}
          width={80}
          height={80}
          className="rounded-full object-cover border-2 border-gradient-to-r from-black-primary to-red-primary"
        />
      </div>

      {/* Store Details */}
      <div className="w-2/3 flex flex-col space-y-1 ml-2">
        <Label className="truncate text-xl font-bold text-gray-primary hover:text-black-tertiary transition-colors duration-150">
          {store.name || "(Tên cửa hàng)"}
        </Label>
        <Label className="truncate text-sm text-gray-primary">
          {t("text_number_product")}
          <span className="font-medium text-gray-primary">
            {store.totalProduct || 0}
          </span>
        </Label>
        <div className="flex items-center space-x-2">
          <Star className="text-yellow-primary" size={20} />
          <Label className="text-sm font-medium text-gray-800">
            {store.rating || 0}
          </Label>
        </div>
      </div>
    </div>
  );
}
