import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useState } from 'react';

const CommonNavigate = ({ navigateContext }) => {
    const [openItems, setOpenItems] = useState({});

    const handleClick = (index) => {
        setOpenItems((prevOpenItems) => ({
            ...prevOpenItems,
            [index]: !prevOpenItems[index],
        }));
    };

    return (
        <div
            className='w-[250px] h-fit min-h-screen bg-white-primary px-1 py-4'>
            {navigateContext.map((item, index) => (
                <div key={index} className='mb-3'>
                    <div className='flex flex-row justify-start items-center gap-3 text-black-tertiary cursor-pointer px-1 py-3 rounded-sm hover:bg-white-secondary' onClick={() => handleClick(index)}>
                        {item.icon}
                        <span style={{ fontWeight: '900' }} className='flex-grow text-sm'>{item.content}</span>
                        {item.children && (openItems[index] ? <ExpandLess /> : <ExpandMore />)}
                    </div>
                    {item.children && (
                        <Collapse in={openItems[index]} timeout="auto" unmountOnExit>
                            <div>
                                {item.children.map((child, childIndex) => (
                                    <div className=' ml-7 px-2 py-1 rounded-sm hover:bg-white-secondary cursor-pointer' key={childIndex} onClick={child.onClick}>
                                        {child.icon}
                                        <span className='text-sm'>{child.content}</span>
                                    </div>
                                ))}
                            </div>
                        </Collapse>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CommonNavigate;