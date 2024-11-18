"use client";

import { ChevronDown, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  createAddress,
  getAddress,
  updateAddress,
} from "@/api/user/addressRequest";
import { toast, useToast } from "@/hooks/use-toast";

// Define the Zod schema for validation
const addressSchema = z.object({
  recipientName: z.string().min(1, "Họ và tên là bắt buộc"),
  phone: z
    .string()
    .min(1, "Số điện thoại là bắt buộc")
    .max(10, "Số điện thoại có tối đa 10 chữ số")
    .regex(/^\d+$/, "Số điện thoại không hợp lệ"),
  province: z.string().min(1, "Vui lòng chọn tỉnh/thành phố"),
  district: z.string().min(1, "Vui lòng chọn quận/huyện"),
  subDistrict: z.string().min(1, "Vui lòng chọn phường/xã"),
  detailAddress: z.string().min(1, "Địa chỉ cụ thể là bắt buộc"),
  isDefault: z.boolean().optional(),
});

export default function AddressForm({ open, onOpenChange, id }) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subDistricts, setSubDistricts] = useState([]);
  const [activeTab, setActiveTab] = useState("province");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddressPopoverOpen, setIsAddressPopoverOpen] = useState(false);

  // Update the useForm hook to use Zod validation
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
  const selectedWard = watch("subDistrict");
  const selectedProvinceCode = watch("provinceCode");
  const selectedDistrictCode = watch("districtCode");

  const selectedAddress = [selectedProvince, selectedDistrict, selectedWard]
    .filter(Boolean)
    .join(", ");

  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then((data) => setProvinces(data));
  }, []);

  useEffect(() => {
    if (selectedProvince && selectedProvinceCode) {
      fetch(
        `https://provinces.open-api.vn/api/p/${selectedProvinceCode}?depth=2`
      )
        .then((res) => res.json())
        .then((data) => {
          setDistricts(data.districts);
          setActiveTab("district");
        });
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (open) {
      reset(); // Reset form về giá trị mặc định
      setSearchQuery(""); // Reset thanh tìm kiếm
      setActiveTab("province"); // Reset tab về Tỉnh/Thành phố
    }
  }, [open, reset]);

  useEffect(() => {
    if (selectedDistrict && selectedDistrictCode) {
      fetch(
        `https://provinces.open-api.vn/api/d/${selectedDistrictCode}?depth=2`
      )
        .then((res) => res.json())
        .then((data) => {
          setSubDistricts(data.wards);
          setActiveTab("subDistrict");
        });
    }
  }, [selectedDistrict]);

  const filteredLocations = () => {
    const query = searchQuery.toLowerCase();
    switch (activeTab) {
      case "province":
        return provinces.filter((p) => p.name.toLowerCase().includes(query));
      case "district":
        return districts.filter((d) => d.name.toLowerCase().includes(query));
      case "subDistrict":
        return subDistricts.filter((w) => w.name.toLowerCase().includes(query));
      default:
        return [];
    }
  };

  const handleLocationSelect = (location) => {
    switch (activeTab) {
      case "province":
        setValue("province", location.name);
        setValue("provinceCode", location.code); // Set the name instead of code
        setValue("district", ""); // Reset district and subDistrict when province changes
        setValue("subDistrict", "");
        break;
      case "district":
        setValue("district", location.name);
        setValue("districtCode", location.code); // Set the name instead of code
        setValue("subDistrict", ""); // Reset subDistrict when district changes
        break;
      case "subDistrict":
        setValue("subDistrict", location.name); // Set the name instead of code
        setIsAddressPopoverOpen(false); // Close the popover after selecting the subDistrict
        break;
    }
    setSearchQuery(""); // Clear the search query after selecting a location
  };

  useEffect(() => {
    if (id && open) {
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
            title: "Thất bại",
            description: error.message,
            variant: "destructive",
          });
        });
    }
  }, [id, open]);

  const onSubmit = (data) => {
    console.log(data);
    const action = id ? updateAddress : createAddress;
    if (id) {
      delete data.isDefault;
    }
    action(data, id)
      .then(() => {
        toast({
          title: "Thành công",
          description: id
            ? "Cập nhật địa chỉ thành công"
            : "Thêm địa chi mới thành công",
          variant: "success",
        });
        onOpenChange(false);
      })
      .catch((error) => {
        toast({
          title: "Thất bại",
          description: error.message,
          variant: "destructive",
        });
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black-tertiary"></DialogOverlay>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {id ? "Sửa địa chỉ" : "Địa chỉ mới"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recipientName">Họ và tên</Label>
              <Input
                id="recipientName"
                {...register("recipientName")}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // Chặn hành động mặc định khi nhấn Enter
                  }
                }}
              />
              {errors.recipientName && (
                <p className="text-red-500 text-sm mt-1 text-error">
                  {errors.recipientName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                {...register("phone")}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // Chặn hành động mặc định khi nhấn Enter
                  }
                }}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1 text-error">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Địa chỉ</Label>
            <Popover
              open={isAddressPopoverOpen}
              onOpenChange={setIsAddressPopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isAddressPopoverOpen}
                  className="w-full justify-between"
                >
                  {selectedAddress || "Tỉnh/Thành phố, Quận/Huyện, Phường/Xã"}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[520px] p-0" align="start">
                <div className="flex items-center border-b p-2">
                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <input
                    placeholder="Tìm kiếm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="w-full justify-start rounded-none border-b">
                    <TabsTrigger
                      value="province"
                      className="flex-1 rounded-none"
                    >
                      Tỉnh/Thành phố
                    </TabsTrigger>
                    <TabsTrigger
                      value="district"
                      className="flex-1 rounded-none"
                      disabled={!selectedProvince}
                    >
                      Quận/Huyện
                    </TabsTrigger>
                    <TabsTrigger
                      value="subDistrict"
                      className="flex-1 rounded-none"
                      disabled={!selectedDistrict}
                    >
                      Phường/Xã
                    </TabsTrigger>
                  </TabsList>
                  <Card className="rounded-none border-0">
                    <div className="max-h-[300px] overflow-y-auto p-1">
                      {filteredLocations().map((location) => (
                        <Button
                          key={location.code}
                          variant="ghost"
                          className="w-full justify-start font-normal"
                          onClick={() => handleLocationSelect(location)}
                        >
                          {location.name}
                        </Button>
                      ))}
                    </div>
                  </Card>
                </Tabs>
              </PopoverContent>
            </Popover>
            {errors.province && (
              <p className="text-red-500 text-sm mt-1 text-error">
                {errors.province.message}
              </p>
            )}
            {errors.district && (
              <p className="text-red-500 text-sm mt-1 text-error">
                {errors.district.message}
              </p>
            )}
            {errors.subDistrict && (
              <p className="text-red-500 text-sm mt-1 text-error">
                {errors.subDistrict.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="detailAddress">Địa chỉ cụ thể</Label>
            <Textarea
              id="detailAddress"
              {...register("detailAddress")}
              placeholder="Số nhà, tên đường..."
              rows={3}
            />
            {errors.detailAddress && (
              <p className="text-red-500 text-sm mt-1 text-error">
                {errors.detailAddress.message}
              </p>
            )}
          </div>

          {!id && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isDefault"
                checked={watch("isDefault")} // Bind the current value
                onCheckedChange={(checked) =>
                  setValue("isDefault", checked || false)
                }
              />
              <Label htmlFor="isDefault">Đặt làm địa chỉ mặc định</Label>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault(); // Ngăn chặn hành động submit mặc định
                onOpenChange(false); // Đóng dialog
              }}
            >
              Hủy
            </Button>

            <Button type="submit">Lưu</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
