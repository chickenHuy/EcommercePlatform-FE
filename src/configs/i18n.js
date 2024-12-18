import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

export default getRequestConfig(async ({ locale }) => {
  const locales = ["en", "vi"];

  if (!locales.includes(locale)) {
    return notFound();
  }

  return {
    messages: (await import(`../locales/${locale}.json`)).default,
  };
});
