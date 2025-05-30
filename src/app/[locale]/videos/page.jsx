"use client"

import TikTokProductViewer from "@/components/videos/tik-tok-product-viewer";

export default function Page() {
  return (
    <div className="w-full h-screen xl:px-28 lg:px-20 sm:px-6 px-4 pt-20 pb-1">
      <TikTokProductViewer initialSize={10} />
    </div>
  )
}
