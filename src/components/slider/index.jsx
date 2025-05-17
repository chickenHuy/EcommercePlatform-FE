"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

const ImageSlider = ({ images = [], interval = 7000 }) => {
  const [[current, direction], setCurrent] = useState([0, 0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(([prev]) => [(prev + 1) % images.length, 1]);
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  const prevSlide = () =>
    setCurrent(([prev]) => [prev === 0 ? images.length - 1 : prev - 1, -1]);
  const nextSlide = () =>
    setCurrent(([prev]) => [(prev + 1) % images.length, 1]);

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-md shadow-md animate-fade-in">
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5 }}
          className="absolute w-full h-full"
        >
          <div className="w-full h-full relative">
            <Image
              src={images[current].url}
              alt={`Slide ${current + 1}`}
              width={2000}
              heidht={2000}
              className="object-cover w-full h-full"
              priority
            />
          </div>
          <div
            className={`absolute w-fit h-fit flex flex-col items-end gap-3 px-5 py-3 rounded-md text-white-primary backdrop-blur-md ${images[current].background === "white" ? "bg-white-primary/50" : "bg-black-primary/50"} bottom-3 right-3 animate-fade-in`}
          >
            <h3>{images[current].description}</h3>
            <Button>
              {images[current].button}
              <ChevronRight className="p-1" />
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={prevSlide}
        className={`absolute top-1/2 left-4 transform -translate-y-1/2 text-white p-2 rounded-full z-10 ${images[current].background === "white" ? "bg-white-primary/50 hover:bg-white-primary/70" : "bg-black-primary/50 hover:bg-black-primary/70"}`}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={nextSlide}
        className={`absolute top-1/2 right-4 transform -translate-y-1/2 text-white p-2 rounded-full z-10 ${images[current].background === "white" ? "bg-white-primary/50 hover:bg-white-primary/70" : "bg-black-primary/50 hover:bg-black-primary/70"}`}
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrent(([prev]) => [i, i > prev ? 1 : -1])}
            className={`h-2 w-2 rounded-full cursor-pointer transition-all ${
              current === i ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
