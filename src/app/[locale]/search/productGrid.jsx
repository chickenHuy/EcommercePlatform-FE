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
import { resetFilters, setStore } from "@/store/features/userSearchSlice";
import Masonry from "react-masonry-css";

export default function ProductGrid({ maxCol = 6 }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [resetTrigger, setResetTrigger] = useState(0);

  const { ref, inView } = useInView();
  const dispatch = useDispatch();
  const searchParams = useSelector((state) => state.searchFilter);
  const isCompleteSetup = useSelector((state) => state.searchFilter.completeSetup);
  const favorites = useSelector((state) => state.wishListReducer.wishList);
  console.log("searchParams", favorites);
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
          for (const product of newProducts) {
            const productDetail = await get(`/api/v1/products/slug/${product.slug}`);
            product.components = productDetail.result.components || [];
          }
          setProducts((prev) => {
            const merged = isInitialLoad ? newProducts : [...prev, ...newProducts];
            const unique = Array.from(new Map(merged.map(p => [p.id, p])).values());
            return unique;
          });
          setPage(res.result.nextPage);
        }
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    },
    [searchParams, page, loading, hasMore, isCompleteSetup],
  );

  useEffect(() => {
    if (!isCompleteSetup) return;
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setResetTrigger((prev) => prev + 1);
  }, [searchParams, isCompleteSetup]);

  useEffect(() => {
    if (!isCompleteSetup) return;
    loadProducts(true);
  }, [resetTrigger]);

  useEffect(() => {
    if (inView && !loading) {
      loadProducts();
    }
  }, [inView, loading, loadProducts]);

  useEffect(() => {
    return () => {
      dispatch(setStore(null));
      dispatch(resetFilters());
    };
  }, []);

  const handleAddToFavorites = async (productId) => {
    try {
      await post(`/api/v1/users/follow/${productId}`);
      toast({
        title: t("toast_title_wishlist_success"),
        description: t("toast_description_wishlist_success"),
      });

      const res = await get(`/api/v1/users/listFollowedProduct`);
      dispatch(setWishList(res.result));
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
      <Masonry
        breakpointCols={{ default: 4, 1400: 2 }}
        className="main_grid_layout gap-3 no-scrollbar"
        columnClassName="main_grid_item"
      >
        {products.map((product) => (
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
            components={product.components}
            rating={product.rating}
            onViewDetail={() => handleViewDetail(product)}
            onAddToFavorites={() => handleAddToFavorites(product.id)}
            isFavorite={favorites.find((item) => item.productId === product.id)}
            link={product.slug}
            isMasonry={true}
          />
        ))}
      </Masonry>
      {hasMore && (
        <div ref={ref} className="w-full col-span-full flex justify-center">
          {loading && (
            <div className={`w-full grid gap-3 grid-cols-2 ${gridCols}`}>
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonItem key={i} />
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && products.length === 0 && (
        <Image src={Empty} alt="No Products Found" className="w-1/2 mx-auto" />
      )}
    </>
  );
}
