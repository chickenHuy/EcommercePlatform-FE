import { use, useEffect, useState } from "react";
import { Heart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import EmptyImage from "@/assets/images/brandEmpty.jpg";
import StoreImage from "@/assets/images/storeEmpty.jpg";
import { get, del } from "@/lib/httpClient"; // Giả sử `del` là phương thức DELETE được định nghĩa trong httpClient
import Loading from "../loading";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { useDispatch, useSelector } from "react-redux";
import { setWishList } from "@/store/features/wishListSlice";

export default function WishlistPopup() {
  const [isLoading, setLoading] = useState(false);
  const wishlistData = useSelector((state) => state.wishListReducer.wishList);
  const dispatch = useDispatch();
  const setWishlistData = (data) => {
    dispatch(setWishList(data));
  };

  const getWishlist = async () => {
    try {
      const res = await get("/api/v1/users/listFollowedProduct");
      setWishlistData(res.result || []);
    } catch (err) {
      setWishlistData([]);
    }
  };

  const handleRemoveProduct = (productId) => {
    del(`/api/v1/users/unFollow/${productId}`)
      .then(() => {
        setWishlistData(
          wishlistData.filter((item) => item.productId !== productId)
        );
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    setLoading(true);
    getWishlist().finally(() => setLoading(false));
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="relative p-2 text-white-primary hover:text-blue-primary transition-colors">
          <Heart className="w-5 h-5 text-white-primary" />
          {wishlistData.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {wishlistData.length}
            </span>
          )}
        </button>
      </DialogTrigger>
      <DialogTitle />
      <DialogDescription />
      <DialogContent className="sm:max-w-[600px]">
        <div className="max-h-[80vh] overflow-auto">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            Sản phẩm yêu thích
          </h2>
          <div className="grid gap-4">
            {isLoading && <Loading />}
            {wishlistData.length === 0 && (
              <>
                <Image
                  className="mx-auto"
                  src={StoreImage}
                  alt="Empty"
                  height={100}
                />
                <p className="text-gray-primary text-center">
                  Chưa có sản phẩm nào trong danh sách yêu thích
                </p>
              </>
            )}
            {wishlistData?.map((product) => (
              <div
                key={product.productId}
                className="group grid grid-cols-[100px_1fr_auto] gap-4 p-4 rounded-lg hover:bg-blue-primary transition-colors"
              >
                <div className="relative aspect-square rounded-md overflow-hidden">
                  <Image
                    src={product.mainImageUrl || EmptyImage}
                    alt={product.productName}
                    fill
                    className="object-cover"
                  />
                </div>
                <Link href={`/${product.slug}`} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden">
                      <Image
                        src={product.logoBrand || EmptyImage}
                        alt={product.brandName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {product.brandName}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-primary group-hover:text-gray-primary/80 transition-colors">
                    {product.productName}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden">
                      <Image
                        src={product.storeImageUrl || StoreImage}
                        alt={product.storeName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm text-gray-primary">
                      {product.storeName}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={() => handleRemoveProduct(product.productId)}
                  className="p-2 text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
