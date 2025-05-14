"use client";
import { useState, useEffect } from "react";
import { Link } from "react-scroll";
import styles from "./content.module.css";
import BasicInformation from "./basicInformation";
import DetailInformation from "./detailInformation";
import SellerInformation from "./sellerInformation";
import OtherImformation from "./otherInformation";
import { getAll } from "@/api/admin/categoryRequest";
import { getComponentOfCategory } from "@/api/admin/componentRequest";
import { Toaster } from "@/components/ui/toaster";
import CompleteNotify from "@/components/notifies/complete";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getListAllBrand } from "@/api/admin/brandRequest";
import Loading from "@/components/loading";
import {
  createProduct,
  uploadListProductImage,
  uploadMainProductImage,
  uploadMainProductVideo,
} from "@/api/vendor/productRequest";
import { useTranslations } from "next-intl";

export default function Content() {
  const [activeSection, setActiveSection] = useState("about");
  const [listCategory, setListCategory] = useState([]);
  const [categoryIdSelected, setCategoryIdSelected] = useState(null);
  const [listBrand, setListBrand] = useState([]);
  const [brandIdSelected, setBrandIdSelected] = useState(null);
  const [listComponents, setListComponent] = useState([]);
  const [isLoading, setIsLoading] = useState(null);
  const { toast } = useToast();
  const t = useTranslations("Vendor.create_update_product");

  // State for basic information
  const [productImages, setProductImages] = useState([]);
  const [mainProductImage, setMainProductImage] = useState(null);
  const [productVideo, setProductVideo] = useState(null);
  const [productName, setProductName] = useState("");
  const [productBrand, setProductBrand] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productDetails, setProductDetails] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [isCompleteBasic, setIsCompleteBasic] = useState(false);

  useEffect(() => {
    const isComplete =
      productImages.length > 0 &&
      productVideo !== null &&
      mainProductImage !== null &&
      productName.trim() !== "" &&
      productCategory !== "" &&
      productBrand !== "" &&
      productDetails.trim() !== "" &&
      productDescription.trim().length <= 255 &&
      productDescription.trim() !== "";

    setIsCompleteBasic(isComplete);
  }, [
    productImages,
    productVideo,
    productName,
    productDetails,
    productCategory,
    productDescription,
    mainProductImage,
    productBrand,
  ]);

  // State for detail information
  // Structure of formData: { [componentId]: value }
  const [formData, setFormData] = useState([]);
  const [isCompleteDetail, setIsCompleteDetail] = useState(false);
  useEffect(() => {
    if (!categoryIdSelected) {
      setIsCompleteDetail(false);
    } else {
      const allRequiredFilled = listComponents
        .filter((component) => component.required)
        .every((component) => formData[component.id]?.trim().length > 0);

      setIsCompleteDetail(allRequiredFilled);
    }
  }, [formData, listComponents, categoryIdSelected]);

  // State for seller information
  const [isHaveVariant, setIsHaveVariant] = useState(false);
  const [variantData, setVariantData] = useState({});
  const [variantCount, setVariantCount] = useState(0);
  const [variantOfProducts, setVariantOfProducts] = useState([]);
  const [originalPrice, setOriginalPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isCompleteSale, setIsCompleteSale] = useState(false);
  useEffect(() => {
    const checkNoVariant = () => {
      return (
        originalPrice.trim() !== "" &&
        salePrice.trim() !== "" &&
        quantity.trim() !== ""
      );
    };

    const checkVariantData = () => {
      const hasValidVariantData = Object.values(variantData).every(
        (variant) =>
          variant.name.trim() !== "" &&
          Array.isArray(variant.options) &&
          variant.options.length > 0,
      );

      const hasValidVariantProducts = variantOfProducts.every(
        (product) =>
          product.originalPrice?.trim() !== "" &&
          product.salePrice?.trim() !== "" &&
          product.quantity?.trim() !== "" &&
          Array.isArray(product.values) &&
          product.values.length === Object.keys(variantData).length,
      );

      return hasValidVariantData && hasValidVariantProducts;
    };

    if (!isHaveVariant) {
      setIsCompleteSale(checkNoVariant());
    } else {
      setIsCompleteSale(checkVariantData());
    }
  }, [
    isHaveVariant,
    originalPrice,
    salePrice,
    quantity,
    variantData,
    variantOfProducts,
  ]);

  // State for other information
  const [isDefaultDelivery, setIsDefaultDelivery] = useState(false);
  const [isCompleteOther, setIsCompleteOther] = useState(false);
  useEffect(() => {
    setIsCompleteOther(isDefaultDelivery);
  }, [isDefaultDelivery]);

  useEffect(() => {
    setActiveSection("basic");

    getAll().then((response) => {
      setListCategory(response.result);
    });
    getListAllBrand().then((response) => {
      setListBrand(response.result);
    });
  }, []);

  useEffect(() => {
    if (categoryIdSelected) {
      getComponentOfCategory(categoryIdSelected)
        .then((response) => {
          setListComponent(response.result);
        })
        .catch(() => {
          setListComponent([]);
        });
    }
  }, [categoryIdSelected]);

  const createComponentsDataArray = () => {
    return listComponents.map((component) => ({
      id: component.id,
      value: formData[component.id] || "",
    }));
  };

  const createAttributesHasValues = () => {
    return Object.keys(variantData).map((key) => {
      const variant = variantData[key];
      return {
        name: variant.name,
        value: variant.options,
      };
    });
  };

  const convertVariantPrices = (variantOfProducts) => {
    return variantOfProducts.map((variant) => ({
      ...variant,
      originalPrice: convertMoneyToNumber(variant.originalPrice),
      salePrice: convertMoneyToNumber(variant.salePrice),
      quantity: parseInt(variant.quantity),
    }));
  };

  const convertMoneyToNumber = (value) => {
    return Number(value.replace(/\./g, ""));
  };

  const handleSave = async (available) => {
    if (!isCompleteBasic) {
      toast({
        variant: "destructive",
        title: t("notify"),
        description: t("please_complete", {
          info: t("basic_product_information"),
        }),
      });
      return;
    }
    if (!isCompleteDetail) {
      toast({
        variant: "destructive",
        title: t("notify"),
        description: t("please_complete", {
          info: t("advance_product_information"),
        }),
      });
      return;
    }
    if (!isCompleteSale) {
      toast({
        variant: "destructive",
        title: t("notify"),
        description: t("please_complete", {
          info: t("sales_product_information"),
        }),
      });
      return;
    }

    if (!isCompleteOther) {
      toast({
        variant: "destructive",
        title: t("notify"),
        description: t("please_complete", {
          info: t("other_product_information"),
        }),
      });
      return;
    }

    const data = {
      name: productName,
      description: productDescription,
      details: productDetails,
      quantity: 0,
      originalPrice: 0,
      salePrice: 0,
      brandId: brandIdSelected,
      categoryId: categoryIdSelected,
      components: createComponentsDataArray(),
      attributesHasValues: [],
      variantOfProducts: [],
      available: available,
    };

    if (!isHaveVariant) {
      data.quantity = parseInt(quantity);
      data.originalPrice = convertMoneyToNumber(originalPrice);
      data.salePrice = convertMoneyToNumber(salePrice);
    } else {
      data.variantOfProducts = convertVariantPrices(variantOfProducts);
      data.attributesHasValues = createAttributesHasValues();
    }

    setIsLoading(true);
    try {
      const product = await createProduct(data);
      await uploadMainProductImage(mainProductImage, product.result.id);
      await uploadListProductImage(productImages, product.result.id);
      await uploadMainProductVideo(productVideo, product.result.id);
      toast({
        title: t("notify"),
        description: t("create_successfully_product"),
      });
      setIsLoading(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("notify"),
        description: t("create_fail_product", { error: error.message }),
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white-primary">
      <Toaster />
      <header className="sticky top-16 z-10 h-10 shadow bg-white-primary">
        {isLoading && (
          <div className="absolute w-full h-screen -top-[100px]">
            <Loading />
          </div>
        )}
        <nav className="w-full h-full flex">
          <ul className="space-x-4 flex flex-row justify-center items-center px-5 text-[.9em]">
            <li>
              <Link
                activeClass={styles.active}
                smooth
                spy
                to="basic"
                onSetActive={() => setActiveSection("basic")}
                className={`cursor-pointer ${
                  activeSection === "basic" ? styles.active : ""
                }`}
              >
                {t("basic_information")}
              </Link>
            </li>
            <li>
              <Link
                activeClass={styles.active}
                smooth
                spy
                to="detail"
                onSetActive={() => setActiveSection("detail")}
                className={`cursor-pointer ${
                  activeSection === "detail" ? styles.active : ""
                }`}
              >
                {t("advance_information")}
              </Link>
            </li>
            <li>
              <Link
                activeClass={styles.active}
                smooth
                spy
                to="seller"
                onSetActive={() => setActiveSection("seller")}
                className={`cursor-pointer ${
                  activeSection === "seller" ? styles.active : ""
                }`}
              >
                {t("sales_information")}
              </Link>
            </li>
            <li>
              <Link
                activeClass={styles.active}
                smooth
                spy
                to="other"
                onSetActive={() => setActiveSection("other")}
                className={`cursor-pointer ${
                  activeSection === "other" ? styles.active : ""
                }`}
              >
                {t("other_information")}
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <section
        id="basic"
        className="h-fit flex flex-col items-start justify-center mt-[70px]"
      >
        <span className="px-5 py-3 font-[900]">
          {t("basic_product_information")}
        </span>
        <BasicInformation
          productImages={productImages}
          setProductImages={setProductImages}
          mainProductImage={mainProductImage}
          setMainProductImage={setMainProductImage}
          productVideo={productVideo}
          setProductVideo={setProductVideo}
          productName={productName}
          setProductName={setProductName}
          productCategory={productCategory}
          setProductCategory={setProductCategory}
          productDescription={productDescription}
          productDetails={productDetails}
          setProductDetails={setProductDetails}
          setProductDescription={setProductDescription}
          listCategory={listCategory}
          setCategoryIdSelected={setCategoryIdSelected}
          listBrand={listBrand}
          setBrandIdSelected={setBrandIdSelected}
          productBrand={productBrand}
          setProductBrand={setProductBrand}
        />
      </section>
      <div className="p-5">
        <CompleteNotify
          isComplete={isCompleteBasic}
          content={t("complete", { info: t("basic_product_information") })}
        />
      </div>
      <div className="w-[97%] h-[1px] mt-5 mx-auto bg-white-secondary"></div>
      <section
        id="detail"
        className="h-fit flex flex-col items-start justify-start"
      >
        <span className="px-5 py-3 font-[900]">
          {t("advance_product_information")}
          <p className="flex flex-row items-center">
            <span className="text-red-primary mr-3 text-xl">*</span>
            <span className="italic text-sm">{t("specification_note")}</span>
          </p>
        </span>
        <DetailInformation
          formData={formData}
          setFormData={setFormData}
          listComponents={listComponents}
        />
      </section>
      <div className="p-5">
        <CompleteNotify
          isComplete={isCompleteDetail}
          content={t("complete", { info: t("advance_product_information") })}
        />
      </div>
      <div className="w-[97%] h-[1px] mt-5 mx-auto bg-white-secondary"></div>
      <section
        id="seller"
        className="h-fit flex flex-col items-start justify-start bg-white-primary"
      >
        <span className="px-5 my-3 font-[900]">
          {t("sales_product_information")}
        </span>
        <SellerInformation
          isHaveVariant={isHaveVariant}
          setIsHaveVariant={setIsHaveVariant}
          variantData={variantData}
          setVariantData={setVariantData}
          variantCount={variantCount}
          setVariantCount={setVariantCount}
          variantOfProducts={variantOfProducts}
          setVariantOfProducts={setVariantOfProducts}
          originalPrice={originalPrice}
          setOriginalPrice={setOriginalPrice}
          salePrice={salePrice}
          setSalePrice={setSalePrice}
          quantity={quantity}
          setQuantity={setQuantity}
        />
      </section>
      <div className="p-5">
        <CompleteNotify
          isComplete={isCompleteSale}
          content={t("complete", { info: t("sales_product_information") })}
        />
      </div>
      <div className="w-[97%] h-[1px] mt-5 mx-auto bg-white-secondary"></div>
      <section
        id="other"
        className="h-fit flex flex-col items-start justify-start bg-white-primary"
      >
        <span className="px-5 my-3 font-[900]">
          {t("other_product_information")}
        </span>
        <OtherImformation
          isDefaultDelivery={isDefaultDelivery}
          setIsDefaultDelivery={setIsDefaultDelivery}
        />
      </section>
      <div className="p-5">
        <CompleteNotify
          isComplete={isCompleteOther}
          content={t("complete", { info: t("other_product_information") })}
        />
      </div>
      <div className="w-[97%] h-[1px] mt-5 mx-auto bg-white-secondary"></div>
      <div className="w-full h-fit flex flex-row justify-end items-center gap-5 p-5 pb-10">
        <Button variant="outline">{t("button_cancel")}</Button>
        <Button onClick={() => handleSave(false)}>
          {t("button_save_hidden")}
        </Button>
        <Button onClick={() => handleSave(true)}>
          {t("button_save_show")}
        </Button>
      </div>
    </div>
  );
}
