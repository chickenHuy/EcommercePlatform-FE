import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import ProductCard from "@/components/card/productCard";

const products = [
  {
    id: 1,
    name: "Áo thun phong cách",
    price: 299000,
    originalPrice: 399000,
    imageUrl: "/placeholder.svg?height=300&width=300",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Quần jean thoải mái",
    price: 599000,
    originalPrice: 799000,
    imageUrl: "/placeholder.svg?height=300&width=300",
    videoUrl: "https://example.com/video/jeans.mp4",
    rating: 4.2,
  },
  {
    id: 2,
    name: "Quần jean thoải mái",
    price: 599000,
    originalPrice: 799000,
    imageUrl: "/placeholder.svg?height=300&width=300",
    videoUrl: "https://example.com/video/jeans.mp4",
    rating: 4.2,
  },
  {
    id: 2,
    name: "Quần jean thoải mái",
    price: 599000,
    originalPrice: 799000,
    imageUrl: "/placeholder.svg?height=300&width=300",
    videoUrl: "https://example.com/video/jeans.mp4",
    rating: 4.2,
  },
  {
    id: 2,
    name: "Quần jean thoải mái",
    price: 599000,
    originalPrice: 799000,
    imageUrl: "/placeholder.svg?height=300&width=300",
    videoUrl: "https://example.com/video/jeans.mp4",
    rating: 4.2,
  },
  {
    id: 2,
    name: "Quần jean thoải mái",
    price: 599000,
    originalPrice: 799000,
    imageUrl: "/placeholder.svg?height=300&width=300",
    videoUrl: "https://example.com/video/jeans.mp4",
    rating: 4.2,
  },
  {
    id: 2,
    name: "Quần jean thoải mái",
    price: 599000,
    originalPrice: 799000,
    imageUrl: "/placeholder.svg?height=300&width=300",
    videoUrl: "https://example.com/video/jeans.mp4",
    rating: 4.2,
  },
  {
    id: 2,
    name: "Quần jean thoải mái",
    price: 599000,
    originalPrice: 799000,
    imageUrl: "/placeholder.svg?height=300&width=300",
    videoUrl: "https://example.com/video/jeans.mp4",
    rating: 4.2,
  },
  {
    id: 2,
    name: "Quần jean thoải mái",
    price: 599000,
    originalPrice: 799000,
    imageUrl: "/placeholder.svg?height=300&width=300",
    videoUrl: "https://example.com/video/jeans.mp4",
    rating: 4.2,
  },
  {
    id: 2,
    name: "Quần jean thoải mái",
    price: 599000,
    originalPrice: 799000,
    imageUrl: "/placeholder.svg?height=300&width=300",
    videoUrl: "https://example.com/video/jeans.mp4",
    rating: 4.2,
  },
  {
    id: 2,
    name: "Quần jean thoải mái",
    price: 599000,
    originalPrice: 799000,
    imageUrl: "/placeholder.svg?height=300&width=300",
    videoUrl: "https://example.com/video/jeans.mp4",
    rating: 4.2,
  },
  {
    id: 2,
    name: "Quần jean thoải mái",
    price: 599000,
    originalPrice: 799000,
    imageUrl: "/placeholder.svg?height=300&width=300",
    videoUrl: "https://example.com/video/jeans.mp4",
    rating: 4.2,
  },

];

export default function ProductGrid() {
  const [favorites, setFavorites] = useState([]);

  const handleAddToCart = (product) => {
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: `${product.name} đã được thêm vào giỏ hàng của bạn.`,
    });
  };

  const handleAddToFavorites = (productId) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
    toast({
      title: "Danh sách yêu thích đã cập nhật",
      description:
        "Sản phẩm đã được thêm vào hoặc xóa khỏi danh sách yêu thích của bạn.",
    });
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
          name={product.name}
          price={product.price}
          originalPrice={product.originalPrice}
          imageUrl={product.imageUrl}
          videoUrl={product.videoUrl}
          rating={product.rating}
          onAddToCart={() => handleAddToCart(product)}
          onAddToFavorites={() => handleAddToFavorites(product.id)}
          isFavorite={favorites.includes(product.id)}
        />
      ))}
    </div>
  );
}
