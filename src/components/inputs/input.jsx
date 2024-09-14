import React from 'react';

export const Input = ({
    width = 'w-full',
    height = 'h-12',
    backgroundColor = 'bg-input',

    borderColor = 'border-black-tertiary',
    borderWidth = 'border-[0px]',
    borderRadius = 'rounded-lg',

    textColor = 'text-black-primary',

    type = 'text',
    placeholder = '',
}) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            className={`${width} ${height} ${backgroundColor} ${borderColor} ${borderWidth} ${borderRadius} ${textColor} px-3 py-1 outline-none focus:border-[1px]`}
        />
    );
};
