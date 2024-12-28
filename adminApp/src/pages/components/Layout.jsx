import { useState, useEffect } from "react";
import Sidebar from "./sideBar/SideBar";
import NavBar from "./navBar/NavBar";

const Layout = ({ children, use }) => {
    const [sidebarOpen, setSidebarOpen] = useState(localStorage.getItem('sidebar') === 'true');

    useEffect(() => {
        localStorage.setItem('sidebar', sidebarOpen);
    }, [sidebarOpen]);

    return (
        <div className="flex min-h-screen bg-blue-100">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} use={use} />
            <div className={`w-full pt-4 h-screen scrollbar-hide transition-all duration-300 ${sidebarOpen ? 'ml-48' : 'ml-20'}`}>
                {/* <NavBar closeSide={sidebarOpen} /> */}
                {children}
            </div>
        </div>
    );
}

export default Layout;