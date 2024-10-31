"use client";

import { CaretSortIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useEffect } from "react";
import { getAddressStore } from "@/api/vendor/storeRequest";

export default function CbbAddresses({ onAddressSelect, selectedAddress }) {
  const [open, setOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const userId = "acc3420c-5db5-481e-b2e7-761cad8263d5";
    const fetchAddresses = async () => {
      try {
        const response = await getAddressStore(userId);
        setAddresses(response.result);
        if (!selectedAddress && response.result.length > 0) {
          const defaultAddress = response.result[0];
          onAddressSelect(defaultAddress);
        }
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      }
    };
    fetchAddresses();
  }, [onAddressSelect, selectedAddress]);

  const handleSelect = (address) => {
    onAddressSelect(address);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedAddress
            ? selectedAddress.defaultAddressStr
            : "Chọn địa chỉ mặc định..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Tìm địa chỉ..." className="h-9" />
          <CommandList>
            {addresses.map((address) => (
              <CommandItem
                key={address.defaultAddressId}
                onSelect={() => handleSelect(address)}
              >
                {address.defaultAddressStr}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
