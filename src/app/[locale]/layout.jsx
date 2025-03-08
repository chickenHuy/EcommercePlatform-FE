import localFont from "next/font/local";
import "./globals.css";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import StoreProvider from "@/store/storeProvider";
import { ThemeProvider } from "@/components/themes/theme-provider";
import UserHeader from "@/components/headers/mainHeader";

const helveticalNeue = localFont({
  src: [
    {
      path: "../../../public/fonts/HelveticaNeueBold.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../../public/fonts/HelveticaNeueNormal.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../../public/fonts/HelveticaNeueLight.otf",
      weight: "500",
      style: "normal",
    },
  ],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({ children, params }) {
  const locale = params?.locale || "en";
  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <StoreProvider>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <body className={helveticalNeue.className}>
            <UserHeader />
            {children}
          </body>
        </NextIntlClientProvider>
      </StoreProvider>
    </html>
  );
}
