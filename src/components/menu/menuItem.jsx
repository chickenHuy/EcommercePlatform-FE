import { IconButton, Typography } from '@mui/material';
import React from 'react'

const MenuItem = ({
    menuIcon = null,
    menuContext = '',
    otherComponent = null,
    onClick = () => { },
}) => {

    return (
        <div className='flex flex-row justify-start items-center gap-3 w-full h-fit px-5 py-[5px] hover:bg-white-secondary hover:shadow-md rounded-[4px] cursor-pointer' onClick={onClick}>
            {menuIcon}
            <span className='text-sm flex-grow'>
                {menuContext}
            </span>
            {otherComponent}
        </div>
    )
}

export default MenuItem;
