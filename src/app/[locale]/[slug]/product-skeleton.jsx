import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailSkeleton() {
  return (
    <div className="w-full h-fit xl:px-28 lg:px-20 sm:px-6 px-4 py-20 space-y-3">
      <div className="w-full h-fit flex flex-col shadow-md rounded-md p-3">
        <div className="w-full h-fit">
          <div className="grid gap-7 sm:grid-cols-2 grid-cols-1">
            <div className="skeleton-item w-full aspect-[4/3] rounded-lg"></div>

            <div className="space-y-5">
              <div className="skeleton-item h-8 w-full"></div>

              <div className="flex items-center flex-wrap space-x-2">
                <div className="skeleton-item h-8 w-1/4"></div>
                <div className="skeleton-item h-8 w-1/4"></div>
              </div>

              <Skeleton className="h-[2px] w-full" />

              <div className="space-y-1">
                <div className="skeleton-item h-8 w-full"></div>
                <div className="skeleton-item h-8 w-full"></div>
                <div className="skeleton-item h-8 w-full"></div>
              </div>

              <div className="skeleton-item h-10 w-1/2"></div>

              <div>
                <div className="skeleton-item h-8 w-1/2"></div>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {[1, 2, 3].map((_, idx) => (
                    <div key={idx} className="skeleton-item h-8 w-[16%]"></div>
                  ))}
                </div>
              </div>

              <div>
                <div className="skeleton-item h-8 w-1/2"></div>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {[1, 2, 3].map((_, idx) => (
                    <div key={idx} className="skeleton-item h-8 w-[16%]"></div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <div className="skeleton-item h-10 w-1/2"></div>
                <div className="skeleton-item h-10 w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-fit flex flex-col justify-center items-center shadow-md rounded-md gap-3 p-3">
        <div className="skeleton-item h-8 w-[300px]"></div>
        <div className="skeleton-circle h-24 w-24"></div>
        <div className="skeleton-item h-8 w-[200px]"></div>
        <div className="w-fit flex flex-row gap-3">
          <div className="skeleton-item h-8 w-[150px]"></div>
          <div className="skeleton-item h-8 w-[150px]"></div>
        </div>
      </div>

      <div className="w-full h-fit flex flex-col shadow-md rounded-md p-3 space-y-2">
        <div className="space-x-2 flex">
          <div className="skeleton-item h-8 w-1/2"></div>
          <div className="skeleton-item h-8 w-1/2"></div>
        </div>
        <div className="space-x-2 flex">
          <div className="skeleton-item h-8 w-1/2"></div>
          <div className="skeleton-item h-8 w-1/2"></div>
        </div>
        <div className="space-x-2 flex">
          <div className="skeleton-item h-8 w-1/2"></div>
          <div className="skeleton-item h-8 w-1/2"></div>
        </div>
        <div className="space-x-2 flex">
          <div className="skeleton-item h-8 w-1/2"></div>
          <div className="skeleton-item h-8 w-1/2"></div>
        </div>
        <div className="space-x-2 flex">
          <div className="skeleton-item h-8 w-1/2"></div>
          <div className="skeleton-item h-8 w-1/2"></div>
        </div>
      </div>
    </div>
  );
}
