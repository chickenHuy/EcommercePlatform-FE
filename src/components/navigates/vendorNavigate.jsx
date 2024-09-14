"use client";

import React from 'react'
import { useTranslations } from 'next-intl';
import CommonNavigate from './commonNavigate';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import SignalCellularAltOutlinedIcon from '@mui/icons-material/SignalCellularAltOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';

const VendorNavigate = () => {
    const t = useTranslations("VendorNagivate");

    const navigateContext = [
        {
            icon: <ListAltOutlinedIcon />,
            content: t('order.title'),
            onClick: () => console.log('Order clicked'),
            children: [
                {
                    icon: null,
                    content: t('order.my-orders'),
                    onClick: () => console.log('Order child clicked'),
                },
                {
                    icon: null,
                    content: t('order.cancellation'),
                    onClick: () => console.log('Order child clicked'),
                },
                {
                    icon: null,
                    content: t('order.return-refund'),
                    onClick: () => console.log('Order child clicked'),
                },
                {
                    icon: null,
                    content: t('order.shipping-setting'),
                    onClick: () => console.log('Order child clicked'),
                },
            ],
        },
        {
            icon: <Inventory2OutlinedIcon />,
            content: t('product.title'),
            onClick: () => console.log('Product clicked'),
            children: [
                {
                    icon: null,
                    content: t('product.my-products'),
                    onClick: () => console.log('Product child clicked'),
                },
                {
                    icon: null,
                    content: t('product.add-new-product'),
                    onClick: () => console.log('Product child clicked'),
                },
            ],
        },
        {
            icon: <SupportAgentOutlinedIcon />,
            content: t('customerService.title'),
            onClick: () => console.log('Customer service clicked'),
            children: [
                {
                    icon: null,
                    content: t('customerService.chat-management'),
                    onClick: () => console.log('Customer service child clicked'),
                },
                {
                    icon: null,
                    content: t('customerService.review-management'),
                    onClick: () => console.log('Customer service child clicked'),
                },
            ],
        },
        {
            icon: <SignalCellularAltOutlinedIcon />,
            content: t('data.title'),
            onClick: () => console.log('Data clicked'),
            children: [
                {
                    icon: null,
                    content: t('data.business-insight'),
                    onClick: () => console.log('Data child clicked'),
                },
                {
                    icon: null,
                    content: t('data.account-health'),
                    onClick: () => console.log('Data child clicked'),
                },
            ],
        },
        {
            icon: <StorefrontOutlinedIcon />,
            content: t('shop.title'),
            onClick: () => console.log('Shop clicked'),
            children: [
                {
                    icon: null,
                    content: t('shop.shop-information'),
                    onClick: () => console.log('Shop child clicked'),
                },
                {
                    icon: null,
                    content: t('shop.shop-decoration'),
                    onClick: () => console.log('Shop child clicked'),
                },
                {
                    icon: null,
                    content: t('shop.shop-setting'),
                    onClick: () => console.log('Shop child clicked'),
                },
            ],
        },
    ];
    return (
        <div className='w-fit h-fit'>
            <CommonNavigate navigateContext={navigateContext} />
        </div>
    )
}

export default VendorNavigate;
