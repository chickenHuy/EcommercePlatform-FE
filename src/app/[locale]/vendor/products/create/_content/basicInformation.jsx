import ImageDropzone from "@/components/uploads/imageDropZone";
import VideoDropzone from "@/components/uploads/videoDropZone";
import { useEffect, useState } from "react";
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

const BasicInformation = ({
  listCategory = [],
  setCategoryIdSelected = null,
}) => {
  const [productImages, setProductImages] = useState([]);
  const [productVideo, setProductVideo] = useState(null);
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productDescription, setProductDescription] = useState("");

  return (
    <div className="w-full h-fit flex flex-row justify-between items-start gap-5 px-5 text-[15px]">
      <div className="flex-grow flex flex-col justify-start items-center p-5 shadow-md rounded-md border-[0.5px] border-white-secondary">
        <div className="w-full h-fit flex flex-col gap-3">
          <div>
            Tải lên các hình ảnh của sản phẩm
            <span className="px-3 text-error font-[900]">( * )</span>
          </div>
          <ImageDropzone onImageUpload={setProductImages} />
        </div>
        <div className="w-full h-fit flex flex-col gap-3 mt-5">
          <div>
            Tải lên video của sản phẩm
            <span className="px-3 text-error font-[900]">( * )</span>
          </div>
          <VideoDropzone onVideoUpload={setProductVideo} />
        </div>
        <div className="w-full h-fit flex flex-col justify-center items-center py-10 gap-3">
          <div className="w-full h-fit flex flex-row justify-between items-center gap-7">
            <div className="w-full">
              <div>
                Tên sản phẩm
                <span className="px-3 text-error font-[900]">( * )</span>
              </div>
              <Input
                type="text"
                placeholder="Tên sản phẩm"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div className="w-full">
              <div>
                Ngành hàng
                <span className="px-3 text-error font-[900]">( * )</span>
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
                  <SelectValue placeholder="Chọn ngành hàng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel className="font-[900]">
                      Danh sách ngành hàng
                    </SelectLabel>
                    {listCategory.map((item) => {
                      return (
                        <SelectItem value={item.id}>{item.name}</SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid w-full gap-1.5">
            <div>
              Nhập thông tin mô tả của sản phẩm
              <span className="px-3 text-error font-[900]">( * )</span>
            </div>
            <Textarea
              placeholder="Nhập thông tin mô tả của sản phẩm"
              id="message"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="min-w-[400px] h-full lg:flex hidden flex-col justify-start items-start gap-3 p-5 shadow-md rounded-md border-[0.5px] border-white-secondary">
        <CompleteNotify
          isComplete={productImages.length > 0}
          content="Tải lên các hình ảnh của sản phẩm."
        />
        <CompleteNotify
          isComplete={productVideo}
          content="Tải lên video của sản phẩm."
        />
        <CompleteNotify
          isComplete={
            productName !== "" &&
            productCategory !== "" &&
            productDescription !== ""
          }
          content="Cung cấp các thông tin cơ bản của sản phẩm."
        />
      </div>
    </div>
  );
};

export default BasicInformation;
