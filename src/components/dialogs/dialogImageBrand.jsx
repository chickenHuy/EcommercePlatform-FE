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
import brandEmpty from "@/assets/images/brandEmpty.jpg";
import { uploadBrandLogo } from "@/api/admin/brandRequest";
import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

export default function DialogImageBrand(props) {
  const {
    isOpen,
    onClose,
    brandImage,
    refreshPage,
    title,
    description,
    nameButton,
    tableName,
    setLoading,
  } = props;
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    brandImage.logoUrl || brandEmpty
  );
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const tempFile = event.target.files[0];
    if (tempFile) {
      setFile(tempFile);
      const objectUrl = URL.createObjectURL(tempFile);
      setImagePreview(objectUrl);
    }
  };

  const handleUploadBrandLogo = async () => {
    if (!file) {
      toast({
        title: "Thất bại",
        description: "Vui lòng chọn một tệp để tải lên",
        variant: "destructive",
      });
      return;
    }

    const validTypes = ["image/jpg", "image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Thất bại",
        description: "Chỉ chấp nhận các tệp JPG, JPEG, PNG",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await uploadBrandLogo(brandImage.id, file);
      toast({
        title: "Thành công",
        description: "Thay đổi logo thương hiệu thành công",
      });
      refreshPage();
      onClose();
    } catch (error) {
      console.error("Failed to update brand logo:", error);
      toast({
        title: "Thất bại",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Label className="font-semibold">
            {tableName} : <strong>{brandImage.name}</strong>
          </Label>
          <div className="flex flex-col items-center space-y-4">
            <Image
              alt="Logo thương hiệu"
              className="aspect-square rounded-md object-cover"
              src={imagePreview}
              width={250}
              height={250}
              unoptimized
              priority
            />
            <div className="w-full flex items-center justify-center">
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e)}
                style={{ display: "none" }}
              />
              <Button
                onClick={handleFileInputClick}
                variant="outline"
                className="w-2/3 text-sm font-bold"
              >
                Chọn Ảnh
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={() => handleUploadBrandLogo()}
              className="m-2 font-bold"
            >
              {nameButton}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
