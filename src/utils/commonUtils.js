import { usePathname } from "next/navigation";

export const localeDetector = () => {
  return usePathname().includes("/en");
};

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

// export const formatDate = (isoString) => {
//   const date = new Date(isoString);

//   const options = {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//   };

//   return date.toLocaleString(options);
// };
