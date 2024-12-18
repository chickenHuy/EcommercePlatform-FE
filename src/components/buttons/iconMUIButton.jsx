import React from 'react';
import Image from 'next/image';
import IconNotFound from '../../../public/images/iconNotFound.png';

const IconButton = ({
    IconComponent = null,
    iconColor = 'text-black-primary',
    tooltip = '',
    width = 'w-fit',
    height = 'h-fit',
    backgroundColor = 'bg-transparent',
    radius = '',
    otherStyles = '',
    onHover = '',
    onClick = () => { },
}) => {
    console.log(IconComponent);
    return (
        <div
            className={`p-1 flex justify-center items-center cursor-pointer 
                ${width} 
                ${height} 
                ${radius} 
                ${onHover}
                ${otherStyles}
                ${backgroundColor}`}
            onClick={onClick}
            title={tooltip}>

            <div className={iconColor}>
                {IconComponent ? <IconComponent /> : <Image src={IconNotFound} alt='Icon not found' width={40} height={40} />}
            </div>

        </div>
    );
};

export default IconButton;