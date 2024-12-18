"use client";

import { useDispatch, useSelector } from "react-redux";
import { SuggestedProducts } from "./productSuggestion";
import { StoreInformation } from "./storeInformation";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { setStore } from "@/store/features/userSearchSlice";

export default function ModernRightSideBar(props) {
  const { storeId } = props;
  const dispatch = useDispatch();
  const handleCheckoutStore = () => {
    dispatch(setStore(null));
  }
  return (
    <div className="space-y-2 m-4 max-w-full sm:max-w-sm rounded-xl flex flex-col bg-gray-primary bg-opacity-10 shadow-sm">
      <Button
        className="h-6 w-6 p-0 m-0 r bg-transparent-primary ml-auto"
        onClick={() => handleCheckoutStore()}
      >
        <X className="h-4 w-4 bg-transparent-primary text-gray-primary " />
      </Button>
      <div className="bg-blue-primary bg-opacity-80 rounded-xl p-2 space-y-6 m-2">
        <StoreInformation storeId={storeId} />
      </div>
      <div className="bg-blue-primary bg-opacity-80  rounded-xl p-2 space-y-6 m-2">
        <SuggestedProducts storeId={storeId} />
      </div>
    </div>
  );
}
