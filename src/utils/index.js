import { usePathname } from "next/navigation";
import OpenCageGeocoder from 'opencage-api-client';

// Detect the current locale of the website
export const localeDetector = () => {
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