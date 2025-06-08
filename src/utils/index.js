import { usePathname } from "next/navigation";

// Detect the current locale of the website
export const useLocaleDetector = () => {
  return usePathname().includes("/en");
};

// Format the date string to a readable format
export const formatDate = (dateString) => {
  const date = new Date(dateString);

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  const timePart = `${hours}:${minutes}:${seconds}`;
  const datePart = `${day}/${month}/${year}`;

  return `${timePart} - ${datePart}`;
};

export const roundToNearest = (num, decimalPlaces) => {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(num * factor) / factor;
};

// Format the currency string to a readable format
export const formatCurrency = (value) => {
  const absoluteValue = Math.abs(Number(value));
  const formatted = absoluteValue.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return value < 0 ? `- ${formatted}` : formatted;
};

// Get first frame of video in Cloudinary
export function getCloudinaryThumbnail(videoUrl, options = {}) {
  const {
    offset = 1,
    width = 400,
    height = 300,
    crop = "fill",
    quality = "auto",
    format = "jpg",
  } = options;

  try {
    const url = new URL(videoUrl);
    const parts = url.pathname.split("/");

    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) throw new Error("Invalid Cloudinary URL");

    const transformation = `so_${offset},w_${width},h_${height},c_${crop},q_${quality}`;
    parts.splice(uploadIndex + 1, 0, transformation);
    parts[parts.length - 1] = parts[parts.length - 1].replace(
      /\.\w+$/,
      `.${format}`,
    );

    url.pathname = parts.join("/");
    return url.toString();
  } catch (err) {
    console.error("Failed to create thumbnail URL:", err.message);
    return "";
  }
}

export function getSomeSecondVideoUrl(originalUrl) {
  const uploadSegment = "/upload/";
  const transformation = "so_0,du_7/";

  if (!originalUrl.includes(uploadSegment)) {
    return originalUrl;
  }

  return originalUrl.replace(uploadSegment, `${uploadSegment}${transformation}`);
}

