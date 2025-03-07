"use client";

import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
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
import { useTranslations } from "next-intl";

export default function CbbAddresses({
  isAddNewAddress,
  setIsAddNewAddress,
  onAddressSelect,
  defaultAddressToUpdate,
}) {
  const [open, setOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const t = useTranslations("AddressForm");

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await getAddressOfStore();
        setAddresses(response.result);
      } catch (error) {
        setAddresses([]);
      }
    };

    if (isAddNewAddress === null) {
      return;
    }
    else {
      if (isAddNewAddress) {
        fetchAddresses();
        setIsAddNewAddress(false);
        return;
      }
    }
    fetchAddresses();
  }, [onAddressSelect, defaultAddressToUpdate, isAddNewAddress]);

  const handleSelect = (address) => {
    onAddressSelect(address);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="w-full">
        <div className="flex items-center justify-between w-full h-10 flex-row border-[1px] shadow-sm px-2 py-1 rounded-md">
          <span className="text-left">
            {defaultAddressToUpdate?.defaultAddressStr}
          </span>
          <CaretSortIcon />
        </div>
      </PopoverTrigger>
      <PopoverContent className="z-50 w-full">
        <Command>
          <CommandInput placeholder={t('addressForm_command_placeholder')} />
          <CommandList>
            <CommandEmpty>{t('addressForm_command_empty')}</CommandEmpty>
            {addresses.map((address, index) => (
              <CommandItem
                key={address.defaultAddressId}
                onSelect={() => handleSelect(address)}
                className='cursor-pointer'
              >
                {index + 1 + ': ' + address.defaultAddressStr}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
