"use client";

import { SuggestedProducts } from "./productSuggestion";
import { StoreInformation } from "./storeInformation";

export default function ModernRightSideBar() {
  return (
    <div className="space-y-8 m-4 max-w-full sm:max-w-sm">
      <div className="bg-blue-primary rounded-xl p-2 space-y-6">
        <StoreInformation />
      </div>
      <div className="bg-blue-primary rounded-xl p-2 space-y-6">
        <SuggestedProducts />
      </div>
    </div>
  );
}
