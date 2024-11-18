"use client";
import { Search, User, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "../logo";
import { Input } from "../inputs/input";
const UserHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent-primary">
      <div className="container mx-auto px-12 py-5">
        <header className="w-full bg-black-primary text-white rounded-lg">
          <div className="flex h-16 items-center justify-between px-8">
            <div className="hidden md:flex items-center font-bold">
              <Link
                href="/"
                className="px-5 text-sm text-white-primary hover:text-white-tertiary transition-colors"
              >
                HK-Uptech
              </Link>
            </div>
            <div className="w-full max-w-[480px] m-10 h-8 bg-black-secondary outline-2 outline-black-secondary  relative rounded-lg">
              <Input className="bg-black-secondary outline-1 outline-black-secondary text-white-primary w-full h-full pr-2 pl-2 rounded-lg font-light" />
              <button className="absolute top-0 right-0 h-full p-2 text-white-primary rounded-r-md hover:text-gray-tertiary">
                <Search className="h-full text-white-primary" />
                <span className="sr-only">Search</span>
              </button>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-6">
              <button className="hover:text-gray-300 transition-colors">
                <User className="h-5 w-5 text-white-primary" />
                <span className="sr-only">Account</span>
              </button>
              <button className="relative hover:text-gray-300 transition-colors">
                <ShoppingCart className="h-5 w-5 text-white-primary" />
                <span className="sr-only">Cart</span>
                <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold flex items-center justify-center">
                  2
                </span>
              </button>
            </div>
          </div>
        </header>
      </div>
    </header>
  );
};

export default UserHeader;
