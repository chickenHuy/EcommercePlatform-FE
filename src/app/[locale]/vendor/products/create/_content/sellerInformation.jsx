import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import VariantInput from "@/components/inputs/variantInput";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CompleteNotify from "@/components/notifies/complete";

const SellerInformation = ({
  isHaveVariant = false,
  setIsHaveVariant = null,
  variantData = {},
  setVariantData = null,
  variantCount = 0,
  setVariantCount = null,
  variantOfProducts = [],
  setVariantOfProducts = null,
  originalPrice = "",
  setOriginalPrice = null,
  salePrice = "",
  setSalePrice = null,
  quantity = "",
  setQuantity = null,
}) => {
  const { toast } = useToast();

  const handleAddVariant = () => {
    const newVariantName = `variant${variantCount}`;
    setVariantData((prevData) => ({
      ...prevData,
      [newVariantName]: {
        name: "",
        options: [],
      },
    }));
    setVariantCount(variantCount + 1);
  };

  const handleVariantChange = (variantName, field, value) => {
    for (const key in variantData) {
      if (key === variantName) {
        continue;
      }

      if (
        value !== "" &&
        variantData[key].name.toLowerCase() === value.toLowerCase()
      ) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Tên phân loại đã tồn tại",
        });
        return;
      }
    }

    setVariantData((prevData) => ({
      ...prevData,
      [variantName]: {
        ...prevData[variantName],
        [field]: value,
      },
    }));
  };

  const handleAddOption = (variantName, option) => {
    setVariantData((prevData) => ({
      ...prevData,
      [variantName]: {
        ...prevData[variantName],
        options: [...prevData[variantName].options, option],
      },
    }));
  };

  const handleRemoveOption = (variantName, optionIndex) => {
    setVariantData((prevData) => ({
      ...prevData,
      [variantName]: {
        ...prevData[variantName],
        options: prevData[variantName].options.filter(
          (_, index) => index !== optionIndex
        ),
      },
    }));
  };

  const handleRemoveVariant = (variantName) => {
    setVariantData((prevData) => {
      const updatedData = { ...prevData };
      delete updatedData[variantName];

      const isEmpty = Object.keys(updatedData).length === 0;
      setIsHaveVariant(!isEmpty);

      return updatedData;
    });
  };

  const handleOriginalPriceChange = (e) => {
    setOriginalPrice(e.target.value);
  };

  const handleSalePriceChange = (e) => {
    setSalePrice(e.target.value);
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleInputChange = (index, field, value, isHaveVariant = true) => {
    if (
      field === "originalPrice" ||
      field === "quantity" ||
      field === "salePrice"
    ) {
      const parsedValue = String(value).replace(/\./g, "");
      if (isValidNumber(parsedValue) === false) {
        return;
      }
      let newValue = parsedValue;

      newValue = formatCurrency(parsedValue);
      if (field === "quantity") {
        newValue = String(newValue).replace(/\./g, "");
      }

      if (!isHaveVariant) {
        if (field === "originalPrice") {
          setOriginalPrice(newValue);
        } else if (field === "salePrice") {
          setSalePrice(newValue);
        } else {
          setQuantity(newValue);
        }
        return;
      }

      setVariantOfProducts((prevData) => {
        const newData = [...prevData];
        newData[index] = {
          ...newData[index],
          [field]: newValue,
        };
        return newData;
      });
    } else {
      setVariantOfProducts((prevData) => {
        const newData = [...prevData];
        newData[index] = {
          ...newData[index],
          [field]: value,
        };
        return newData;
      });
    }
  };

  const formatCurrency = (value) => {
    const numberValue = parseFloat(value);
    if (isNaN(numberValue)) return value;
    return numberValue.toLocaleString("en-US").replace(/,/g, ".");
  };

  const isValidNumber = (value) => {
    return !isNaN(value) && value >= 0;
  };

  useEffect(() => {
    function cartesianProduct(arrays) {
      return arrays.reduce(
        (acc, array) => acc.flatMap((d) => array.map((e) => [...d, e])),
        [[]]
      );
    }

    const variantOptions = Object.values(variantData)
      .map((variant) => variant.options)
      .filter((options) => options.length > 0);

    if (variantOptions.length === 0) {
      setVariantOfProducts([]);
      return;
    }

    const combinations = cartesianProduct(variantOptions);

    const variantOfProducts = combinations.map((combination) => ({
      values: combination,
      originalPrice: "",
      quantity: "",
      salePrice: "",
      available: true,
    }));

    setVariantOfProducts(variantOfProducts);
  }, [variantData]);

  return (
    <div className="text-[15px] w-full h-fit flex flex-col justify-center items-start px-5 gap-5">
      <div className="w-full h-fit flex flex-col justify-center items-start gap-4">
        <div className="w-full h-fit flex flex-col gap-1">
          <span className="font-[900] italic">Phân loại sản phẩm</span>
          {isHaveVariant && (
            <p className="flex flex-row items-center">
              <span className="text-error-dark mr-3 text-xl">*</span>
              <span className="italic text-sm">
                Nên nhập đầy đủ và chính các các thông tin phân loại sản phẩm.
              </span>
            </p>
          )}
          {!isHaveVariant && (
            <Button
              variant="outline"
              onClick={() => {
                setIsHaveVariant(true);
                handleAddVariant();
              }}
            >
              <Plus className="-translate-y-[2px]" />
              <span className="font-[900]">Thêm nhóm phân loại</span>
            </Button>
          )}
        </div>
        {!isHaveVariant && (
          <div className="w-full h-fit flex flex-col justify-center items-start gap-4">
            <div className="w-full h-fit flex flex-col gap-1">
              <div>
                Giá gốc của sản phẩm
                <span className="px-3 text-error font-[900]">( * )</span>
              </div>
              <Input
                value={originalPrice}
                type="text"
                placeholder="Giá gốc của sản phẩm | VND"
                onChange={(e) => {
                  const value = e.target.value;
                  handleInputChange(1, "originalPrice", value, isHaveVariant);
                }}
              />
            </div>
            <div className="w-full h-fit flex flex-col gap-1">
              <div>
                Giá bán của sản phẩm
                <span className="px-3 text-error font-[900]">( * )</span>
              </div>
              <Input
                value={salePrice}
                type="text"
                placeholder="Giá bán của sản phẩm | VND"
                onChange={(e) => {
                  const value = e.target.value;
                  handleInputChange(1, "salePrice", value, isHaveVariant);
                }}
              />
            </div>
            <div className="w-full h-fit flex flex-col gap-1">
              <div>
                Số lượng ( kho )
                <span className="px-3 text-error font-[900]">( * )</span>
              </div>
              <Input
                type="text"
                value={quantity}
                placeholder="Số lượng"
                onChange={(e) => {
                  const value = e.target.value;
                  handleInputChange(1, "quantity", value, isHaveVariant);
                }}
              />
            </div>
          </div>
        )}
        {isHaveVariant && (
          <div className="w-full h-fit">
            <div className="w-full h-fit flex flex-col gap-4">
              {Object.keys(variantData).map((variantName) => (
                <div
                  key={variantName}
                  className="relative w-full border p-5 rounded"
                >
                  {/* Nút Close */}
                  <button
                    className="absolute top-[3px] right-[3px] text-red-500"
                    onClick={() => handleRemoveVariant(variantName)}
                  >
                    <X className="w-4 h-4 hover:text-error-dark hover:scale-125" />
                  </button>

                  <VariantInput
                    variantName={variantName}
                    variant={variantData[variantName]}
                    onNameChange={(value) =>
                      handleVariantChange(variantName, "name", value)
                    }
                    onAddOption={(option) =>
                      handleAddOption(variantName, option)
                    }
                    onRemoveOption={(optionIndex) =>
                      handleRemoveOption(variantName, optionIndex)
                    }
                  />
                </div>
              ))}
              <Button variant="outline" onClick={handleAddVariant}>
                <Plus className="-translate-y-[2px]" />
                <span className="font-[900]">Thêm nhóm phân loại</span>
              </Button>
            </div>
          </div>
        )}
      </div>
      {isHaveVariant && variantOfProducts.length > 0 && (
        <div>
          <span className="font-[900] italic">
            Thông tin chi tiết cho từng loại sản phẩm
          </span>
          <p className="flex flex-row items-center">
            <span className="text-error-dark mr-3 text-xl">*</span>
            <span className="italic text-sm">
              Đảm bảo đã nhập đầy đủ và chính xác các thông tin về phân loại sản
              phẩm trước khi nhập thông tin chi tiết cho từng loại sản phẩm.
            </span>
          </p>
          <p className="flex flex-row items-center">
            <span className="text-error-dark mr-3 text-xl">*</span>
            <span className="italic text-sm">
              Khi chỉnh sửa các thông tin về phân loại sản phẩm, các thông tin
              chi tiết về sản phẩm sẽ bị mất.
            </span>
          </p>
        </div>
      )}
      {isHaveVariant && (
        <div className="w-full h-fit flex flex-row xl:justify-between justify-center items-center flex-wrap gap-3">
          {variantOfProducts.map((variant, index) => (
            <div key={index} className="variant-item p-4 border rounded">
              <h4 className="w-full h-fit text-center font-[900]">{`${variant.values.join(
                " | "
              )}`}</h4>

              <div className="w-full h-[1px] bg-white-secondary mt-2"></div>
              <div className="my-2 w-full h-fit flex flex-row justify-between items-center gap-3">
                <span className="text-sm">Giá gốc (VND)</span>
                <Input
                  value={variant.originalPrice}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleInputChange(index, "originalPrice", value);
                  }}
                  className="w-fit p-2 border border-gray-300 rounded mt-1"
                />
              </div>

              <div className="my-2 w-full h-fit flex flex-row justify-between items-center gap-3">
                <span className="text-sm">Giá bán (VND)</span>
                <Input
                  value={variant.salePrice}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleInputChange(index, "salePrice", value);
                  }}
                  className="w-fit p-2 border border-gray-300 rounded mt-1"
                />
              </div>

              <div className="my-2 w-full h-fit flex flex-row justify-between items-center gap-3">
                <span className="text-sm">Số lượng</span>
                <Input
                  value={variant.quantity}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleInputChange(index, "quantity", value);
                  }}
                  className="w-fit p-2 border border-gray-300 rounded mt-1"
                />
              </div>
              <div className="my-2 w-full h-fit flex flex-row justify-between items-center gap-3">
                <label className="text-sm">Có sẵn</label>
                <Select
                  className="w-fit p-2 border border-gray-300 rounded mt-1"
                  value={variant.available ? "true" : "false"}
                  onValueChange={(newValue) =>
                    handleInputChange(index, "available", newValue === "true")
                  }
                >
                  <SelectTrigger className="max-w-[190px] bg-gray-200 border rounded p-2">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Có</SelectItem>
                    <SelectItem value="false">Không</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full h-fit flex justify-end items-center">
                <CompleteNotify
                  isComplete={
                    variant.originalPrice !== "" &&
                    variant.salePrice !== "" &&
                    variant.quantity !== ""
                  }
                  content="Hoàn thành"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerInformation;
