const DropdownMenu = ({
    listMenuItems,
    width = 'w-fit'
}) => {
    return (
        <div className={`${width} h-fit mt-3 bg-white-primary flex flex-col justify-center items-center rounded-[4px] shadow-md p-2 relative`}>

            <div className="absolute -top-[10px] w-0 h-0 border-r-[10px] border-r-transparent-primary border-l-[10px] border-l-transparent-primary border-b-[10px] border-b-white-primary"></div>

            {listMenuItems.map((item, index) => (
                <div key={index} className="w-full">
                    {item}
                </div>
            ))}

        </div>
    );
};

export default DropdownMenu;

