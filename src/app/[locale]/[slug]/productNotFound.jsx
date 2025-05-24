import Image from "next/image";
import Link from "next/link";
import Empty from "@/assets/images/reviewEmpty.png";

const ProductNotFound = ({ t }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-center">
        <p className="text-[1.5em] font-[900]">{t("text_oops")}</p>
        <p className=" text-black-tertiary text-[1em]">
          {t("text_unavailable")}
        </p>
        <Image src={Empty} alt="Product Not Found" className="w-1/2 mx-auto" />
        <Link href="/">
          <button className="px-6 py-3 text-white-primary bg-black-primary rounded-lg hover:bg-black-primary/90">
            {t("text_back_home")}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductNotFound;
