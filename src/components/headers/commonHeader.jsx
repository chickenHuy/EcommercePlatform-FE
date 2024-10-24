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

function CommonHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-black-primary">
      {/* Logo */}
      <div className="flex flex-row justify-center items-center cursor-pointer ml-3">
        <span className="text-white-secondary text-[19px]">
        </span>
      </div>
    </header>
  );
}

export default CommonHeader;
