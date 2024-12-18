import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import BasicInformation from "../create/_content/basicInformation";
import { getProductById, updateProduct, uploadMainProductImage } from "@/api/vendor/productRequest";
import { useToast } from "@/hooks/use-toast";
import { getListAllBrand } from "@/api/admin/brandRequest";
import ImageDropzone from "@/components/uploads/imageDropZone";

export function ProductUpdateDialog({ productId = null, isOpen, onClose, setUpdated }) {
  const { toast } = useToast();
  const [isSelected, setIsSelected] = useState(false);
  const [isBasicInfoSelected, setIsBasicInfoSelected] = useState(false);
  const [isMainImageSelected, setIsMainImageSelected] = useState(false);
  const [isImageListSelected, setIsImageListSelected] = useState(false);
  const [isVideoSelected, setIsVideoSelected] = useState(false);
  const [isDetailInfoSelected, setIsDetailInfoSelected] = useState(false);
  const [isSaleInfoSelected, setIsSaleInfoSelected] = useState(false);
  const [isVariantInfoSelected, setIsVariantInfoSelected] = useState(false);

  const [product, setProduct] = useState(null);
  // State for basic information
  const [listBrand, setListBrand] = useState([]);
  const [brandIdSelected, setBrandIdSelected] = useState(null);
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
    setIsSelected(false);
    setIsBasicInfoSelected(false);
    setIsMainImageSelected(false);
    setIsImageListSelected(false);
    setIsVideoSelected(false);
    setIsDetailInfoSelected(false);
    setIsSaleInfoSelected(false);
    setIsVariantInfoSelected(false);
  }, []);

  useEffect(() => {
    if (productId) {
      getListAllBrand().then((response) => {
        console.log(response.result);
        setListBrand(response.result);
      });
      getProductById(productId).then((response) => {
        setProduct(response.result);
        console.log('CCCCCCCCCCCCCCCCCCCCCCCCCCCCC');
        console.log(response.result);
        setProductName(response.result.name);
        setProductDescription(response.result.description);
        setProductBrand(response.result.brand.id);
        setBrandIdSelected(response.result.brand.id);
        setProductDetails(response.result.details);
      }).catch((error) => {
        toast({
          variant: "destructive",
          title: "Lỗi tải sản phẩm",
          description: "Vui lòng thử lại.",
        })
      })
    }
  }, [productId]);

  const handleUpdate = async () => {
    if (isBasicInfoSelected) {
      if (productName === "" || productDescription === "" || productDetails === "" || brandIdSelected === null) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Vui cung cấp đầy đủ các thông tin cần thiết.",
        })
      }
      else {
        try {
          await updateProduct(product.id, {
            "name": productName,
            "description": productDescription,
            "details": productDetails,
            "brandId": brandIdSelected,
            "quantity": product.quantity,
            "originalPrice": product.originalPrice,
            "salePrice": product.salePrice,
            "available": product.available
          })
          toast({
            title: "Thông báo",
            description: "Cập nhật sản phẩm thành công.",
          })
          setUpdated(true);
          onClose(true);
        }
        catch (error) {
          toast({
            variant: "destructive",
            title: "Lỗi",
            description: "Cập nhật sản phẩm không thành công, vui lòng kiểm tra lại.",
          })
        }
      }
    }
    else if (isMainImageSelected) {
      if (!mainProductImage) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Chưa chọn hình ảnh thay thế cho hình ảnh chính của sản phẩm!!!",
        })
      }
      else {
        try {
          await uploadMainProductImage(mainProductImage, productId);
          toast({
            title: "Thông báo",
            description: "Cập nhật hình ảnh thành công. Ảnh đang được tải lên!!!",
          })
          setUpdated(true);
          onClose(true);
        }
        catch (error) {
          toast({
            variant: "destructive",
            title: "Lỗi",
            description: "Cập nhật sản phẩm không thành công, vui lòng kiểm tra lại.",
          })
        }
      }
    }
    else if (isImageListSelected) {
      console.log('CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC');
      console.log()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[70%] max-w-full min-w-[400px] max-h-[90%]">
        <DialogHeader>
          <DialogTitle className="w-full text-center mb-2">
            Cập nhật thông tin sản phẩm
          </DialogTitle>
          <Separator />
        </DialogHeader>

        {!isSelected && (
          <div className="space-y-4 flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center">
              <p className="flex flex-row items-center">
                <span className="text-error-dark mr-3 text-xl">*</span>
                <span className="italic text-sm font-normal">
                  Các thông tin cơ bản của sản phẩm bao gồm tên, thương hiệu,
                  thông tin mô tả, thông tin chi tiết của sản phẩm.
                </span>
              </p>
              <Button
                className="w-1/2 min-w-[500px] justify-start"
                onClick={() => {
                  setIsBasicInfoSelected(!isBasicInfoSelected);
                  setIsSelected(true);
                }}
              >
                <span className="w-full text-center">
                  Chỉnh sửa thông tin cơ bản
                </span>
              </Button>
            </div>

            <div className="flex flex-col justify-center items-center">
              <p className="flex flex-row items-center">
                <span className="text-error-dark mr-3 text-xl">*</span>
                <span className="italic text-sm font-normal">
                  Hình ảnh chính sẽ được hiển thị trên danh sách sản phẩm trong
                  trang chủ, danh mục sản phẩm, danh sách kết quả tìm kiếm sản
                  phẩm,...
                </span>
              </p>
              <Button
                className="w-1/2 min-w-[500px] justify-start"
                onClick={() => {
                  setIsMainImageSelected(!isMainImageSelected);
                  setIsSelected(true);
                }}
              >
                <span className="w-full text-center">
                  Chỉnh sửa hình ảnh chính
                </span>
              </Button>
            </div>

            <div className="flex flex-col justify-center items-center">
              <p className="flex flex-row items-center">
                <span className="text-error-dark mr-3 text-xl">*</span>
                <span className="italic text-sm font-normal">
                  Danh sách các hình ảnh sẽ được hiển thị trong trang thông tin
                  chi tiết của sản phẩm.
                </span>
              </p>
              <Button
                className="w-1/2 min-w-[500px] justify-start"
                onClick={() => {
                  setIsImageListSelected(!isImageListSelected);
                  setIsSelected(true);
                }}
              >
                <span className="w-full text-center">
                  Chỉnh sửa danh sách ảnh
                </span>
              </Button>
            </div>

            <div className="flex flex-col justify-center items-center">
              <p className="flex flex-row items-center">
                <span className="text-error-dark mr-3 text-xl">*</span>
                <span className="italic text-sm font-normal">
                  Video sẽ được hiển thị trên danh sách sản phẩm trong trang
                  chủ, danh mục sản phẩm,...
                </span>
              </p>
              <Button
                className="w-1/2 min-w-[500px] justify-start"
                onClick={() => {
                  setIsVideoSelected(!isVideoSelected);
                  setIsSelected(true);
                }}
              >
                <span className="w-full text-center">
                  Chỉnh sửa video sản phẩm
                </span>
              </Button>
            </div>

            <div className="flex flex-col justify-center items-center">
              <p className="flex flex-row items-center">
                <span className="text-error-dark mr-3 text-xl">*</span>
                <span className="italic text-sm font-normal">
                  Thông tin chi tiết bao gồm các thông số kỹ thuật của sản phẩm.
                </span>
              </p>
              <Button
                className="w-1/2 min-w-[500px] justify-start"
                onClick={() => {
                  setIsDetailInfoSelected(!isDetailInfoSelected);
                  setIsSelected(true);
                }}
              >
                <span className="w-full text-center">
                  Chỉnh sửa thông tin chi tiết
                </span>
              </Button>
            </div>

            <div className="flex flex-col justify-center items-center">
              <p className="flex flex-row items-center">
                <span className="text-error-dark mr-3 text-xl">*</span>
                <span className="italic text-sm font-normal">
                  Thông tin tin bán hàng bao gồm giá gốc, giá bán và số lượng
                  của sản phẩm.
                </span>
              </p>
              <Button
                className="w-1/2 min-w-[500px] justify-start"
                onClick={() => {
                  setIsSaleInfoSelected(!isSaleInfoSelected);
                  setIsSelected(true);
                }}
              >
                <span className="w-full text-center">
                  Chỉnh sửa thông tin bán hàng
                </span>
              </Button>
            </div>

            <div className="flex flex-col justify-center items-center">
              <p className="flex flex-row items-center">
                <span className="text-error-dark mr-3 text-xl">*</span>
                <span className="italic text-sm font-normal">
                  Chỉnh sửa thông tin gồm giá gốc, giá bán và số lượng của các
                  biến thể của sản phẩm.
                </span>
              </p>
              <Button
                className="w-1/2 min-w-[500px] justify-start"
                onClick={() => {
                  setIsVariantInfoSelected(!isVariantInfoSelected);
                  setIsSelected(true);
                }}
              >
                <span className="w-full text-center">
                  Chỉnh sửa thông tin các biến thể
                </span>
              </Button>
            </div>
          </div>
        )}

        <div className="h-full w-full">
          {isBasicInfoSelected && <BasicInformation
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
            isUpdate={true} />}

          {isMainImageSelected && <div>
            <div className="w-full h-fit flex flex-col gap-3 mt-5">
              <div>
                Tải lên hình ảnh chính của sản phẩm
                <span className="px-3 text-error font-[900]">( * )</span>
              </div>
              <ImageDropzone
                onImageUpload={setProductImages}
                mainImageUrl={product.mainImageUrl}
                multiple={false}
                maxFiles={1}
                isUpdate={true}
                productId={product.id}
              />
            </div>
          </div>}

          {isImageListSelected && <div>
            <div className="w-full max-h-[50%] flex flex-col gap-3 mt-5">
              <div>
                Tải lên các hình ảnh của sản phẩm
                <span className="px-3 text-error font-[900]">( * )</span>
              </div>
              <ImageDropzone
                onImageUpload={setMainProductImage}
                listImageUrl={product.images}
                multiple={true}
                isUpdate={true}
                productId={product.id}
              />
            </div>
          </div>}
        </div>

        <Separator />
        <DialogFooter>
          <Button variant="ghost" onClick={() => onClose(true)}>
            Đóng
          </Button>
          <Button onClick={() => handleUpdate(true)}>
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
