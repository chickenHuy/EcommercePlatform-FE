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
import { getAddressOfStore } from "@/api/vendor/storeRequest";
import { toast } from "@/hooks/use-toast";

export default function CbbAddresses({
  onAddressSelect,
  defaultAddressToUpdate,
}) {
  const [open, setOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await getAddressOfStore();
        console.log("fetchAddresses: ", response.result);
        setAddresses(response.result);
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
        toast({
          title: "Thất bại",
          description: error.message,
          variant: "destructive",
        });
      }
    };
    fetchAddresses();
  }, [onAddressSelect, defaultAddressToUpdate]);

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
          className="w-[300px] justify-between"
        >
          <span>{defaultAddressToUpdate?.defaultAddressStr}</span>
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
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
