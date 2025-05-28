import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import IconNotFound from "../../../public/images/categoryNotFound.png";
import useInView from "@/hooks/use-visible";
import Link from "next/link";

const BrandCard = ({ brand }) => {
  const [ref, isInView] = useInView();
  const containerRef = useRef(null);
  const [size, setSize] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const squareSize = Math.min(width, height);
      setSize(squareSize);
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Link
      ref={(el) => {
        ref.current = el;
        containerRef.current = el;
      }}
      href={`/search?brandId=${brand.id}`}
      style={{ height: brand.height }}
      className={`w-full h-full flex flex-col items-center gap-2 relative group mb-3 sm:mb-5 ${isInView ? "animate-fade-in-up" : "opacity-0"}`}
    >
      <div
        className="relative"
        style={{
          width: size,
          height: size,
        }}
      >
        <Image
          src={brand.logoUrl || IconNotFound}
          alt={brand.name}
          fill
          className="object-cover rounded-full shadow-md hover:scale-[1.03] transition duration-300"
        />
      </div>
      {isInView && (
        <p
          style={{ top: size * 0.45, width: size * 0.8 }}
          className="w-[80%] p-2 rounded-md absolute text-[.9em] text-white-primary text-center truncate backdrop-blur-sm bg-white-tertiary/50 group-hover:block hidden animate-fade-in-quick"
        >
          {brand.name.toUpperCase()}
        </p>
      )}
    </Link>
  );
};

export default BrandCard;
