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

export default function Content() {
  const [activeSection, setActiveSection] = useState("about");
  const [listCategory, setListCategory] = useState([]);
  const [categoryIdSelected, setCategoryIdSelected] = useState(null);
  const [listBrand, setListBrand] = useState([]);
  const [brandIdSelected, setBrandIdSelected] = useState(null);
  const [listComponents, setListComponent] = useState([]);
  const [isLoading, setIsLoading] = useState(null);
  const { toast } = useToast();

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
      productDescription.trim() !== "";

    setIsCompleteBasic(isComplete);
  }, [
    productImages,
    productVideo,
    productName,
    productDetails,
    productCategory,
    productDescription,
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
  }, [formData, listComponents]);

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
          variant.options.length > 0
      );

      const hasValidVariantProducts = variantOfProducts.every(
        (product) =>
          product.originalPrice?.trim() !== "" &&
          product.salePrice?.trim() !== "" &&
          product.quantity?.trim() !== "" &&
          Array.isArray(product.values) &&
          product.values.length === Object.keys(variantData).length
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
        .catch((error) => {
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
        title: "Lỗi",
        description: "Vui lòng hoàn thành thông tin cơ bản của sản phẩm.",
      });
      return;
    }
    if (!isCompleteDetail) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng hoàn thành thông tin chi tiết của sản phẩm.",
      });
      return;
    }
    if (!isCompleteSale) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng hoàn thành thông tin bán hàng của sản phẩm.",
      });
      return;
    }

    if (!isCompleteOther) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng hoàn thành thông tin khác của sản phẩm.",
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
        variant: "success",
        title: "Thành công",
        description: "Tạo sản phẩm thành công.",
      });
      setIsLoading(false);
    } catch (error) {
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
          <ul className="space-x-4 flex flex-row justify-center items-center px-5 text-[14px]">
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
                Thông Tin Cơ Bản
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
                Thông Tin Chi Tiết
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
                Thông Tin Bán Hàng
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
                Thông Tin Khác
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <section
        id="basic"
        className="h-fit min-h-screen flex flex-col items-start justify-center bg-white-primary mt-16"
      >
        <span className="px-5 py-3 font-[900]">
          Thông tin cơ bản của sản phẩm
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
          content="Hoàn thành thông tin cơ bản của sản phẩm."
        />
      </div>
      <div className="w-[97%] h-[1px] mt-5 mx-auto bg-white-secondary"></div>
      <section
        id="detail"
        className="h-fit min-h-screen flex flex-col items-start justify-start bg-white-primary"
      >
        <span className="px-5 py-3 font-[900]">
          Thông tin chi tiết của sản phẩm
          <p className="flex flex-row items-center">
            <span className="text-error-dark mr-3 text-xl">*</span>
            <span className="italic text-sm">
              Các thông tin về thông số kỹ thuật nên nhập cùng đơn vị.
            </span>
          </p>
          <p className="flex flex-row items-center">
            <span className="text-error-dark mr-3 text-xl">*</span>
            <span className="italic text-sm">
              Đối với các thông số kỹ thuật có nhiều giá trị, sử dụng ký tự "\"
              ngăn cách giữa các giá trị.
            </span>
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
          content="Hoàn thành thông tin chi tiết của sản phẩm."
        />
      </div>
      <div className="w-[97%] h-[1px] mt-5 mx-auto bg-white-secondary"></div>
      <section
        id="seller"
        className="h-fit min-h-screen flex flex-col items-start justify-start bg-white-primary"
      >
        <span className="px-5 my-3 font-[900]">Thông tin bán hàng</span>
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
          content="Hoàn thành thông tin bán hàng của sản phẩm."
        />
      </div>
      <div className="w-[97%] h-[1px] mt-5 mx-auto bg-white-secondary"></div>
      <section
        id="other"
        className="h-fit min-h-screen flex flex-col items-start justify-start bg-white-primary"
      >
        <span className="px-5 my-3 font-[900]">Thông tin khác</span>
        <OtherImformation
          isDefaultDelivery={isDefaultDelivery}
          setIsDefaultDelivery={setIsDefaultDelivery}
        />
      </section>
      <div className="p-5">
        <CompleteNotify
          isComplete={isCompleteOther}
          content="Hoàn thành thông tin khác của sản phẩm."
        />
      </div>
      <div className="w-[97%] h-[1px] mt-5 mx-auto bg-white-secondary"></div>
      <div className="w-full h-fit flex flex-row justify-end items-center gap-5 p-5 pb-10">
        <Button variant="destructive">Hủy</Button>
        <Button onClick={() => handleSave(false)} variant="outline">
          Lưu & Ẩn
        </Button>
        <Button onClick={() => handleSave(true)}>Lưu & Hiển thị</Button>
      </div>
    </div>
  );
}
