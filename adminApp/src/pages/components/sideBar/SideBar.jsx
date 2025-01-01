import React from "react";
import './sideBar.css';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGauge,
  faUsers,
  faStore,
  faCreditCard,
  faTruck,
  faChartLine,
  faBell,
  faGears,
  faRightFromBracket,
  faServer,
  faClipboardList,
  faCircleUser,
  faBars,
  faXmark,
  faChevronLeft,
  faChevronRight,
  faHotel,
  faHouse,
  faCity
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({isOpen, setIsOpen, use}) => {
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`${isOpen ? 'w-48' : 'w-20'} bg-blue-600 min-h-screen bg-blue-500 border-r border-gray-200 transition-all duration-300 maw-h-screen fixed top-0 left-0 z-50`}>
      <div className="h-12 flex items-center justify-between px-4">
        <Link to="/" className="no-underline">
          <span className={`${isOpen ? 'block' : 'hidden'} text-xl font-bold`}>
            XXXXXXXX
          </span>
        </Link>
        <div 
          className="flex items-center gap-1 cursor-pointer hover:text-[#533399] transition-colors"
          onClick={toggleSidebar}
        >
          {isOpen ? (
            <>
              <FontAwesomeIcon
                icon={faChevronLeft}
                className="text-sm"
              />
              <FontAwesomeIcon
                icon={faBars}
                className="text-lg"
              />
            </>
          ) : (
            <>
              <FontAwesomeIcon
                icon={faBars}
                className="text-lg"
              />
              <FontAwesomeIcon
                icon={faChevronRight}
                className="text-sm"
              />
            </>
          )}
        </div>
      </div>
      
      <hr className="border-gray-200" />
      
      <div className="px-3">
        <ul className="list-none m-0 p-0 items">
          {/* Main Section */}
          {isOpen && <p className="text-xs font-bold text-gray-400 my-4">MAIN</p>}
          <Link to="/" className="no-underline">
            <li className={` ${!isOpen ? 'my-4' : null}  ${use === "dashbord" ? 'active' : null} items-center p-2  cursor-pointer hover:bg-blue-100 rounded-md transition-colors`}>
              <FontAwesomeIcon icon={faGauge} className="icon" />
              {isOpen && <span className="text-sm font-semibold  ml-2">Dashboard</span>}
            </li>
          </Link>

          {/* Lists Section */}
          {isOpen && <p className="text-xs font-bold text-gray-400 my-4">LISTS</p>}
          <Link to="/users" className="no-underline">
            <li className={`flex items-center p-2 cursor-pointer hover:bg-blue-100  rounded-md ${use === "user" ? 'active' : null}`}>
              <FontAwesomeIcon icon={faUsers} className="icon" />
              {isOpen && <span className="text-sm font-semibold  ml-2">Users</span>}
            </li>
          </Link>
          <Link to="/hotels" className="no-underline">
            <li className={`flex items-center p-2 cursor-pointer hover:bg-blue-100  rounded-md ${use === "hotels" ? 'active' : null}`}>
              <FontAwesomeIcon icon={faHotel} className="icon" />
              {isOpen && <span className="text-sm font-semibold  ml-2">Hotels</span>}
            </li>
          </Link>

          {/* Houses Section */}
          <Link to="/houses-sales" className="no-underline">
            <li className={`flex items-center p-2 cursor-pointer hover:bg-blue-100  rounded-md ${use === "housesSales" ? 'active' : null}`}>
              <FontAwesomeIcon icon={faHouse} className="icon" />
              {isOpen && <span className="text-sm font-semibold  ml-2">Houses</span>}
            </li>
          </Link>

          <Link to="/cities" className="no-underline">
            <li className={`flex items-center p-2 cursor-pointer hover:bg-blue-100  rounded-md ${use === "cities" ? 'active' : null}`}>
              <FontAwesomeIcon icon={faCity} className="icon" />
              {isOpen && <span className="text-sm font-semibold  ml-2">Cities</span>}
            </li>
          </Link>

          {/* Useful Section */}
          {isOpen && <p className="text-xs font-bold text-gray-400 my-4">USEFUL</p>}
          <li className="flex items-center p-2 cursor-pointer hover:bg-blue-100 rounded-md transition-colors">
            <FontAwesomeIcon icon={faChartLine} className="icon" />
            {isOpen && <span className="text-sm font-semibold  ml-2">Stats</span>}
          </li>
          <li className="flex items-center p-2 cursor-pointer hover:bg-blue-100 rounded-md transition-colors">
            <FontAwesomeIcon icon={faBell} className="icon" />
            {isOpen && <span className="text-sm font-semibold  ml-2">Notifications</span>}
          </li>

          {/* Service Section */}
          {isOpen && <p className="text-xs font-bold text-gray-400 my-4">SERVICE</p>}
          <li className="flex items-center p-2 cursor-pointer hover:bg-blue-100 rounded-md transition-colors">
            <FontAwesomeIcon icon={faServer} className="icon" />
            {isOpen && <span className="text-sm font-semibold  ml-2">System Health</span>}
          </li>
          <li className="flex items-center p-2 cursor-pointer hover:bg-blue-100 rounded-md transition-colors">
            <FontAwesomeIcon icon={faClipboardList} className="icon" />
            {isOpen && <span className="text-sm font-semibold  ml-2">Logs</span>}
          </li>
          <li className="flex items-center p-2 cursor-pointer hover:bg-blue-100 rounded-md transition-colors">
            <FontAwesomeIcon icon={faGears} className="icon" />
            {isOpen && <span className="text-sm font-semibold  ml-2">Settings</span>}
          </li>

          {/* User Section */}
          {isOpen && <p className="text-xs font-bold text-gray-400 my-4">USER</p>}
          <li className="flex items-center p-2 cursor-pointer hover:bg-blue-100 rounded-md transition-colors">
            <FontAwesomeIcon icon={faCircleUser} className="icon" />
            {isOpen && <span className="text-sm font-semibold  ml-2">Profile</span>}
          </li>
          <li className="flex items-center p-2 cursor-pointer hover:bg-blue-100 rounded-md transition-colors">
            <FontAwesomeIcon icon={faRightFromBracket} className="icon" />
            {isOpen && <span className="text-sm font-semibold  ml-2">Logout</span>}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
