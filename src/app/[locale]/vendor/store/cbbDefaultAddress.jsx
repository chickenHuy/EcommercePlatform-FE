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
import { Label } from "@/components/ui/label";

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
          title: "Nhắc nhở",
          description: error.message,
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
          className="w-1/2 flex items-center justify-between"
        >
          <Label className="text-black-primary hover:cursor-pointer">
            {defaultAddressToUpdate?.defaultAddressStr}
          </Label>
          <CaretSortIcon />
        </Button>
      </PopoverTrigger>
      <div className="bg-yellow-primary">
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Tìm địa chỉ..." />
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
      </div>
    </Popover>
  );
}
