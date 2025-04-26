"use client"

import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import ProductDetail from "./product-details";
import ProductDetailSkeleton from "./product-skeleton";
import { get } from "@/lib/httpClient";
import ProductNotFound from "./productNotFound";
import { useTranslations } from "next-intl";

const ProductPage = ({ params }) => {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const t = useTranslations("Slug");

  const getProduct = async (slug) => {
    const res = await get(`/api/v1/products/slug/${slug}`);
    return res;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProduct(params.slug);
        if (data.code !== 1000 || !data.result) {
          notFound();
        }
        setProduct(data.result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.slug]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return <ProductNotFound t={t} />;
  }

  return <ProductDetail product={product} t={t} />;
};

export default ProductPage;
