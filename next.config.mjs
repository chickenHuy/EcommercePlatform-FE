import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin('./src/configs/i18n.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"], 
  },
};

export default withNextIntl(nextConfig);