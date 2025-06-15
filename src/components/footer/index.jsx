"use client";

import {
    Mail,
    Phone,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    CreditCard,
    Container,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Logo, LogoText } from "../logo";
import { usePathname } from "next/navigation";

const MainFooter = () => {
    const pathname = usePathname();
    const t = useTranslations("MainFooter");

    const hiddenPaths = [
        "/admin",
        "/vendor",
        "/auth",
        "/videos",
        "/user"
    ];

    const isHeaderVisible = !hiddenPaths.some((path) => pathname.includes(path));
    if (!isHeaderVisible) return null;

    const categories = [
        { href: "/category/electronics", label: t("electronics") || "Electronics" },
        { href: "/category/fashion", label: t("fashion") || "Fashion" },
        { href: "/category/home", label: t("home_garden") || "Home & Garden" },
        { href: "/category/sports", label: t("sports") || "Sports & Outdoors" },
        { href: "/category/books", label: t("books") || "Books" },
        { href: "/category/beauty", label: t("beauty") || "Beauty & Health" },
    ];

    const socialLinks = [
        { href: "#", icon: Facebook, label: "Facebook" },
        { href: "#", icon: Twitter, label: "Twitter" },
        { href: "#", icon: Instagram, label: "Instagram" },
        { href: "#", icon: Youtube, label: "Youtube" },
    ];

    return (
        <footer className="w-full bg-black-primary text-white-primary">
            {/* Main Footer Content */}
            <div className="mx-auto px-4 sm:px-6 lg:px-20 xl:px-28 py-7">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Company Info */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <Logo width={40} color="#f1f1f1" />
                            <LogoText height={20} color="#f1f1f1" />
                        </div>
                        <p className="text-white-tertiary text-sm mb-6 leading-relaxed">
                            {t("company_desc") ||
                                "Your trusted online marketplace for quality products at great prices. Shop with confidence and enjoy excellent customer service."}
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <Mail className="h-4 w-4 text-white-tertiary mt-0.5 flex-shrink-0" />
                                <span className="text-white-tertiary text-sm">
                                    support@hkkuptech.com
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-white-tertiary flex-shrink-0" />
                                <span className="text-white-tertiary text-sm">
                                    +84 (869) 017-464
                                </span>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 text-white-tertiary mt-0.5 flex-shrink-0" />
                                <span className="text-white-tertiary text-sm leading-relaxed">
                                    1 Võ Văn Ngân, Phường Linh Chiểu, Thành phố Thủ Đức, Thành phố Hồ Chí Minh
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="sm:col-span-1">
                        <h3 className="text-white-primary font-semibold text-lg mb-4">
                            {t("categories") || "Categories"}
                        </h3>
                        <ul className="space-y-3">
                            {categories.map((category, index) => (
                                <li key={index}>
                                    <Link
                                        href={category.href}
                                        className="text-white-tertiary hover:text-white-primary transition-colors duration-200 text-sm block"
                                    >
                                        {category.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter & Social */}
                    <div className="sm:col-span-1">
                        <h3 className="text-white-primary font-semibold text-lg mb-4">
                            {t("stay_connected") || "Stay Connected"}
                        </h3>

                        {/* Newsletter Signup */}
                        <div className="mb-6">
                            <p className="text-white-tertiary text-sm mb-3">
                                {t("newsletter_desc") ||
                                    "Subscribe to get updates on new products and offers"}
                            </p>
                            <div className="flex flex-col gap-2">
                                <input
                                    type="email"
                                    placeholder={t("email_placeholder") || "Enter your email"}
                                    className="w-full px-3 py-2 rounded-md bg-black-secondary border border-black-tertiary text-white-primary text-sm placeholder-white-tertiary focus:outline-none focus:ring-2 focus:ring-white-secondary"
                                />
                                <button className="w-full sm:w-auto px-4 py-2 bg-white-secondary text-black-primary rounded-md hover:bg-white-primary transition-colors duration-200 text-sm">
                                    {t("subscribe") || "Subscribe"}
                                </button>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div>
                            <p className="text-white-tertiary text-sm mb-3">
                                {t("follow_us") || "Follow us on social media"}
                            </p>
                            <div className="flex gap-3">
                                {socialLinks.map((social, index) => (
                                    <Link
                                        key={index}
                                        href={social.href}
                                        className="w-10 h-10 rounded-full bg-black-secondary hover:bg-white-secondary hover:text-black-primary transition-all duration-200 flex items-center justify-center group"
                                        aria-label={social.label}
                                    >
                                        <social.icon className="h-5 w-5" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-black-tertiary">
                <div className="mx-auto px-4 sm:px-6 lg:px-20 xl:px-28 py-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-white-tertiary text-sm text-center sm:text-left">
                            <span>
                                © 2025 {"hkkuptech"}. {t("all_rights_reserved") || "All rights reserved."}
                            </span>
                            <div className="flex gap-4">
                                <Link
                                    href="#"
                                    className="hover:text-white-primary transition-colors duration-200"
                                >
                                    {t("terms_of_service") || "Terms of Service"}
                                </Link>
                                <Link
                                    href="#"
                                    className="hover:text-white-primary transition-colors duration-200"
                                >
                                    {t("privacy_policy") || "Privacy Policy"}
                                </Link>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="flex items-center gap-2">
                            <span className="text-white-tertiary text-sm mr-2">
                                {t("we_accept") || "We accept:"}
                            </span>
                            <div className="flex gap-2">
                                <div className="w-8 h-6 bg-white-secondary rounded flex items-center justify-center">
                                    <CreditCard className="h-4 w-4 text-black-primary" />
                                </div>
                                <div className="w-8 h-6 bg-white-secondary rounded flex items-center justify-center">
                                    <Container className="h-4 w-4 text-black-primary" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default MainFooter;