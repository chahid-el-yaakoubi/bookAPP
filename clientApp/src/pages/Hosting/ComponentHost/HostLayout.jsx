import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { FaBars } from 'react-icons/fa';

const HostLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        const savedState = localStorage.getItem('sidebarState');
        return savedState ? JSON.parse(savedState) : true;
    });
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        localStorage.setItem('sidebarState', JSON.stringify(isSidebarOpen));
    }, [isSidebarOpen]);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) {
                setIsSidebarOpen(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar 
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                isMobile={isMobile}
            />

            <div className={`
                flex-1 
                flex flex-col 
                min-h-screen 
                w-full
               
            `}>
                {/* Mobile Header */}
                {isMobile && (
                    <header className="sticky top-0 bg-white shadow-sm p-4 z-20">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 rounded-lg hover:bg-gray-100"
                        >
                            <FaBars />
                        </button>
                    </header>
                )}
                {children}
            </div>
        </div>
    );
};

export default HostLayout; 