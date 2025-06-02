"use client";

import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function TikTokProductPanner() {
    const t = useTranslations("Search");
    return (
        <div className="flex flex-col lg:flex-row items-center justify-center lg:p-5 p-3 bg-gradient-to-r from-black-primary to-white-secondary rounded-xl shadow-md gap-7">
            <div className="flex-1 text-center lg:text-left flex flex-col md:items-start items-center gap-5 text-white-primary">
                <h2 className="text-2xl lg:text-5xl">
                    {t("text_technology_discovery")}
                </h2>
                <p className="text-gray-300">
                    {t("text_technology_discovery_detail")}
                </p>
                <Link
                    href="/videos"
                    className="bg-white-primary text-black-primary text-center w-1/2 py-3 px-6 rounded-full shadow-lg hover:scale-[1.03] transition-transform flex flex-row items-center justify-center"
                >
                    {t("text_see_now")}
                    <ChevronRight />
                </Link>
            </div>

            <div className="lg:w-2/3 w-full aspect-[3/2]">
                <video
                    src="https://res.cloudinary.com/dk7eaq8b5/video/upload/v1748884093/headphone_main_njqlyt.mp4"
                    autoPlay
                    muted
                    loop
                    className="object-cover w-full h-full rounded-xl shadow-sm"
                />
            </div>
        </div>
    );
}
