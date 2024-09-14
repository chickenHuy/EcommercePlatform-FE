import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin('./src/configs/i18n.js');

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withNextIntl(nextConfig);