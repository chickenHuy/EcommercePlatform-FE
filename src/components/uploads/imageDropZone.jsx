import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

const ImageDropzone = ({
  multiple = true,
  onImageUpload,
  isPopup = false,
  maxFileSize = 10 * 1024 * 1024,
  maxFiles = 20,
}) => {
  const [images, setImages] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState("");

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (multiple && images.length + acceptedFiles.length > maxFiles) {
        setError(`You can only upload up to ${maxFiles} images.`);
        return;
      }

      const validImages = acceptedFiles.filter(
        (file) => file.size <= maxFileSize
      );

      if (validImages.length === 0) {
        setError("All selected files exceed the maximum size limit.");
        return;
      }

      const newImages = validImages.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      if (!multiple) {
        setImages([newImages[0]]);
        setError("");
        if (onImageUpload) {
          onImageUpload(newImages[0]);
        }
      } else {
        setImages((prevImages) => [...prevImages, ...newImages]);
        setError("");
        if (onImageUpload) {
          onImageUpload(newImages);
        }
      }
    },
    [onImageUpload, maxFileSize, maxFiles, images, multiple]
  );

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    if (!isPopup) {
      onImageUpload(newImages);
    }
  };

  const handleUploadImages = () => {
    if (onImageUpload) {
      onImageUpload(images);
    }
  };

  const handleCloseDialog = () => {
    setImages([]);
    setIsDialogOpen(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: true,
  });

  const renderContent = () => (
    <div
      className={`h-fit bg-white-primary p-6 rounded-lg shadow-lg ${
        isPopup ? "w-[40%] min-w-[400px] mx-auto" : "w-full min-w-[400px]"
      }`}
    >
      {isPopup && (
        <>
          <h2 className="text-xl font-[900] text-center">Tải hình ảnh lên</h2>
          <Separator className="mt-2 mb-4" />
        </>
      )}

      <div
        {...getRootProps()}
        className="border-dashed border-[1px] border-white-tertiary p-4 cursor-pointer"
      >
        <input {...getInputProps()} />
        <div className="h-[150px] flex justify-center items-center">
          {isDragActive ? (
            <p className="text-blue-600">Thả hình ảnh vào đây...</p>
          ) : (
            <p className="text-gray-600">
              <CloudUploadIcon className="w-28 h-28 animate-bounce" />
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-gray-600">
        <p>
          Kích thước tối đa của mỗi hình ảnh là {maxFileSize / (1024 * 1024)} MB
        </p>
        <p>Số lượng hình ảnh tối đa là {maxFiles}</p>
      </div>

      {error && (
        <p className="text-error-dark text-sm mt-3 w-full text-center">
          {error}
        </p>
      )}

      <div
        className={`${
          multiple ? "grid grid-cols-2 lg:grid-cols-3" : "grid grid-cols-1"
        } gap-2 mt-4`}
      >
        {images.map((image, index) => (
          <div key={index} className="h-32 border relative">
            <X
              className="absolute top-[2px] right-[2px] scale-[0.65] hover:scale-75 cursor-pointer hover:text-error-dark"
              onClick={() => handleRemoveImage(index)}
            />
            <img
              src={image.preview}
              alt={image.name}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>

      {isPopup && (
        <div className="mt-4 flex flex-row justify-end items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            className="font-semibold"
            onClick={handleCloseDialog}
          >
            Đóng
          </Button>
          <Button
            type="button"
            className="font-semibold"
            onClick={handleUploadImages}
            disabled={images.length === 0}
          >
            Tải lên
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center bg-transparent-primary">
      {isPopup ? (
        <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Dialog.Trigger asChild>
            <Button className="font-semibold text-sm flex flex-row justify-center items-end gap-3">
              Tải ảnh lên
              <CloudUploadIcon className="scale-90" />
            </Button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="bg-white-secondary fixed inset-0" />
            <Dialog.Content className="fixed inset-0 flex items-center justify-center">
              {renderContent()}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      ) : (
        renderContent()
      )}
    </div>
  );
};

export default ImageDropzone;
