import { useState, useEffect } from "react";
import Sidebar from "./sideBar/SideBar";
import NavBar from "./navBar/NavBar";

const Layout = ({ children, use }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);



    return (
        <div className="flex min-h-screen bg-blue-100">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} use={use} />
            <div className={`w-full   scrollbar-hide transition-all duration-300 ${sidebarOpen ? 'ml-20' : 'ml-20'}`}>
                {/* <NavBar closeSide={sidebarOpen} /> */}
                {children  }
            </div>
        </div>
    );
}

export default Layout;