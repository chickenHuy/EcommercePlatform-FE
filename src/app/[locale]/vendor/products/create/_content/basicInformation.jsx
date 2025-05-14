import ImageDropzone from "@/components/uploads/imageDropZone";
import VideoDropzone from "@/components/uploads/videoDropZone";
import CompleteNotify from "@/components/notifies/complete";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

const BasicInformation = ({
  mainProductImage = null,
  setMainProductImage = null,
  productImages = [],
  setProductImages = null,
  productVideo = null,
  setProductVideo = null,
  productName = "",
  setProductName = null,
  productCategory = "",
  setProductCategory = null,
  productDescription = "",
  setProductDescription = null,
  productDetails = "",
  setProductDetails = null,
  listCategory = [],
  setCategoryIdSelected = null,
  listBrand = [],
  setBrandIdSelected = null,
  productBrand = "",
  setProductBrand = null,
  isUpdate = false,
}) => {
  const t = useTranslations("Vendor.create_update_product");

  return (
    <div className="w-full h-fit flex lg:flex-row flex-col justify-between items-start gap-5 px-5 text-[1em]">
      <div className="w-full flex-grow flex flex-col justify-start items-center p-5 shadow-md rounded-md border-[0.5px]">
        {!isUpdate && (
          <div className="w-full h-fit flex flex-col gap-3">
            <div>
              {t("upload_main_product_image")}
              <span className="px-3 text-red-primary font-[900]">( * )</span>
            </div>
            <ImageDropzone
              onImageUpload={setMainProductImage}
              multiple={false}
              maxFiles={1}
            />
          </div>
        )}
        {!isUpdate && (
          <div className="w-full h-fit flex flex-col gap-3 mt-5">
            <div>
              {t("upload_product_image")}
              <span className="px-3 text-red-primary font-[900]">( * )</span>
            </div>
            <ImageDropzone onImageUpload={setProductImages} />
          </div>
        )}
        {!isUpdate && (
          <div className="w-full h-fit flex flex-col gap-3 mt-5">
            <div>
              {t("upload_product_video")}
              <span className="px-3 text-red-primary font-[900]">( * )</span>
            </div>
            <VideoDropzone onVideoUpload={setProductVideo} />
          </div>
        )}
        <div className="w-full h-fit flex flex-col justify-center items-center py-10 gap-3">
          <div className="w-full h-fit flex flex-col justify-between items-center gap-3">
            <div className="w-full">
              <div>
                {t("product_name")}
                <span className="px-3 text-red-primary font-[900]">( * )</span>
              </div>
              <Input
                type="text"
                placeholder={t("product_name")}
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            {!isUpdate && (
              <div className="w-full">
                <div>
                  {t("product_category")}
                  <span className="px-3 text-red-primary font-[900]">
                    ( * )
                  </span>
                </div>

                <Select
                  value={productCategory}
                  onValueChange={(value) => {
                    setProductCategory(value);
                    if (setCategoryIdSelected) {
                      setCategoryIdSelected(value);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("product_category")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel className="font-[900] text-center">
                        {t("list_category")}
                      </SelectLabel>
                      {listCategory.map((item, index) => {
                        return (
                          <SelectItem key={index} value={item.id}>
                            {item.name}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="w-full">
              <div>
                {t("product_brand")}
                <span className="px-3 text-red-primary font-[900]">( * )</span>
              </div>
              <Select
                value={productBrand}
                onValueChange={(value) => {
                  setProductBrand(value);
                  if (setBrandIdSelected) {
                    setBrandIdSelected(value);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("product_brand")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel className="font-[900] text-center">
                      {t("list_brand")}
                    </SelectLabel>
                    {listBrand.map((item) => {
                      return (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid w-full gap-1.5">
            <div>
              {t("product_description_information")}
              <span className="px-3 text-red-primary font-[900]">( * )</span>
              {productDescription.trim().length > 255 && (
                <span className="text-red-primary">Tối đa 255 ký tự</span>
              )}
            </div>
            <Textarea
              placeholder={t("product_description_information")}
              id="message"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
            />
          </div>
          <div className="grid w-full gap-1.5">
            <div>
              {t("product_detail_information")}
              <span className="px-3 text-red-primary font-[900]">( * )</span>
            </div>
            <Textarea
              placeholder={t("product_description_information")}
              id="details"
              value={productDetails}
              onChange={(e) => setProductDetails(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="w-full lg:w-[600px] h-full flex flex-col justify-start items-start gap-3 p-5 shadow-md rounded-md border-[0.5px] border-white-secondary">
        {!isUpdate && (
          <CompleteNotify
            isComplete={mainProductImage}
            content={t("upload_main_product_image")}
          />
        )}
        {!isUpdate && (
          <CompleteNotify
            isComplete={productImages.length > 0}
            content={t("upload_product_image")}
          />
        )}
        {!isUpdate && (
          <CompleteNotify
            isComplete={productVideo}
            content={t("upload_product_video")}
          />
        )}
        <CompleteNotify
          isComplete={productName !== ""}
          content={t("provide_information_about", { info: t("product_name") })}
        />
        {!isUpdate && (
          <CompleteNotify
            isComplete={productCategory !== ""}
            content={t("select_product_category")}
          />
        )}
        <CompleteNotify
          isComplete={productBrand !== ""}
          content={t("select_product_brand")}
        />
        <CompleteNotify
          isComplete={
            productDescription !== "" && productDescription.trim().length <= 255
          }
          content={t("provide_information_about", { info: t("product_description_information") })}
        />
        <CompleteNotify
          isComplete={productDetails !== ""}
          content={t("provide_information_about", { info: t("product_detail_information") })}
        />
      </div>
    </div>
  );
};

export default BasicInformation;
