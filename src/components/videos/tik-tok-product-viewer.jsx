"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  ChevronUp,
  ChevronDown,
  Heart,
  Share,
  Star,
  Play,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { searchProducts } from "@/api/search/searchApi";
import Link from "next/link";
import { get, post, del } from "@/lib/httpClient";
import { useDispatch } from "react-redux";
import { setWishList } from "@/store/features/wishListSlice";
import ProductPlaceholder from "@/assets/images/productPlaceholder.png";
import ReviewEmpty from "@/assets/images/ReviewEmpty.png";
import Image from "next/image";
import Loading from "../loading";
import { useTranslations } from "next-intl";

const formatPrice = (price) => {
  const numPrice = typeof price === "string" ? Number.parseFloat(price) : price;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(numPrice);
};

const calculateDiscount = (originalPrice, salePrice) => {
  const original =
    typeof originalPrice === "string"
      ? Number.parseFloat(originalPrice)
      : originalPrice;
  const sale =
    typeof salePrice === "string" ? Number.parseFloat(salePrice) : salePrice;
  return Math.round(((original - sale) / original) * 100);
};

const VideoPlayer = ({ product, isActive }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative w-full h-full lg:py-2 py-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-black">
      <Image src={product.mainImageUrl} fill alt="Product Video" className="object-cover"></Image>
      <div className="absolute w-full h-full top-0 left-0 backdrop-blur-md bg-white-primary/10">
      </div>
      <div className="relative h-full aspect-[9/16] rounded-md overflow-hidden shadow-md">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          loop
          playsInline
          poster={product.mainImageUrl}
          onClick={togglePlay}
          onLoadedData={() => setIsLoading(false)}
          crossOrigin="anonymous"
        >
          <source src={product.videoUrl} type="video/mp4" />
        </video>

        {isLoading && <div className="global_loading_icon black"></div>}

        {!isPlaying && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
            <Button
              size="icon"
              variant="ghost"
              className="w-20 h-20 rounded-full backdrop-blur-md hover:bg-transparent-primary border border-white-primary transition-all duration-300 hover:scale-110"
              onClick={togglePlay}
            >
              <Play className="w-10 h-10 text-white-primary fill-white-primary ml-1" />
            </Button>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20 pointer-events-none" />
        <ProductInfo product={product} />
      </div>
    </div>
  );
};

const ProductInfo = ({ product }) => {
  const discount = calculateDiscount(product.originalPrice, product.salePrice);
  const t = useTranslations("Search");

  return (
    <div className="absolute w-full h-fit bottom-0 left-0 p-2 pt-3 z-10 text-white-primary bg-[rgba(0,0,0,0.3)] rounded-t-md">
      <div className="space-y-1">
        <h2 className="lg:text-[1.2em] text-[1em] line-clamp-2">
          {product.name}
        </h2>
        <div className="flex items-center justify-between text-[.9em">
          {product.rating && (
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-[12px] h-[12px] ${i < Math.round(product.rating)
                    ? "text-yellow-primary fill-yellow-primary"
                    : ""
                    }`}
                />
              ))}
              <span >{product.rating.toFixed(1)}</span>
            </div>
          )}
          <span className="text-[.9em]">
            {t("text_sold", { number: product.sold })}
          </span>
        </div>

        <Badge className="text-white-primary text-[.9em] border-0 rounded-sm bg-transparent-primary border border-white-primary">
          {product.brandName}
        </Badge>

        <div className="flex items-center justify-end gap-3">
          {discount > 0 && (
            <Badge className="text-white-primary text-[.9em] border-0 rounded-sm bg-red-primary">
              -{discount}%
            </Badge>
          )}
          <span className="text-white-secondary text-[1em] line-through">
            {formatPrice(product.originalPrice)}
          </span>
          <span className="text-white-primary text-[1.3em]">
            {formatPrice(product.salePrice)}
          </span>
        </div>
      </div>

      <Link href={`/${product.slug}`} className="block">
        <Button className="w-full text-black-primary py-4 rounded-md shadow-md transition-all duration-300 border border-white-primary bg-transparent-primary hover:bg-white-primary text-white-primary hover:text-black-primary">
          <span className="mr-2">{t("text_view_detail")}</span>
          <ExternalLink className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  );
};

const ShareDialog = ({ product, isOpen, onClose }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const t = useTranslations("Search");

  const generateShareLink = (product) => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    return `${baseUrl}/${product.slug}`;
  };

  const handleCopyLink = async () => {
    if (!product) return;

    const shareLink = generateShareLink(product);

    try {
      await navigator.clipboard.writeText(shareLink);
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = shareLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);

      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
        onClose();
      }, 1500);
    }
  };

  const shareToSocial = (platform) => {
    if (!product) return;

    const shareLink = generateShareLink(product);
    const text = `View the product ${product.name} with price ${formatPrice(product.salePrice)}`;

    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}&quote=${encodeURIComponent(text)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareLink)}`,
      zalo: `https://zalo.me/share/sms?text=${encodeURIComponent(text + " " + shareLink)}`,
    };

    window.open(urls[platform], "_blank");
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Share className="w-5 h-5 -translate-y-[2px]" />
            {t("text_share_product")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="flex flex-row gap-3 p-2 rounded-md border shadow-sm">
            <Image
              src={product.mainImageUrl || ProductPlaceholder}
              alt={product.name}
              width={300}
              height={300}
              className="w-20 h-20 object-cover rounded-md shadow-sm"
            ></Image>
            <div className="flex-1 min-w-0">
              <h3 className="text-[1em] line-clamp-2">
                {product.name}
              </h3>
              <div className="w-full flex flex-row flex-wrap items-center gap-1">
                {product.originalPrice &&
                  <p className="text-[.8em] line-through text-white-tertiary">
                    {formatPrice(product.originalPrice)}
                  </p>
                }
                <p className="text-[1em]">
                  {formatPrice(product.salePrice)}
                </p>
              </div>
              <Badge className="text-black-primary text-[.8em] rounded-sm bg-transparent-primary border border-black-primary">
                {product.brandName}
              </Badge>
            </div>
          </div>

          <div>
            <span className="text-[.9em]">
              {t("text_link_product")}
            </span>
            <div className="flex gap-2">
              <Input
                value={generateShareLink(product)}
                readOnly
                className="bg-white/5 border-white/20 text-white text-sm backdrop-blur-sm"
              />
              <Button
                onClick={handleCopyLink}
                className={`px-4 transition-all duration-300 ${copySuccess
                  ? "bg-black-tertiary"
                  : ""
                  }`}
                disabled={copySuccess}
              >
                {copySuccess ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-3 gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => shareToSocial("facebook")}
                className="bg-[#0866FF] hover:bg-[#0866FF]/90 text-[.9em] border-0 hover:text-white-primary text-white-primary transition-all duration-300"
              >
                Facebook
              </Button>

              <Button
                size="sm"
                onClick={() => shareToSocial("twitter")}
                className="text-[.9em] border-0 transition-all duration-300"
              >
                Twitter
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => shareToSocial("zalo")}
                className="bg-[#005ae0] hover:bg-[#005ae0]/90 text-[.9em] border-0 hover:text-white-primary text-white-primary transition-all duration-300"
              >
                Zalo
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function TikTokProductViewer({ initialSize = 10 }) {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedProducts, setLikedProducts] = useState(new Set());
  const [firstLoad, setFirstLoad] = useState(true);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const containerRef = useRef(null);
  const dispatch = useDispatch();
  const currentProduct = products[currentIndex];
  const isLiked = currentProduct ? likedProducts.has(currentProduct.id) : false;

  const fetchProducts = useCallback(
    async (pageNum, searchKeyword = "", reset = false) => {
      if (!firstLoad && loading) return;

      try {
        setLoading(true);
        const data = await searchProducts({
          search: searchKeyword,
          page: pageNum,
          limit: initialSize,
        });

        const newProducts = data.result.data;

        if (reset) {
          setProducts(newProducts);
          setCurrentIndex(0);
        } else {
          setProducts((prev) => [...prev, ...newProducts]);
        }

        const totalPages = data.result.totalPages;
        setHasMore(
          totalPages
            ? pageNum < totalPages
            : newProducts.length === initialSize,
        );
      } catch (err) {
        console.log(err);
      } finally {
        setFirstLoad(false);
        setLoading(false);
      }
    },
    [initialSize, loading],
  );

  useEffect(() => {
    initWishList();
    fetchProducts(1, true);

    const handleKeyDown = (event) => {
      if (event.key === 'ArrowUp') {
        goToPrevious();
      } else if (event.key === 'ArrowDown') {
        goToNext()
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const loadMoreProducts = useCallback(() => {
    if (hasMore && !loading && currentIndex >= products.length - 2) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage, false);
    }
  }, [
    hasMore,
    loading,
    currentIndex,
    products.length,
    page,
    fetchProducts,
  ]);

  const scrollToIndex = (index) => {
    if (containerRef.current && index >= 0 && index < products.length) {
      const targetScroll = index * window.innerHeight;
      containerRef.current.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const newIndex = Math.round(scrollTop / window.innerHeight);

      if (
        newIndex !== currentIndex &&
        newIndex >= 0 &&
        newIndex < products.length
      ) {
        setCurrentIndex(newIndex);

        if (newIndex >= products.length - 2) {
          loadMoreProducts();
        }
      }
    }
  }, [currentIndex, products.length, loadMoreProducts]);

  const goToPrevious = () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < products.length - 1) {
      scrollToIndex(currentIndex + 1);
    } else {
      loadMoreProducts();
    }
  };

  const initWishList = async () => {
    const response = await getWishList();
    if (!response) return;
    const wishList = new Set();
    response.result.map((product) => {
      wishList.add(product.productId);
    })
    setLikedProducts(wishList);
  }

  const getWishList = async () => {
    try {
      const response = await get(`/api/v1/users/listFollowedProduct`);
      return response;
    } catch (error) {
      console.error("Error liking product:", error);
    }
  }

  const toggleLike = async () => {
    if (!currentProduct) return;

    const newLikedProducts = new Set(likedProducts);
    if (likedProducts.has(currentProduct.id)) {
      await del(`/api/v1/users/unFollow/${currentProduct.id}`);
      newLikedProducts.delete(currentProduct.id);
    } else {

      await post(`/api/v1/users/follow/${currentProduct.id}`);
      const response = await getWishList();
      dispatch(setWishList(response.result));
      newLikedProducts.add(currentProduct.id);
      console.log(newLikedProducts);
    }
    setLikedProducts(newLikedProducts);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  if (products.length === 0 && loading) {
    return (
      <Loading />
    );
  }

  if (!loading && products.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Image src={ReviewEmpty} width={300} height={300} alt="Review Empty"></Image>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden rounded-md border shadow-sm">
      <div
        ref={containerRef}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
      >
        {products.map((product, index) => (
          <div key={product.id} className="h-full snap-start">
            <VideoPlayer product={product} isActive={index === currentIndex} />
          </div>
        ))}

        {loading && hasMore && (
          <Loading />
        )}
      </div>

      {currentProduct && (
        <>
          <div className="absolute right-2 bottom-[10%] flex flex-col gap-3 z-20">
            <Button
              size="icon"
              variant="ghost"
              className="w-10 h-10 rounded-full backdrop-blur-md bg-white-primary/50 border transition-all duration-300"
              onClick={toggleLike}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "text-red-primary fill-red-primary" : ""}`} />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="w-10 h-10 rounded-full backdrop-blur-md bg-white-primary/50 border transition-all duration-300"
              onClick={() => setShowShareDialog(true)}
            >
              <Share className="w-5 h-5" />
            </Button>
          </div>

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
            <Button
              size="icon"
              variant="ghost"
              className="w-10 h-10 rounded-full backdrop-blur-md bg-white-primary/50 border transition-all duration-300"
              onClick={goToPrevious}
              disabled={currentIndex === 0}
            >
              <ChevronUp className="w-5 h-5" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="w-10 h-10 rounded-full backdrop-blur-md bg-white-primary/50 border transition-all duration-300"
              onClick={goToNext}
              disabled={currentIndex === products.length - 1 && !hasMore}
            >
              <ChevronDown className="w-5 h-5" />
            </Button>
          </div>
        </>
      )}

      <ShareDialog
        product={currentProduct}
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
      />

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
