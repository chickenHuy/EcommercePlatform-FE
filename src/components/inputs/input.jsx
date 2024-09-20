import React from 'react';
import { useDispatch } from 'react-redux';

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
    reducer = null
}) => {

    const dispatch = useDispatch();

    return (
        <input
            type={type}
            placeholder={placeholder}
            className={`${width} ${height} ${backgroundColor} ${borderColor} ${borderWidth} ${borderRadius} ${textColor} px-3 py-1 outline-none focus:border-[1px]`} onChange={(e) => {
                if (reducer) {
                    dispatch(reducer(e.target.value));
                }
            }}
        />
    );
};
