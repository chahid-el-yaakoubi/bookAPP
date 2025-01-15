import { useState, useEffect } from "react";
import Sidebar from "./sideBar/SideBar";
import NavBar from "./navBar/NavBar";

const Layout = ({ children, use }) => {



    return (
        <div className="flex min-h-screen bg-blue-100 ">
            <Sidebar  use={use} />
            <div className={`w-full  scrollbar-hide transition-all duration-300  ml-24`}>
                {/* <NavBar closeSide={sidebarOpen} /> */}
                {children  }
            </div>
        </div>
    );
}

export default Layout;