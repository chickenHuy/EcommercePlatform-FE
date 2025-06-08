import { useEffect, useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import ProductCard from "@/components/card/productCard";
import { useDispatch, useSelector } from "react-redux";
import { searchProducts } from "@/api/search/searchApi";
import { useInView } from "react-intersection-observer";
import { get, post } from "@/lib/httpClient";
import { setWishList } from "@/store/features/wishListSlice";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import Empty from "@/assets/images/ReviewEmpty.png";
import Image from "next/image";
import { resetFilters } from "@/store/features/userSearchSlice";

export default function ProductGrid({ maxCol = 6 }) {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const { ref, inView } = useInView();

  const dispatch = useDispatch();
  const searchParams = useSelector((state) => state.searchFilter);
  const isCompleteSetup = useSelector((state) => state.searchFilter.completeSetup);
  const favorites = useSelector((state) => state.wishListReducer.wishList);
  const t = useTranslations("Search");
  const limit = 16;

  const gridCols = clsx("grid-cols-2", {
    "sm:grid-cols-2": maxCol === 4,
    "sm:grid-cols-3": maxCol >= 6,

    "lg:grid-cols-2": maxCol === 4,
    "lg:grid-cols-4": maxCol >= 6,

    "xl:grid-cols-4": maxCol === 4,
    "xl:grid-cols-6": maxCol >= 6,
  });

  const loadProducts = useCallback(
    async (isInitialLoad = false) => {
      if (loading || (!hasMore && !isInitialLoad) || page == null || !isCompleteSetup) return;
      setLoading(true);
      try {
        const res = await searchProducts({
          ...searchParams,
          page: isInitialLoad ? 1 : page,
          limit: limit,
        });
        const newProducts = res.result.data;

        if (newProducts.length === 0) {
          setHasMore(false);
        } else {
          setProducts((prevProducts) =>
            isInitialLoad ? newProducts : [...prevProducts, ...newProducts],
          );
          setPage(res.result.nextPage);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    },
    [searchParams, page, loading, hasMore],
  );

  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    loadProducts(true);
  }, [searchParams, isCompleteSetup]);

  useEffect(() => {
    if (inView && !loading) {
      loadProducts();
    }
  }, [inView, loading, loadProducts]);

  useEffect(() => {
    return () => {
      dispatch(resetFilters());
    }
  }, []);

  const handleAddToFavorites = async (productId) => {
    try {
      await post(`/api/v1/users/follow/${productId}`);
      toast({
        title: t("toast_title_wishlist_success"),
        description: t("toast_description_wishlist_success"),
      });

      get(`/api/v1/users/listFollowedProduct`)
        .then((res) => {
          dispatch(setWishList(res.result));
        })
        .catch(() => {
          dispatch(setWishList([]));
        });
    } catch (error) {
      toast({
        title: t("toast_title_wishlist_fail"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const SkeletonItem = () => (
    <div className="skeleton-item w-full aspect-square">
      <div className="skeleton-line w-full aspect-square" />
      <div className="skeleton-line w-full h-[30px]" />
    </div>
  );

  return (
    <>
      <div className={`w-full grid gap-3 grid-cols-2 ${gridCols}`}>
        {products?.map((product) => (
          <ProductCard
            key={product.id}
            productId={product.id}
            name={product.name}
            price={product.salePrice}
            originalPrice={product.originalPrice}
            mainImageUrl={product.mainImageUrl}
            videoUrl={product.videoUrl}
            brandName={product.brandName}
            sold={product.sold}
            rating={product.rating}
            onViewDetail={() => handleViewDetail(product)}
            onAddToFavorites={() => handleAddToFavorites(product.id)}
            isFavorite={favorites.includes(product.id)}
            link={product.slug}
          />
        ))}
        {hasMore && (
          <div ref={ref} className="w-full col-span-full flex justify-center">
            {loading && (
              <div className={`w-full grid gap-3 grid-cols-2 ${gridCols}`}>
                <SkeletonItem />
                <SkeletonItem />
                <SkeletonItem />
                <SkeletonItem />
                <SkeletonItem />
                <SkeletonItem />
                <SkeletonItem />
                <SkeletonItem />
                <SkeletonItem />
                <SkeletonItem />
                <SkeletonItem />
                <SkeletonItem />
              </div>
            )}
          </div>
        )}
      </div>
      {!loading && products && products.length === 0 && (
        <Image src={Empty} alt="Order Not Found" className="w-1/2 mx-auto" />
      )}
    </>
  );
}
