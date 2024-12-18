import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailSkeleton() {
  return (
    <div className="flex-col bg-opacity-60 bg-blue-primary">
      <div className="mx-auto px-4 h-1 bg-blue-primary w-3/4"></div>
      <div className="mx-auto px-4 bg-white-primary mt-20 w-3/4">
        <div className="grid gap-8 md:grid-cols-2 mt-2">
          {/* Product Media Viewer Skeleton */}
          <Skeleton className="h-64 w-full rounded-lg" />

          <div className="space-y-6 mt-2">
            {/* Product Title */}
            <Skeleton className="h-8 w-3/4" />

            {/* Product Ratings */}
            <div className="mt-2 flex items-center space-x-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-16" />
            </div>

            {/* Separator */}
            <Skeleton className="h-1 w-full" />

            {/* Product Description */}
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-6 w-4/6" />

            {/* Pricing */}
            <Skeleton className="h-10 w-1/2" />

            {/* Attributes */}
            <div>
              <Skeleton className="h-6 w-1/4" />
              <div className="mt-2 flex space-x-2">
                {[1, 2, 3].map((_, idx) => (
                  <Skeleton key={idx} className="h-8 w-20 rounded" />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <Skeleton className="h-6 w-1/4" />
              <div className="mt-2 flex items-center space-x-2">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-5 w-1/4" />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4">
              <Skeleton className="h-10 w-1/2 rounded" />
              <Skeleton className="h-10 w-10 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Store Info */}
      <div className="mx-auto px-4 bg-blue-primary rounded-lg">
        <div className="bg-blue-primary border-none">
          <div className="p-4 w-3/4 mx-auto text-center">
            <Skeleton className="h-6 w-1/2" />
            <div className="mt-4 flex mx-auto w-fit items-center space-x-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-10 w-24 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="mx-auto px-4 rounded-lg w-3/4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-5/6" />
        <Skeleton className="h-5 w-4/6" />
      </div>
    </div>
  );
}
