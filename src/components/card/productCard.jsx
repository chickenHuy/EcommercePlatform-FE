import Image from "next/image"
import { Heart, Star } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Placeholder from "@/assets/images/productPlaceholder.png";


function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

export default function ProductCard({ 
  name, 
  price, 
  originalPrice, 
  imageUrl, 
  videoUrl, 
  rating, 
  onAddToCart, 
  onAddToFavorites,
  isFavorite
}) {
  return (
    <Card 
      className="w-full cursor-pointer relative"
      onClick={onAddToCart}
    >
      <CardHeader className="p-0 relative">
        <div className="relative aspect-square">
          {videoUrl ? (
            <video 
              src={videoUrl} 
              loop 
              muted 
              autoPlay 
              playsInline
              className="w-full h-full object-cover rounded-t-lg"
            />
          ) : (
            <Image
              src={imageUrl ? imageUrl : Placeholder}
              alt={name}
              fill
              className="object-cover rounded-t-lg"
            />
          )}
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute top-2 right-2 z-10 bg-white-primary bg-opacity-50 hover:bg-opacity-100 transition-all duration-200"
          onClick={(e) => {
            e.stopPropagation();
            onAddToFavorites();
          }}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-primary text-red-primary' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-sm font-semibold line-clamp-2">{name}</CardTitle>
        <div className="flex items-center mt-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < Math.round(rating) ? 'text-yellow-primary fill-yellow-primary' : 'text-gray-primary'}`}
            />
          ))}
          <span className="ml-2 text-xs text-gray-600">{rating.toFixed(1)}</span>
        </div>
        <div className="mt-2">
          <span className="text-sm font-bold text-primary">{formatPrice(price)}</span>
          {originalPrice && (
            <span className="ml-2 text-xs text-gray-500 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
      </CardContent>
      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300 rounded-lg" />
    </Card>
  )
}
