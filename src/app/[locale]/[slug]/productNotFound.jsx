import Image from "next/image";
import Link from "next/link";
import Empty from "@/assets/images/reviewEmpty.png";

const ProductNotFound = ({img}) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white-secondary/40">
      <div className="text-center">
        <h1 className="text-7xl font-extrabold text-red-primary">404</h1>
        <p className="mt-4 text-2xl font-semibold text-black-primary">
          Oops! Product Not Found
        </p>
        <p className="mt-2 text-black-tertiary">
          We couldn’t find the product you’re looking for. It might have been
          removed or is unavailable.
        </p>
        <Image
          src={Empty} 
          alt="Product Not Found"
          className="w-1/2 mx-auto mt-6"
        />
        <Link href="/">
          <button className="px-6 py-3 mt-6 font-medium text-white-primary bg-black-primary rounded-lg hover:bg-black-tertiary/40">
            Back to Homepage
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductNotFound;
