"use client";

import { SuggestedProducts } from "./productSuggestion";
import { StoreSuggestedProducts } from "./productSuggestionStore";

export default function ModernRightSideBar() {
  return (
    <div className="space-y-8 m-4 max-w-sm">
      <div className="bg-blue-primary rounded-xl p-2 space-y-6">
        <SuggestedProducts />
      </div>
      <div className="bg-blue-primary rounded-xl p-2 space-y-6">
        <StoreSuggestedProducts />
      </div>
    </div>
  );
}
