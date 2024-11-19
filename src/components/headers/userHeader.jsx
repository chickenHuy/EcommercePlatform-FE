"use client";

import { User, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchWithSuggestions } from "../searchBars/userSearch";

const UserHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent-primary">
      <div className="container mx-auto px-4 py-2 sm:px-6 sm:py-3">
        <div className="w-full bg-black-primary text-white rounded-lg">
          <div className="flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6">
            <Link
              href="/"
              className="text-sm font-bold text-white-primary hover:text-white-tertiary transition-colors"
            >
              HK-Uptech
            </Link>

            <div className="flex-1 flex justify-center px-4">
              <SearchWithSuggestions />
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white-primary"
              >
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white-primary relative"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
                <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold flex items-center justify-center">
                  2
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
