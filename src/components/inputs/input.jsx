import React, { forwardRef } from "react";
import { useDispatch } from "react-redux";

export const Input = forwardRef(
  (
    {
      width = "w-full",
      height = "h-12",
      backgroundColor = "bg-[#f3f3f3]",
      borderColor = "border-black-tertiary",
      borderWidth = "border-[0px]",
      borderRadius = "rounded-lg",
      textColor = "text-black-primary",
      type = "text",
      placeholder = "",
      reducer = null,
      ...props
    },
    ref
  ) => {
    const dispatch = useDispatch();

    return (
      <input
        ref={ref} // Forward the ref here
        type={type}
        placeholder={placeholder}
        className={`${width} ${height} ${backgroundColor} ${borderColor} ${borderWidth} ${borderRadius} ${textColor} px-3 py-1 outline-none focus:border-[1px]`}
        onChange={(e) => {
          if (reducer) {
            dispatch(reducer(e.target.value));
          }
        }}
        {...props} // Spread the props so react-hook-form can use them
      />
    );
  }
);

Input.displayName = "Input-Custom";