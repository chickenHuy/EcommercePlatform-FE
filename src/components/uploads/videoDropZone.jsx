import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CloudUploadIcon, X } from "lucide-react";
import { useTranslations } from "next-intl";

const VideoDropzone = ({
  currentVideoUrl = null,
  onVideoUpload,
  isPopup = false,
  maxSize = 100 * 1024 * 1024,
}) => {
  const [video, setVideo] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState("");
  const t = useTranslations("Vendor.create_update_product");

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.size > maxSize) {
        setError(t("max_size_video", { size: maxSize / (1024 * 1024) }));
        return;
      }

      const videoFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      setVideo(videoFile);
      setError("");

      if (onVideoUpload) {
        onVideoUpload(videoFile);
      }
    },
    [onVideoUpload, maxSize]
  );

  const handleRemoveVideo = () => {
    setVideo(null);
    if (!isPopup) {
      onVideoUpload(null);
    }
    setError("");
  };

  const handleCloseDialog = () => {
    handleRemoveVideo();
    setIsDialogOpen(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "video/*",
    multiple: false,
  });

  const renderContent = () => (
    <div
      className={`h-fit bg-white-primary p-6 rounded-lg shadow-lg ${isPopup ? "w-[40%] min-w-[400px] mx-auto" : "w-full min-w-[400px]"
        }`}
    >
      {isPopup && (
        <>
          <h2 className="text-xl font-[900] text-center">Tải video lên</h2>
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
            <p className="text-blue-600">{t("drop_video_here")}</p>
          ) : (
            <p className="text-gray-600">
              <CloudUploadIcon className="w-28 h-28 animate-bounce" />
            </p>
          )}
        </div>
      </div>

      {error && (
        <p className="text-error-dark text-sm mt-3 w-full text-center">
          {error}
        </p>
      )}

      {currentVideoUrl && !video &&
        <div className="mt-4 relative">
          <video
            src={currentVideoUrl}
            controls
            className="w-full h-40 object-contain"
          />
          <X
            className="absolute top-[2px] right-[2px] scale-[0.65] hover:scale-75 cursor-pointer hover:text-error-dark"
            onClick={handleRemoveVideo}
          />
        </div>
      }

      {video && (
        <div className="mt-4 relative">
          <video
            src={video.preview}
            controls
            className="w-full h-40 object-contain"
          />
          <X
            className="absolute top-[2px] right-[2px] scale-[0.65] hover:scale-75 cursor-pointer hover:text-error-dark"
            onClick={handleRemoveVideo}
          />
        </div>
      )}

      {/* Note about file size and number of images */}
      <p className="text-sm text-center text-gray-600 mt-4">
        {t("max_size_video", { size: maxSize / (1024 * 1024) })}
      </p>
      <p className="text-sm text-center text-gray-600">
        {t("max_number_video", { number: 1 })}
      </p>


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
            onClick={() => onVideoUpload(video)}
            disabled={!video}
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
              Tải video lên
              {/* <CloudUploadIcon className="scale-90" /> */}
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

export default VideoDropzone;
