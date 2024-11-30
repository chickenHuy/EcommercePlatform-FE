"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ManageCartUserSkeleton() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-muted/4 space-y-4">
      <Skeleton className="h-[80px] w-full" />

      <div className="px-4">
        <Skeleton className="h-12 w-full mb-4" />

        {[1, 2].map((_, cartIndex) => (
          <Card key={cartIndex} className="mb-4">
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((_, itemIndex) => (
                <div key={itemIndex} className="flex items-center space-x-4">
                  <Skeleton className="h-5 w-5 rounded-sm" />
                  <Skeleton className="h-20 w-20" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Skeleton className="h-6 w-1/3" />
            </CardFooter>
          </Card>
        ))}
      </div>

      <Skeleton className="h-[80px] w-full fixed bottom-0 left-0 right-0" />
    </div>
  )
}

