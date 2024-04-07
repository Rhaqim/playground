import React, { useState } from 'react';

interface DropdownProps {
    name: string;
    children: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({ name, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className='my-2'>
            <button 
            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
            onClick={toggleDropdown}>Toggle {name} <span>{isOpen ? '▲' : '▼'}</span></button>
            {isOpen && <div
            className='p-4 border border-gray-300 rounded-md mt-2 flex flex-col space-y-2'
            >{children}</div>}
        </div>
    );
};

export default Dropdown;