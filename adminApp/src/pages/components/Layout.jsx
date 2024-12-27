import { useState } from "react";
import Sidebar from "./sideBar/SideBar";
import NavBar from "./navBar/NavBar";

const Layout = ({ children, use }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const sidebarWidth = sidebarOpen ? '180px' : '0px';

    return (
        <div className="flex min-h-screen bg-blue-100 ">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} use={use} />
            <div className={`w-full pt-4 max-w-[calc(100vw-${sidebarWidth})] h-screen`}>
                {/* <NavBar closeSide={sidebarOpen} /> */}
                {children}
            </div>
        </div>
    );
}

export default Layout;




// setInterval(() => {
//     const playButton = document.querySelector('.plyr__controls__item.plyr__control[data-plyr="play"]');
    
//     if (playButton) {
//       playButton.click();
//       console.log('Play button clicked successfully!');
//     } else {
//       console.error('Play button not found on the page.');
//     }
//   }, 5 * 60 * 1000); // Run every 5 minutes