"use client";

import { ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createAddress,
  getAddress,
  updateAddress,
} from "@/api/user/addressRequest";
import { useToast } from "@/hooks/use-toast";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "next-intl";

export default function AddressForm({ open, onOpenChange, id, setHasNew, hasNew, setIsAddNewAddress }) {
  const { toast } = useToast();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subDistricts, setSubDistricts] = useState([]);
  const [isProvinceOpen, setIsProvinceOpen] = useState(false);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const [isSubDistrictOpen, setIsSubDistrictOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("AddressForm");

  const addressSchema = z.object({
    recipientName: z.string().min(1, t('addressForm_errors_recipientName')),
    phone: z
      .string()
      .min(1, t('addressForm_errors_phoneRequired'))
      .max(10, t('addressForm_errors_phoneInvalid'))
      .regex(/^\d+$/, t('addressForm_errors_phoneInvalid')),
    province: z.string().min(1, t('addressForm_errors_province')),
    district: z.string().min(1, t('addressForm_errors_district')),
    subDistrict: z.string().min(1, t('addressForm_errors_subDistrict')),
    detailAddress: z.string().min(1, t('addressForm_errors_detailAddress')),
    isDefault: z.boolean().optional(),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      recipientName: "",
      phone: "",
      province: "",
      district: "",
      subDistrict: "",
      detailAddress: "",
      isDefault: false,
    },
  });

  const selectedProvince = watch("province");
  const selectedDistrict = watch("district");
  const selectedProvinceCode = watch("provinceCode");
  const selectedDistrictCode = watch("districtCode");
  const selectedSubdistrict = watch("subDistrict");

  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then((data) => setProvinces(data));
  }, []);

  useEffect(() => {
    if (selectedProvince && selectedProvinceCode) {
      fetch(`https://provinces.open-api.vn/api/p/${selectedProvinceCode}?depth=2`)
        .then((res) => res.json())
        .then((data) => setDistricts(data.districts));
    }
  }, [selectedProvince, selectedProvinceCode]);

  useEffect(() => {
    if (selectedDistrict && selectedDistrictCode) {
      fetch(`https://provinces.open-api.vn/api/d/${selectedDistrictCode}?depth=2`)
        .then((res) => res.json())
        .then((data) => setSubDistricts(data.wards));
    }
  }, [selectedDistrict, selectedDistrictCode]);

  useEffect(() => {
    if (open) {
      reset();
      if (id) {
        getAddress(id)
          .then((response) => {
            const {
              recipientName,
              phone,
              province,
              district,
              subDistrict,
              detailAddress,
              isDefault,
            } = response.result;

            setValue("recipientName", recipientName);
            setValue("phone", phone);
            setValue("province", province);
            setValue("district", district);
            setValue("subDistrict", subDistrict);
            setValue("detailAddress", detailAddress);
            setValue("isDefault", isDefault);
          })
          .catch((error) => {
            toast({
              title: t('addressForm_toast_notify'),
              description: error.message,
              variant: "destructive",
            });
          });
      }
    }
  }, [open, reset, id, setValue, toast]);

  const onSubmit = async (data) => {
    setIsLoading(true);

    const action = id ? updateAddress : createAddress;
    if (id) {
      delete data.isDefault;
    }
    try {
      await action(data, id);
      toast({
        title: t('addressForm_toast_notify'),
        description: id
          ? t('addressForm_toast_success_update')
          : t('addressForm_toast_success_create'),
      });
      if (setHasNew) {
        setHasNew(!hasNew);
      }
      onOpenChange(false);
    }
    catch (error) {
      toast({
        title: t('addressForm_toast_notify'),
        description: error.message,
        variant: "destructive",
      });
    }
    finally {
      setIsAddNewAddress(true);
      setIsLoading(false);
    }
  };

  const renderLocationSelect = (
    label,
    options,
    state,
    setState,
    selected,
    setSelected,
    setCode,
    errors
  ) => (
    <div className="flex flex-col space-y-1">
      <span>
        {label} <span className="text-red-primary"> ( * )</span>
      </span>
      <Popover open={state} onOpenChange={setState}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-between">
            {selected || label}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Command>
            <CommandInput placeholder={t('addressForm_command_placeholder')} />
            <CommandList>
              <CommandEmpty>{t('addressForm_command_empty')}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.code}
                    value={option.name}
                    onSelect={(value) => {
                      const selectedOption = options.find((p) => p.name === value);
                      if (selectedOption) {
                        setValue(setSelected, selectedOption.name);
                        if (setCode) {
                          setValue(setCode, selectedOption.code);
                        }
                        setState(false);
                      }
                    }}
                  >
                    {option.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {errors && (
        <p className="text-red-500 text-sm mt-1 text-red-primary">
          {errors.message}
        </p>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="opacity-50 bg-black-tertiary" />
      <DialogContent className="sm:max-w-[600px] sm:p-10 p-2 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-[1.5em] text-center py-3">
            {id ? t('addressForm_title_update') : t('addressForm_title_create')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 text-[.9em]">
          <div className="flex flex-col lg:flex-row justify-between gap-4">
            <div className="space-y-1 w-full">
              <span>{t('addressForm_recipientName')}<span className="text-red-primary"> ( * )</span></span>
              <Input id="recipientName" placeholder={t('addressForm_recipientName')} {...register("recipientName")} onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }} />
              {errors.recipientName && <p className="text-red-500 text-sm mt-1 text-red-primary">{errors.recipientName.message}</p>}
            </div>
            <div className="space-y-1 w-full">
              <span>{t('addressForm_phone')}<span className="text-red-primary"> ( * )</span></span>
              <Input id="phone" placeholder={t('addressForm_phone')} {...register("phone")} onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }} />
              {errors.phone && <p className="text-red-500 text-sm mt-1 text-red-primary">{errors.phone.message}</p>}
            </div>
          </div>

          {renderLocationSelect(
            t('addressForm_province'),
            provinces,
            isProvinceOpen,
            setIsProvinceOpen,
            selectedProvince,
            "province",
            "provinceCode",
            errors.province
          )}
          {renderLocationSelect(
            t('addressForm_district'),
            districts,
            isDistrictOpen,
            setIsDistrictOpen,
            selectedDistrict,
            "district",
            "districtCode",
            errors.district
          )}
          {renderLocationSelect(
            t('addressForm_subDistrict'),
            subDistricts,
            isSubDistrictOpen,
            setIsSubDistrictOpen,
            selectedSubdistrict,
            "subDistrict",
            null,
            errors.subDistrict
          )}
          <div className="space-y-1">
            <div className="w-full h-fit flex flex-row justify-between items-center">
              <span>{t('addressForm_detailAddress')}<span className="text-red-primary"> ( * )</span></span>
            </div>
            <Textarea id="detailAddress" {...register("detailAddress")} placeholder={t('addressForm_detailAddress')} rows={3} />
            {errors.detailAddress && <p className="text-sm mt-1 text-red-primary">{errors.detailAddress.message}</p>}
          </div>

          {!id && (
            <div className="flex items-center space-x-2">
              <Checkbox id="isDefault" checked={watch("isDefault")} onCheckedChange={(checked) => setValue("isDefault", checked || false)} />
              <span className="pt-1">{t('addressForm_isDefault')}</span>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={(e) => { e.preventDefault(); onOpenChange(false); }} className='px-10'>{t('addressForm_buttons_cancel')}</Button>
            <Button className='px-10 relative' type="submit">
              {isLoading ? (
                <div className="global_loading_icon white"></div>
              ) : t('addressForm_buttons_save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}