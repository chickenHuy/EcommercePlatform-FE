import { useEffect, useState } from "react";
import { Heart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { setWishList } from "@/store/features/wishListSlice";
import { get, del } from "@/lib/httpClient";

import EmptyImage from "@/assets/images/brandEmpty.jpg";
import StoreImage from "@/assets/images/storeEmpty.jpg";
import Loading from "../loading";

export default function WishlistPopup({ t }) {
  const [isLoading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const wishlistData = useSelector((state) => state.wishListReducer.wishList);
  const dispatch = useDispatch();

  const setWishlistData = (data) => dispatch(setWishList(data));

  const getWishlist = async () => {
    try {
      const res = await get("/api/v1/users/listFollowedProduct");
      setWishlistData(res.result || []);
    } catch {
      setWishlistData([]);
    }
  };

  const handleRemoveProduct = async (productId) => {
    try {
      await del(`/api/v1/users/unFollow/${productId}`);
      setWishlistData(
        wishlistData.filter((item) => item.productId !== productId),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setConfirmDelete(null);
    }
  };

  useEffect(() => {
    setLoading(true);
    getWishlist().finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <button className="relative p-2 text-white-secondary hover:text-black-secondary hover:bg-white-secondary rounded-md">
            <Heart className="w-5 h-5" />
            {wishlistData.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-primary text-white-primary text-[.8em] rounded-full w-[18px] h-[18px] flex items-center justify-center">
                {wishlistData.length}
              </span>
            )}
          </button>
        </DialogTrigger>

        <DialogTitle />
        <DialogDescription />

        <DialogContent className="sm:min-w-[50%] max-w-[400px] rounded-lg p-0">
          <h2 className="text-[1.3em] text-center font-[900] border-b py-3">
            {t("text_favorite_product")}
          </h2>
          <div className="max-h-[500px] overflow-auto">
            <div className="flex flex-col gap-3 p-3">
              {isLoading && <Loading />}

              {!isLoading && wishlistData.length === 0 && (
                <Image
                  className="mx-auto"
                  src={StoreImage}
                  alt="Empty"
                  height={300}
                />
              )}

              {!isLoading &&
                wishlistData.map((product) => (
                  <div
                    key={product.productId}
                    className="flex items-center justify-between gap-3 rounded-lg border border-white-secondary shadow-sm p-2"
                  >
                    <Link
                      href={`/${product.slug}`}
                      className="flex flex-grow items-center gap-3"
                    >
                      <Image
                        src={product.mainImageUrl || EmptyImage}
                        alt={product.productName}
                        className="object-contain w-24 h-24 rounded-md shadow-md"
                        width={100}
                        height={100}
                      />
                      <div className="flex flex-col gap-2">
                        <h3 className="text-[1.1em]">{product.productName}</h3>
                        <div className="flex items-center gap-3">
                          <Image
                            src={product.logoBrand || EmptyImage}
                            alt={product.brandName}
                            className="object-contain w-6 h-6 rounded-full shadow-md"
                            width={30}
                            height={30}
                          />
                          <span className="text-[.8em]">
                            {product.brandName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Image
                            src={product.storeImageUrl || StoreImage}
                            alt={product.storeName}
                            className="object-contain w-6 h-6 rounded-full shadow-md"
                            width={30}
                            height={30}
                          />
                          <span className="text-[.8em]">
                            {product.storeName}
                          </span>
                        </div>
                      </div>
                    </Link>

                    <button
                      onClick={() => setConfirmDelete(product)}
                      className="p-2 rounded-full shadow-md hover:bg-red-primary"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {confirmDelete && (
        <Dialog open onOpenChange={() => setConfirmDelete(null)}>
          <DialogContent className="sm:max-w-[400px] text-center">
            <h3 className="text-lg font-semibold mb-4">
              {t("text_confirm_deletion")}
            </h3>
            <p>
              {t("text_confirm_description", {
                productName: confirmDelete.productName,
              })}
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setConfirmDelete(null)}
              >
                {t("button_cancel")}
              </button>
              <button
                className="px-4 py-2 bg-red-primary text-white-primary rounded hover:bg-error-light"
                onClick={() => handleRemoveProduct(confirmDelete.productId)}
              >
                {t("button_save")}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
