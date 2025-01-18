import Image from "next/image";
import Link from "next/link";
import Empty from "@/assets/images/reviewEmpty.png";
import { ChevronLeft } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function OrderNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white-secondary/40">
      <div className="text-center">
        <h1 className="text-7xl font-extrabold text-red-primary">404</h1>
        <p className="mt-4 text-2xl font-semibold text-black-primary">
          Oops! Order Not Found
        </p>
        <p className="mt-2 text-black-tertiary">
          We couldn’t find the order you’re looking for. It might have been
          removed or is unavailable.
        </p>
        <Image
          src={Empty}
          alt="Product Not Found"
          className="w-1/2 mx-auto mt-6"
        />
      </div>
      <Link href="/admin/orders">
        <button className="flex items-center bg-black-primary text-white-primary p-3 mt-4 rounded-lg">
          <ChevronLeft className="h-7 w-7" />
          <Label className="truncate text-xl hover:cursor-pointer">
            Back to order page
          </Label>
        </button>
      </Link>
    </div>
  );
}
