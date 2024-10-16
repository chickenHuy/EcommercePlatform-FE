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

export default function DialogImageBrand(props) {
  const { isOpen, onClose, brand, refreshData } = props;
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    brand.logoUrl || iconNotFound
  );

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadBrandLogo = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("logo", file);
    try {
      console.log("Uploading brand logo with ID:", brand.id);
      await uploadBrandLogo(brand.id, formData);
      console.log("Upload success response:", response);
      //refreshData();
      onClose();
    } catch (error) {
      console.error("Failed to update brand logo:", error);
      console.log(
        "Error data:",
        error.response ? error.response.formData : "No response formData"
      );
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
        <form className="space-y-4">
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
              onChange={handleFileChange}
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleUploadBrandLogo}>
              Cập nhật
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
