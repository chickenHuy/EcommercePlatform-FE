import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

const OtherInformation = ({
  isDefaultDelivery = false,
  setIsDefaultDelivery = null,
}) => {
  const t = useTranslations("Vendor.create_update_product");
  return (
    <div className="text-[15px] w-full h-fit flex flex-col justify-center items-start px-5 gap-1">
      <span className="font-[900]">{t("shipping_information")}</span>
      <div className="w-full h-full lg:flex hidden flex-col justify-start items-start gap-3 p-5 shadow-md rounded-md border-[0.5px] border-white-secondary">
        <div className="my-2 w-full h-fit flex flex-row justify-start items-center gap-3">
          <label className="text-sm">{t("use_default_delivery")}</label>
          <Select
            className="w-fit p-2 border border-gray-300 rounded mt-1"
            value={isDefaultDelivery ? "true" : "false"}
            onValueChange={(newValue) =>
              setIsDefaultDelivery(newValue === "true")
            }
          >
            <SelectTrigger className="max-w-[190px] bg-gray-200 border rounded p-2">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">{t("option_true")}</SelectItem>
              <SelectItem value="false">{t("option_false")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default OtherInformation;
