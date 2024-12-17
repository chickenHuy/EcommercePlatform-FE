import { usePathname } from "next/navigation";

export const localeDetector = () => {
  return usePathname().includes("/en");
};

export const formatDate = (isoString) => {
  const date = new Date(isoString);

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  return date.toLocaleString(options);
};
