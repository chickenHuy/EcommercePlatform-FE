import { useEffect, useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import ProductCard from "@/components/card/productCard";
import { useDispatch, useSelector } from "react-redux";
import { searchProducts } from "@/api/search/searchApi";
import { useInView } from "react-intersection-observer";
import Loading from "@/components/loading";
import { get, post } from "@/lib/httpClient";
import { setWishList } from "@/store/features/wishListSlice";

export default function ProductGrid({t}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { ref, inView } = useInView();
  const storeId = useSelector((state) => state.searchFilter);
  const searchParams = useSelector((state) => state.searchFilter);
  const limit = 16;

  const favorites = useSelector((state) => state.wishListReducer.wishList);
  const dispatch = useDispatch();

  const loadProducts = useCallback(
    async (isInitialLoad = false) => {
      if (loading || (!hasMore && !isInitialLoad) || page == null) return;
      setLoading(true);
      try {
        console.log("searchParams" + searchParams);
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
            isInitialLoad ? newProducts : [...prevProducts, ...newProducts]
          );
          setPage(res.result.nextPage);
        }
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    },
    [searchParams, page, loading, hasMore]
  );

  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    loadProducts(true);
  }, [searchParams]);

  useEffect(() => {
    if (inView && !loading) {
      loadProducts();
    }
  }, [inView, loading, loadProducts, storeId]);

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
        .catch((err) => {
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

  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      }}
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
          rating={product.rating}
          onViewDetail={() => handleViewDetail(product)}
          onAddToFavorites={() => handleAddToFavorites(product.id)}
          isFavorite={favorites.includes(product.id)}
          link={product.slug}
        />
      ))}
      {hasMore && (
        <div ref={ref} className="col-span-full flex justify-center p-4">
          {loading && <Loading />}
        </div>
      )}
    </div>
  );
}
