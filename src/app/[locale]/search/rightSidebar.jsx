"use client";

import { SuggestedProducts } from "./productSuggestion";
import { StoreInformation } from "./storeInformation";

export default function ModernRightSideBar({ storeId, t }) {
  return (
    <div className="rounded-lg border w-full min-h-full flex flex-col gap-3 bg-blue-tertiary py-3 px-2">
      <div>
        <StoreInformation storeId={storeId} t={t} />
      </div>
      <div>
        <SuggestedProducts storeId={storeId} t={t} />
      </div>
    </div>
  );
}
