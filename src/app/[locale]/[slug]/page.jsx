import { notFound } from "next/navigation";
import ProductDetail from "./product-details";

async function getProduct(slug) {
  const res = await fetch(
    `http://localhost:8080/api/v1/products/slug/${slug}`,
    { cache: "no-store" }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }
  return res.json();
}

export default async function ProductPage({
  params,
}) {
  try {
    const data = await getProduct(params.slug);
    if (data.code !== 1000 || !data.result) {
      notFound();
    }
    return <ProductDetail product={data.result} />;
  } catch (error) {
    return <div>Failed to load product</div>;
  }
}
