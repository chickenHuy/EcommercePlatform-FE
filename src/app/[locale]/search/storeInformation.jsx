import Image from "next/image";
import StoreEmpty from "@/assets/images/storeEmpty.jpg";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getStore } from "@/api/search/searchApi";

export function StoreInformation({ storeId, t }) {
  const [store, setStore] = useState(null);
  const [isLoading, setIsloading] = useState(false);

  const fetchStore = useCallback(async () => {
    if (storeId) {
      try {
        setIsloading(true);
        const response = await getStore(storeId);
        setStore(response.result);
      } catch (error) {
        console.error("Error fetching store:", error);
      } finally {
        setIsloading(false);
      }
    } else {
      setStore(null);
    }
  }, [storeId]);

  useEffect(() => {
    fetchStore();
  }, [fetchStore]);

  if (!store) {
    if (isLoading) {
      return (
        <div className="skeleton-item flex flex-col">
          <div className="skeleton-circle w-32 h-32"></div>
          <div className="skeleton-line w-full h-10"></div>
          <div className="skeleton-line w-full h-10"></div>
          <div className="skeleton-line w-full h-10"></div>
          <div className="skeleton-line w-full h-24"></div>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center gap-2 text-gray-primary p-6 border border-dashed border-gray-primary rounded-lg">
          <Image
            src={StoreEmpty}
            alt="Store not found"
            width={80}
            height={80}
          />
          <Label className="text-center text-lg">
            {t("text_store_not_found")}
          </Label>
        </div>
      );
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 border rounded-md p-3 bg-blue-secondary animate-fade-in">
      <Image
        src={store.avatarStore || StoreEmpty}
        alt={store.name}
        width={130}
        height={130}
        className="rounded-full object-cover aspect-square shadow-md"
      />

      <div className="w-full h-fit flex flex-col gap-0">
        <span className="text-[1.2em] font-[900] text-center text-wrap">
          {store.name || "(Tên cửa hàng)"}
        </span>
        <span className="text-[1em] text-center">
          {t("text_number_product")}
          <span>{store.totalProduct || 0}</span>
        </span>
        <div className="flex items-center justify-center gap-1">
          <Star className="text-yellow-primary fill-yellow-primary" size={20} />
          <span className="text-[1em]">{store.rating || 0}</span>
        </div>
      </div>
      <div className="max-h-[200px] p-2 border border-blue-primary rounded-md overflow-auto">
        {store.bio}
      </div>
    </div>
  );
}
