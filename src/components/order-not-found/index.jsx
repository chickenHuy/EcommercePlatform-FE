import Image from "next/image";
import Link from "next/link";
import Empty from "@/assets/images/ReviewEmpty.png";
import { ChevronLeft } from "lucide-react";

export default function OrderNotFound({backLocale, customPaddingLeft = true}) {
  return (
    <div className={`w-full h-screen ${customPaddingLeft ? "lg:pl-[300px]" : ""} flex flex-col justify-start items-center py-20`}>
      <div className="flex flex-col justify-center items-center text-center">
        <h1 className="text-[5em] font-extrabold text-red-primary">404</h1>
        <p className="mt-4 text-[1.5em] font-semibold text-black-primary">
          Oops! Order Not Found
        </p>
        <p className="text-black-tertiary">
          We couldn’t find the order you’re looking for. It might have been
          removed or is unavailable.
        </p>

        <Image
          src={Empty}
          alt="Order Not Found"
          className="w-1/2"
        />

        <Link href={backLocale} className="inline-flex mt-6 bg-black-secondary text-white-secondary px-5 py-2 rounded-md shadow-md hover:bg-black-primary">
          <ChevronLeft className="animate-ping scale-50 lg:block hidden" />
          <ChevronLeft className="animate-ping scale-50 lg:block hidden" />
          <ChevronLeft className="animate-ping scale-50 lg:block hidden" />
          Back to order page
          <ChevronLeft className="animate-ping scale-50 lg:block hidden" />
          <ChevronLeft className="animate-ping scale-50 lg:block hidden" />
          <ChevronLeft className="animate-ping scale-50 lg:block hidden" />
        </Link>
      </div>
    </div>
  );
}
