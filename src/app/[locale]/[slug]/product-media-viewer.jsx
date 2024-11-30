'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Maximize2, Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { cn } from '@/lib/utils'
import ImageProductPlaceholder from '@/assets/images/productPlaceholder.png'


export function ProductMediaViewer({ product }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef < HTMLVideoElement > (null)

  // Combine images and video into a single media array
  const mediaItems = [
    { id: 'main', type: 'image', url: product.mainImageUrl },
    ...product.images.map(img => ({ id: img.id, type: 'image', url: img.url })),
    ...(product.videoUrl ? [{ id: 'video', type: 'video', url: product.videoUrl }] : [])
  ]

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % mediaItems.length)
  }

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length)
  }

  const handleThumbnailClick = (index) => {
    setSelectedIndex(index)
    if (mediaItems[index].type === 'video' && videoRef.current) {
      videoRef.current.currentTime = 0
      setIsPlaying(true)
      videoRef.current.play()
    }
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="space-y-4 my-4">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        {mediaItems[selectedIndex].type === "image" ? (
          <Image
            src={mediaItems[selectedIndex].url || ImageProductPlaceholder}
            alt={`${product.name} - View ${selectedIndex + 1}`}
            fill
            className="object-cover"
            onClick={() => setIsModalOpen(true)}
          />
        ) : (
          <div className="relative h-full w-full">
            <video
              src={mediaItems[selectedIndex].url}
              className="h-full w-full object-cover"
              loop
              muted
              autoPlay
              controls
            />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-between p-4">
          <Button variant="secondary" size="icon" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="icon" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {mediaItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setSelectedIndex(index)}
            className={cn(
              "relative aspect-square overflow-hidden rounded-md",
              selectedIndex === index
                ? "ring-2 ring-primary"
                : "ring-1 ring-gray-200"
            )}
          >
            {item.type === "image" ? (
              <Image
                src={item.url || ImageProductPlaceholder}
                alt={`${product.name} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gray-100">
                <Play className="h-8 w-8 text-primary" />
              </div>
            )}
          </button>
        ))}
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-screen-lg">
          <div className="relative aspect-[3/2] w-full">
            <Image
              src={mediaItems[selectedIndex].url || ImageProductPlaceholder}
              alt={`${product.name} - View ${selectedIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

