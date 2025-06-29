"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import BasicInformation from "../create/_content/basicInformation";
import {
  createProduct,
  deleteListProductImage,
  getProductById,
  updateProduct,
  updateProductComponentValue,
  updateProductVariant,
  uploadListProductImage,
  uploadMainProductImage,
  uploadMainProductVideo,
} from "@/api/vendor/productRequest";
import { useToast } from "@/hooks/use-toast";
import { getListAllBrand } from "@/api/admin/brandRequest";
import ImageDropzone from "@/components/uploads/imageDropZone";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/components/loading";
import { useTranslations } from "next-intl";
import VideoDropzone from "@/components/uploads/videoDropZone";
import DetailInformation from "../create/_content/detailInformation";
import SellerInformation from "../create/_content/sellerInformation";

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
    video: false,
    detail: false,
    variant: false,
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
  const [productComponents, setProductComponents] = useState([]);
  const [productVariants, setProductVariants] = useState([]);
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
          setProductVariants(response.result.variants);

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
    if (!productVideo) {
      toast({
        variant: "destructive",
        title: t("notify"),
        description: t("list_video_empty"),
      });
      return;
    }
    try {
      setIsUpdate((prev) => ({
        ...prev,
        video: true,
      }));
      await uploadMainProductVideo(productVideo, product.id);
      toast({
        title: t("notify"),
        description: t("update_success", { info: t("main_product_video") }),
      });
    }
    catch (error) {
      toast({
        title: t("notify"),
        variant: "destructive",
        description: t("update_fail", { error: error.message }),
      });
    }
    finally {
      setIsUpdate((prev) => ({
        ...prev,
        video: false,
      }));
    }
  };

  const handleUpdateDetailInfo = async () => {

    const allRequiredFilled = product?.components
      .filter((component) => component.required)
      .every((component) => productComponents[component.id]?.trim().length > 0);

    if (!allRequiredFilled) {
      toast({
        variant: "destructive",
        title: t("notify"),
        description: t("please_complete", {
          info: t("advance_product_information"),
        }),
      });
      return;
    }

    try {
      setIsUpdate((prev) => ({
        ...prev,
        detail: true,
      }));

      await Promise.all(
        product?.components.map((component) =>
          updateProductComponentValue(
            { value: productComponents[component.valueId] },
            component.valueId,
          ),
        ),
      );
      toast({
        title: t("notify"),
        description: t("update_success", { info: t("advance_product_information") }),
      });
    }
    catch (error) {
      toast({
        title: t("notify"),
        variant: "destructive",
        description: t("update_fail", { error: error.message }),
      });
    }
    finally {
      setIsUpdate((prev) => ({
        ...prev,
        detail: false,
      }));
    }
  };

  const checkVariantData = () => {
    console.log("productVariants", productVariants);
    const hasValidVariantProducts = productVariants.every(
      (product) =>
        product.originalPrice?.toString().trim() !== "" &&
        product.salePrice?.toString().trim() !== "" &&
        product.quantity?.toString().trim() !== "" &&
        Array.isArray(product.values)
    );

    return hasValidVariantProducts;
  };

  const convertMoneyToNumber = (value) => {
    if (typeof value === "number") {
      return value;
    }
    return Number(value.replace(/\./g, ""));
  };

  const handleUpdateSaleInfo = async () => {
    if (!checkVariantData()) {
      toast({
        variant: "destructive",
        title: t("notify"),
        description: t("please_complete", {
          info: t("sales_information"),
        }),
      });
      return;
    }

    try {
      setIsUpdate((prev) => ({
        ...prev,
        variant: true,
      }));

      await Promise.all(
        productVariants.map((variant) =>
          updateProductVariant(
            {
              originalPrice: convertMoneyToNumber(variant.originalPrice),
              salePrice: convertMoneyToNumber(variant.salePrice),
              quantity: parseInt(variant.quantity),
              available: variant.available,
            },
            variant.id,
          ),
        ),
      );
      toast({
        title: t("notify"),
        description: t("update_success", { info: t("sales_information") }),
      });
    }
    catch (error) {
      toast({
        title: t("notify"),
        variant: "destructive",
        description: t("update_fail", { error: error.message }),
      });
    }
    finally {
      setIsUpdate((prev) => ({
        ...prev,
        variant: false,
      }));
    }
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
      <Card className="shadow-sm">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-[1.2em] font-[900]">
            {t("main_product_video")}
          </CardTitle>
          <div>
            {t("upload_product_video")}
            <span className="px-3 text-red-primary font-[900]">( * )</span>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <VideoDropzone currentVideoUrl={product?.videoUrl} onVideoUpload={setProductVideo} />
          <div className="flex justify-end mt-4">
            <Button className="relative" onClick={handleUpdateVideo}>
              <span className={isUpdate["video"] ? "invisible" : ""}>
                {t("update_info", { info: t("main_product_video") })}
              </span>

              {isUpdate["video"] && (
                <div className="global_loading_icon white"></div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detail Information Section */}
      <Card className="mb-6 shadow-sm">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-[1.2em] font-[900]">
            {t("advance_product_information")}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <DetailInformation listComponents={product?.components} setFormData={setProductComponents} formData={productComponents} isUpdate={true} />
          <div className="flex justify-end mt-4 px-5">
            <Button className="relative" onClick={handleUpdateDetailInfo}>
              <span className={isUpdate["detail"] ? "invisible" : ""}>
                {t("update_info", { info: t("advance_product_information") })}
              </span>

              {isUpdate["detail"] && (
                <div className="global_loading_icon white"></div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {
        product?.variants && product.variants.length > 0 &&
        <Card className="mb-6 shadow-sm">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-[1.2em] font-[900]">
              {t("sales_information")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="w-full flex flex-col gap-3">
              <SellerInformation isUpdate={true} variantData={productVariants} setVariantOfProducts={setProductVariants} />
            </div>
            <div className="flex justify-end mt-4">
              <Button className="relative" onClick={handleUpdateSaleInfo}>
                <span className={isUpdate["variant"] ? "invisible" : ""}>
                  {t("update_info", { info: t("sales_information") })}
                </span>

                {isUpdate["variant"] && (
                  <div className="global_loading_icon white"></div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      }

      {/* Variant Information Section */}
      {/* <Card className="mb-6 shadow-sm">
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
      </Card> */}

    </div>
  );
}
