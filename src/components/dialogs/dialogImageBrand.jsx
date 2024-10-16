"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import iconNotFound from "../../../public/images/iconNotFound.png";
import { uploadBrandLogo } from "@/api/admin/brandRequest";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

export default function DialogImageBrand(props) {
  const { isOpen, onClose, brand, refreshData } = props;
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    brand.logoUrl || iconNotFound
  );
  const { toast } = useToast();
  const [logoUrl, setLogoUrl] = useState(brand ? brand.logoUrl : iconNotFound);

  const handleFileChange = (event) => {
    const temp = event.target.files[0];
    if (temp) {
      setFile(temp);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(temp);
    }
  };

  const handleUploadBrandLogo = async () => {
    console.log(file);
    if (!file) {
      toast({
        title: "Thất bại",
        description: "Vui lòng chọn một tệp để tải lên",
        variant: "destructive",
      });
      return;
    }

    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Thất bại",
        description: "Chỉ chấp nhận các tệp JPG hoặc PNG",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Uploading brand logo with ID: ", brand.id);
      const response = await uploadBrandLogo(brand.id, file);
      setLogoUrl(response.result.logoUrl);
      console.log("Upload success response: ", response);
      toast({
        title: "Thành công",
        description: "Thay đổi ảnh thương hiệu thành công",
      });
      refreshData();
      onClose();
    } catch (error) {
      console.error("Failed to update brand logo:", error);
      toast({
        title: "Thất bại",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Cập nhật logo thương hiệu</DialogTitle>
          <DialogDescription>
            Sản phẩm thuộc danh mục có thương hiệu này sẽ có thể chọn logo để
            cập nhật
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Label>Đang cập nhật logo cho thương hiệu : {brand.name}</Label>
          <div className="flex flex-col items-center space-y-4">
            <Image
              alt="Logo thương hiệu"
              className="aspect-square rounded-md object-cover"
              src={imagePreview}
              width="192"
              height="192"
              unoptimized
              priority
            />
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e)}
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button type="submit" onClick={() => handleUploadBrandLogo()}>
              Cập nhật
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
