"use client";

import Link from "next/link";

function CommonHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-black-primary">
      <div className="flex flex-row justify-center items-center cursor-pointer ml-3">
        <span className="text-white-secondary text-[19px]">
          <Link
            href="/"
            className="text-sm font-bold text-white-primary hover:text-white-tertiary transition-colors"
          >
            HK-Uptech
          </Link>
        </span>
      </div>
    </header>
  );
}

export default CommonHeader;
