import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin("./src/configs/i18n.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com", "lh3.googleusercontent.com"],
  },
};

export default withNextIntl(nextConfig);
