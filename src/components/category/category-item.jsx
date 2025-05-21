import Image from "next/image";
import IconNotFound from "../../../public/images/categoryNotFound.png";
import useInView from "@/hooks/use-visible";
import Link from "next/link";

const CategoryCard = ({ category }) => {
  const [ref, isInView] = useInView();

  return (
    <Link
      ref={ref}
      href={`search?categoryId=${category.id}`}
      style={{ height: category.height }}
      className={`w-full flex flex-col items-center gap-2 relative group mb-3 sm:mb-5 ${isInView ? "animate-fade-in-up" : "opacity-0"}`}
    >
      <div className="w-full h-full relative">
        <Image
          src={category.imageUrl || IconNotFound}
          alt={category.name}
          fill
          className="object-cover rounded-xl shadow-md hover:scale-[1.03] transition duration-300"
        />
      </div>
      {isInView && (
        <p className="w-[80%] p-2 rounded-md absolute bottom-5 text-[.9em] text-white-primary text-center truncate backdrop-blur-sm bg-white-tertiary/50 group-hover:block hidden animate-fade-in-quick">
          {category.name.toUpperCase()}
        </p>
      )}
    </Link>
  );
};

export default CategoryCard;
