"use client";

import ChickenImage from "@/assets/chicken.png";
import Image from "next/image";
import IconButton from "../buttons/iconMUIButton";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import WidgetsIcon from "@mui/icons-material/Widgets";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import MenuItem from "../menu/menuItem";
import DropdownMenu from "../menu/dropdownMenu";
import { useState } from "react";
import { Divider, Switch } from "@mui/material";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import CheckIcon from "@mui/icons-material/Check";
import { useTranslations } from "next-intl";
import { localeDetector } from "@/utils/commonUtils";

function VendorHeader() {
  const [timeoutId, setTimeoutId] = useState(null);
  const [activeButton, setActiveButton] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  const [timeoutIdLanguage, setTimeoutIdLanguage] = useState(null);
  const [showMenuLanguage, setShowMenuLanguage] = useState(false);

  // True if the current locale is 'en' and false otherwise.
  const locale = localeDetector();

  const t = useTranslations("VendorHeader");

  const handleMouseEnter = (button) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setActiveButton(button);
    setShowMenu(true);
  };

  const handleMouseLeave = () => {
    const newTimeoutId = setTimeout(() => {
      setShowMenu(false);
      setActiveButton(null);
    }, 700);
    setTimeoutId(newTimeoutId);
  };

  const handleMenuMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };

  const handleMenuMouseLeave = () => {
    handleMouseLeave();
  };

  const handleLanguageMouseEnter = () => {
    if (timeoutIdLanguage) {
      clearTimeout(timeoutIdLanguage);
    }
    setShowMenuLanguage(true);
  };

  const handleLanguageMouseLeave = () => {
    const newTimeoutId = setTimeout(() => {
      setShowMenuLanguage(false);
    }, 700);
    setTimeoutIdLanguage(newTimeoutId);
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-black-primary">
      {/* Logo */}
      <div className="flex flex-row justify-center items-center cursor-pointer ml-3">
        <Image src={ChickenImage} alt="Chicken" width={50} height={50} />
        <span className="text-white-secondary text-[19px]">
          {t("vendorTitle")}
        </span>
      </div>

      {/* Search bar */}
      <div className="flex-grow"></div>

      {/* Function buttons  */}
      <div
        className="w-fit h-full flex flex-row justify-center items-center"
        onMouseLeave={handleMouseLeave}
      >
        {/* Notifications */}
        <div
          className="w-fit h-full relative"
          onMouseEnter={() => handleMouseEnter("button_widgets")}
          onLeave={handleMouseLeave}
        >
          <IconButton
            IconComponent={WidgetsIcon}
            iconColor="text-white-secondary"
            width="w-[50px]"
            height="h-full"
            onHover="hover:bg-black-tertiary"
          />

          <div
            className={`absolute top-full left-1/2 -translate-x-[50%] origin-top duration-300 ${
              showMenu && activeButton === "button_widgets"
                ? "scale-100"
                : "opacity-0 scale-0"
            }`}
            onMouseEnter={handleMenuMouseEnter}
            onMouseLeave={handleMenuMouseLeave}
          >
            <DropdownMenu
              width="w-[350px]"
              listMenuItems={[
                <MenuItem menuIcon={<WidgetsIcon />} menuContext="Widget" />,
                <MenuItem menuIcon={<WidgetsIcon />} menuContext="Widget" />,
                <MenuItem menuIcon={<WidgetsIcon />} menuContext="Widget" />,
                <MenuItem menuIcon={<WidgetsIcon />} menuContext="Widget" />,
                <MenuItem menuIcon={<WidgetsIcon />} menuContext="Widget" />,
                <MenuItem menuIcon={<WidgetsIcon />} menuContext="Widget" />,
              ]}
            />
          </div>
        </div>

        {/* Widgets */}
        <div
          className="w-fit h-full relative"
          onMouseEnter={() => handleMouseEnter("button_notifications")}
          onLeave={handleMouseLeave}
        >
          <IconButton
            IconComponent={NotificationsNoneIcon}
            iconColor="text-white-secondary"
            width="w-[50px]"
            height="h-full"
            onHover="hover:bg-black-tertiary"
          />

          <div
            className={`absolute top-full left-1/2 -translate-x-[50%] origin-top duration-300 ${
              showMenu && activeButton === "button_notifications"
                ? "scale-100"
                : "opacity-0 scale-0"
            }`}
            onMouseEnter={handleMenuMouseEnter}
            onMouseLeave={handleMenuMouseLeave}
          >
            <DropdownMenu
              width="w-[430px]"
              listMenuItems={[
                <MenuItem
                  menuIcon={<NotificationsNoneIcon />}
                  menuContext="Notification"
                />,
                <MenuItem
                  menuIcon={<NotificationsNoneIcon />}
                  menuContext="Notification"
                />,
                <MenuItem
                  menuIcon={<NotificationsNoneIcon />}
                  menuContext="Notification"
                />,
                <MenuItem
                  menuIcon={<NotificationsNoneIcon />}
                  menuContext="Notification"
                />,
                <MenuItem
                  menuIcon={<NotificationsNoneIcon />}
                  menuContext="Notification"
                />,
                <MenuItem
                  menuIcon={<NotificationsNoneIcon />}
                  menuContext="Notification"
                />,
                <MenuItem
                  menuIcon={<NotificationsNoneIcon />}
                  menuContext="Notification"
                />,
                <MenuItem
                  menuIcon={<NotificationsNoneIcon />}
                  menuContext="Notification"
                />,
                <MenuItem
                  menuIcon={<NotificationsNoneIcon />}
                  menuContext="Notification"
                />,
                <MenuItem
                  menuIcon={<NotificationsNoneIcon />}
                  menuContext="Notification"
                />,
              ]}
            />
          </div>
        </div>
      </div>

      {/* User infor */}
      <div
        className="w-fit h-full relative"
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => handleMouseEnter("button_user_options")}
        onLeave={handleMouseLeave}
      >
        <div
          className="h-full w-fit min-w-[200px] px-3 flex flex-row justify-end items-center gap-2 cursor-pointer hover:bg-black-tertiary"
          onMouseEnter={() => handleMouseEnter("button_user_options")}
        >
          <Image
            src={ChickenImage}
            alt="Chicken"
            width={40}
            height={40}
            onMouseEnter={() => handleMouseEnter("button_user_options")}
          />
          <span
            className="text-white-secondary"
            onMouseEnter={() => handleMouseEnter("button_user_options")}
          >
            Username
          </span>
          <div
            className="text-white-secondary"
            onMouseEnter={() => handleMouseEnter("button_user_options")}
          >
            {showMenu && activeButton === "button_user_options" ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </div>
        </div>

        <div
          className={`absolute top-full right-0 origin-top duration-300 ${
            showMenu && activeButton === "button_user_options"
              ? "scale-100"
              : "scale-0"
          }`}
          onMouseEnter={handleMenuMouseEnter}
          onMouseLeave={handleMenuMouseLeave}
        >
          <DropdownMenu
            width="w-[300px]"
            listMenuItems={[
              <div className="flex flex-col justify-center items-center gap-1 my-5">
                <Image
                  src={ChickenImage}
                  alt="Chicken"
                  width={40}
                  height={40}
                />
                <span>Username</span>
              </div>,

              <Divider sx={{ margin: "6px 0" }} />,

              <MenuItem
                menuIcon={<StorefrontOutlinedIcon />}
                menuContext={t("userOptionsMenu.shop-information")}
              />,
              <MenuItem
                menuIcon={<SettingsOutlinedIcon />}
                menuContext={t("userOptionsMenu.shop-setting")}
              />,

              <div
                className="flex flex-row justify-center items-center relative"
                onMouseEnter={handleLanguageMouseEnter}
                onMouseLeave={handleLanguageMouseLeave}
              >
                <MenuItem
                  menuIcon={<LanguageOutlinedIcon />}
                  menuContext={t("userOptionsMenu.language")}
                  otherComponent={
                    showMenuLanguage ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )
                  }
                />
                <div
                  className={`${
                    showMenuLanguage ? "scale-100" : "opacity-0 scale-0"
                  } duration-300 absolute right-0 top-full`}
                  onMouseEnter={handleLanguageMouseEnter}
                  onMouseLeave={handleLanguageMouseLeave}
                >
                  <DropdownMenu
                    width="w-[170px]"
                    listMenuItems={[
                      <MenuItem
                        menuContext="Tiếng Việt"
                        otherComponent={locale ? "" : <CheckIcon />}
                      />,
                      <MenuItem
                        menuContext="English"
                        otherComponent={!locale ? "" : <CheckIcon />}
                      />,
                    ]}
                  />
                </div>
              </div>,

              <Divider sx={{ margin: "6px 0" }} />,

              <MenuItem
                menuIcon={<ExitToAppOutlinedIcon />}
                menuContext={t("userOptionsMenu.logout")}
              />,
            ]}
          />
        </div>
      </div>
    </header>
  );
}

export default VendorHeader;
