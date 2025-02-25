import React from 'react';

const NavItem = ({ icon, text, active, onClick, showText = true }) => {
    return (
        <button
            onClick={onClick}
            className={`
                w-full flex items-center px-4 py-3 
                ${active ? 'bg-blue ' : 'text-gray-300 hover:bg-gray-50 hover:text-gray-900'}
                transition-colors duration-200
            `}
        >
            <span className="text-xl">{icon}</span>
            {showText && <span className="ml-3 font-medium">{text}</span>}
        </button>
    );
};

export default NavItem; 