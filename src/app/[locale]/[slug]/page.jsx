"use client"
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import ProductDetail from "./product-details";
import ProductDetailSkeleton from "./product-skeleton"; // Thêm nếu chưa có
import { get } from "@/lib/httpClient";
import ProductNotFound from "./productNotFound";

const ProductPage = ({ params }) => {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);

  // Hàm lấy dữ liệu sản phẩm
  const getProduct = async (slug) => {
    const res = await get(`/api/v1/products/slug/${slug}`);
    return res; // Trả về dữ liệu JSON
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
        setLoading(false); // Dừng trạng thái loading
      }
    };

    fetchData(); // Gọi hàm fetch khi component được render
  }, [params.slug]); // Thêm `params.slug` vào dependency

  if (loading) {
    return <ProductDetailSkeleton />; // Hiển thị skeleton trong khi chờ dữ liệu
  }

  if (!product) {
    return <ProductNotFound />;
  }

  return <ProductDetail product={product} />;
};

export default ProductPage;
