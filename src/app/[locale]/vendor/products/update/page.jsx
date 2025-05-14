"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import BasicInformation from "../create/_content/basicInformation";
import {
  deleteListProductImage,
  getProductById,
  updateProduct,
  uploadListProductImage,
  uploadMainProductImage,
} from "@/api/vendor/productRequest";
import { useToast } from "@/hooks/use-toast";
import { getListAllBrand } from "@/api/admin/brandRequest";
import ImageDropzone from "@/components/uploads/imageDropZone";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/components/loading";
import { useTranslations } from "next-intl";

export default function ProductUpdatePage() {
  const searchParam = useSearchParams();
  const id = searchParam.get("id");
  const { toast } = useToast();
  const router = useRouter();
  const t = useTranslations("Vendor.create_update_product");

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState({
    basicInfo: false,
    mainImage: false,
    listImage: false,
  });
  const [product, setProduct] = useState(null);

  const [listBrand, setListBrand] = useState([]);
  const [brandIdSelected, setBrandIdSelected] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [productImagesDelete, setProductImagesDelete] = useState([]);
  const [mainProductImage, setMainProductImage] = useState(null);
  const [productVideo, setProductVideo] = useState(null);
  const [productName, setProductName] = useState("");
  const [productBrand, setProductBrand] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productDetails, setProductDetails] = useState("");
  const [productDescription, setProductDescription] = useState("");

  useEffect(() => {
    setIsLoading(true);
    if (id) {
      try {
        getListAllBrand().then((response) => {
          setListBrand(response.result);
        });

        getProductById(id).then((response) => {
          setProduct(response.result);
          setProductName(response.result.name);
          setProductDescription(response.result.description);
          setProductBrand(response.result.brand.id);
          setBrandIdSelected(response.result.brand.id);
          setProductDetails(response.result.details);

          setIsLoading(false);
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: t("notify"),
          description: t("load_product_fail", { error: error.message }),
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: t("notify"),
        description: t("product_id_not_found"),
      });
      router.back();
    }
  }, []);

  const handleUpdateBasicInfo = async () => {
    if (
      productName === "" ||
      productDescription === "" ||
      productDetails === "" ||
      brandIdSelected === null
    ) {
      toast({
        variant: "destructive",
        title: t("notify"),
        description: t("please_complete", {
          info: t("basic_product_information"),
        }),
      });
    } else {
      try {
        setIsUpdate((prev) => ({
          ...prev,
          basicInfo: true,
        }));
        await updateProduct(product.id, {
          name: productName,
          description: productDescription,
          details: productDetails,
          brandId: brandIdSelected,
          quantity: product.quantity,
          originalPrice: product.originalPrice,
          salePrice: product.salePrice,
          available: product.available,
        });

        toast({
          title: t("notify"),
          description: t("update_success", {
            info: t("basic_product_information"),
          }),
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: t("notify"),
          description: t("update_fail", {
            error: error.message,
          }),
        });
      } finally {
        setIsUpdate((prev) => ({
          ...prev,
          basicInfo: false,
        }));
      }
    }
  };

  const handleUpdateMainImage = async () => {
    if (!mainProductImage) {
      toast({
        variant: "destructive",
        title: t("notify"),
        description: t("please_complete", { info: t("main_product_image") }),
      });
    } else {
      setIsUpdate((prev) => ({
        ...prev,
        mainImage: true,
      }));
      try {
        await uploadMainProductImage(mainProductImage, id);
        toast({
          title: t("notify"),
          description: t("update_success", {
            info: t("main_product_image"),
          }),
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: t("notify"),
          description: t("update_fail", {
            error: error.message,
          }),
        });
      } finally {
        setIsUpdate((prev) => ({
          ...prev,
          mainImage: false,
        }));
      }
    }
  };

  const handleUpdateImageList = async () => {
    if (productImages.length === 0 && productImagesDelete.length === 0) {
      toast({
        title: t("notify"),
        description: t("update_success", { info: t("product_image_list") }),
      });
      return;
    }
    try {
      setIsUpdate((prev) => ({
        ...prev,
        listImage: true,
      }));
      if (productImages.length !== 0) {
        await uploadListProductImage(productImages, product.id);
      }
      if (productImagesDelete.length !== 0) {
        await deleteListProductImage(
          { listImageIds: productImagesDelete },
          product.id,
        );
      }
      toast({
        title: t("notify"),
        description: t("update_success", { info: t("product_image_list") }),
      });
    } catch (error) {
      toast({
        title: t("notify"),
        variant: "destructive",
        description: t("update_fail", { error: error.message }),
      });
    } finally {
      setIsUpdate((prev) => ({
        ...prev,
        listImage: false,
      }));
    }
  };

  const handleUpdateVideo = async () => {
    toast({
      title: "Thông báo",
      description: "Chức năng cập nhật video đang được phát triển.",
    });
  };

  const handleUpdateDetailInfo = async () => {
    toast({
      title: "Thông báo",
      description:
        "Chức năng cập nhật thông tin chi tiết đang được phát triển.",
    });
  };

  const handleUpdateSaleInfo = async () => {
    toast({
      title: "Thông báo",
      description:
        "Chức năng cập nhật thông tin bán hàng đang được phát triển.",
    });
  };

  const handleUpdateVariantInfo = async () => {
    toast({
      title: "Thông báo",
      description: "Chức năng cập nhật biến thể đang được phát triển.",
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full h-fit flex flex-col gap-5 px-4 py-20">
      <Card>
        <CardHeader>
          <CardTitle className="text-[1.2em] font-[900]">
            {t("basic_information")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <BasicInformation
            productName={productName}
            setProductName={setProductName}
            productDescription={productDescription}
            productDetails={productDetails}
            setProductDetails={setProductDetails}
            setProductDescription={setProductDescription}
            listBrand={listBrand}
            setBrandIdSelected={setBrandIdSelected}
            productBrand={productBrand}
            setProductBrand={setProductBrand}
            isUpdate={true}
          />
          <div className="w-full h-fit p-5 flex justify-end items-center">
            <Button className="relative" onClick={handleUpdateBasicInfo}>
              <span className={isUpdate["basicInfo"] ? "invisible" : ""}>
                {t("update_info", { info: t("basic_information") })}
              </span>

              {isUpdate["basicInfo"] && (
                <div className="global_loading_icon white"></div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-[1.2em] font-[900]">
            {t("main_product_image")}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5">
          <div className="w-full flex flex-col gap-3 px-1">
            <div className="text-[1em]">
              {t("upload_main_product_image")}
              <span className="px-3 text-red-primary font-[900]">( * )</span>
            </div>
            <ImageDropzone
              onImageUpload={setMainProductImage}
              mainImageUrl={product?.mainImageUrl}
              multiple={false}
              maxFiles={1}
              isUpdate={true}
              id={product?.id}
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button className="relative" onClick={handleUpdateMainImage}>
              <span className={isUpdate["mainImage"] ? "invisible" : ""}>
                {t("update_info", { info: t("main_product_image") })}
              </span>

              {isUpdate["mainImage"] && (
                <div className="global_loading_icon white"></div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-[1.2em] font-[900]">
            {t("product_image_list")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="w-full flex flex-col gap-3 px-1">
            <div>
              {t("product_image_list")}
              <span className="px-3 text-red-primary font-[900]">( * )</span>
            </div>
            <ImageDropzone
              onImageUpload={setProductImages}
              listImageUrl={product?.images}
              multiple={true}
              isUpdate={true}
              productId={product?.id}
              setProductImagesDelete={setProductImagesDelete}
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button className="relative" onClick={handleUpdateImageList}>
              <span className={isUpdate["listImage"] ? "invisible" : ""}>
                {t("update_info", { info: t("product_image_list") })}
              </span>

              {isUpdate["listImage"] && (
                <div className="global_loading_icon white"></div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Video Section */}
      <Card className="mb-6 shadow-sm">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-lg">Video sản phẩm</CardTitle>
          <p className="text-sm text-gray-500">
            Video sẽ được hiển thị trên danh sách sản phẩm trong trang chủ, danh
            mục sản phẩm
          </p>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="w-full flex flex-col gap-3">
            <p className="text-sm italic">Chức năng đang được phát triển</p>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={handleUpdateVideo}>Lưu video sản phẩm</Button>
          </div>
        </CardContent>
      </Card>

      {/* Detail Information Section */}
      <Card className="mb-6 shadow-sm">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-lg">Thông tin chi tiết</CardTitle>
          <p className="text-sm text-gray-500">
            Thông tin chi tiết bao gồm các thông số kỹ thuật của sản phẩm
          </p>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="w-full flex flex-col gap-3">
            <p className="text-sm italic">Chức năng đang được phát triển</p>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={handleUpdateDetailInfo}>
              Lưu thông tin chi tiết
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sale Information Section */}
      <Card className="mb-6 shadow-sm">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-lg">Thông tin bán hàng</CardTitle>
          <p className="text-sm text-gray-500">
            Thông tin bán hàng bao gồm giá gốc, giá bán và số lượng của sản phẩm
          </p>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="w-full flex flex-col gap-3">
            <p className="text-sm italic">Chức năng đang được phát triển</p>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={handleUpdateSaleInfo}>
              Lưu thông tin bán hàng
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Variant Information Section */}
      <Card className="mb-6 shadow-sm">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-lg">Thông tin biến thể</CardTitle>
          <p className="text-sm text-gray-500">
            Thông tin gồm giá gốc, giá bán và số lượng của các biến thể của sản
            phẩm
          </p>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="w-full flex flex-col gap-3">
            <p className="text-sm italic">Chức năng đang được phát triển</p>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={handleUpdateVariantInfo}>
              Lưu thông tin biến thể
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="ghost">Đóng</Button>
      </div>
    </div>
  );
}
