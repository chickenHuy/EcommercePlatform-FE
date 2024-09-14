import Image from 'next/image'
import React from 'react'

export const Button = ({
    width = 'w-fit',
    height = 'h-fit',
    backgroundColor = 'bg-white-primary',
    borderColor = 'border-black-primary',
    borderWidth = 'border-[0px]',
    borderRadius = '',

    iconSrc,

    text,
    textColor = 'text-black-primary',
    textSize = 'text-[16px]',
    textStyle = 'font-regular',

    onClick
}) => {
    return (
        <div
            className={`${width} ${height} ${backgroundColor} ${borderColor} ${borderWidth} ${borderRadius} flex flex-row justify-center items-center p-1 cursor-pointer`}
            onClick={onClick} >
            {iconSrc && (
                <Image className="w-[24px] h-[24px] mr-1" src={iconSrc} alt="" />
            )}
            <span className={`${textColor} ${textSize} ${textStyle}`}>{text}</span>
        </div>
    )
}