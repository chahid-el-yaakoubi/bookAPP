import React, { useState, useContext } from "react";
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
  faCity,
  faShop,
  faCar,
  faHandshake
} from '@fortawesome/free-solid-svg-icons';
import Logout from "../../login/Logout";
import { AuthContext } from "../../context/AuthContect";

const Sidebar = ({ use }) => {
  const { state } = useContext(AuthContext);
    const user = state?.user;
  const { cars, users, hotes, houses, shops } = user.roles;
  const isAdmin = user?.role === 'admin';

  const [logout, setLogout] = useState(false);

  return (
    <div className="sidebar w-20 hover:w-64 bg-gradient-to-b from-blue-600 to-blue-700 border-r border-gray-200 transition-all duration-300 fixed top-0 left-0 z-50 bottom-0 overflow-auto scrollbar-hide">
      <div className="h-16 flex items-center justify-between px-4 bg-blue-700">
        <Link to="/" className="no-underline">
          <span className="block text-xl font-bold text-white">
            LOGO
          </span>
        </Link>
      </div>
      <div className="px-3 py-4">
        <ul className="list-none m-0 p-0 items">
          <p className="text-xs font-bold text-blue-200 my-4 uppercase tracking-wider">Main</p>
          <Link to="/" className="no-underline">
            <li className={`my-2 ${use === "dashboard" ? 'bg-blue-500' : ''} flex p-3 cursor-pointer hover:bg-blue-500 rounded-lg transition-all duration-200`}>
              <FontAwesomeIcon icon={faGauge} className="icon text-blue-100" />
              <span className="text-sm font-medium ml-3 sidebar-text text-white">Dashboard</span>
            </li>
          </Link>
          {users && (
            <>
          <p className="text-xs font-bold text-blue-200 my-4 uppercase tracking-wider">Lists</p>
          <Link to="/users" className="no-underline">
            <li className={`flex  p-2 cursor-pointer hover:bg-blue-500 rounded-lg ${use === "user" ? 'active' : ''}`}>
              <FontAwesomeIcon icon={faUsers} className="icon text-blue-100" />
              <span className="text-sm font-semibold ml-2 sidebar-text text-white">Users</span>
            </li>
          </Link>
          
          {users && (
            <Link to="/partner" className="no-underline">
              <li className={`flex p-2 cursor-pointer hover:bg-blue-500 rounded-lg ${use === "partner" ? 'active' : ''}`}>
                <FontAwesomeIcon icon={faHandshake} className="icon text-blue-100" />
                <span className="text-sm font-semibold ml-2 sidebar-text text-white">Partners</span>
              </li>
            </Link>
          )}
          </>
          )} 



          {hotes && (
          <Link to="/hotels" className="no-underline">
            <li className={`flex  p-2 cursor-pointer hover:bg-blue-500 rounded-lg ${use === "hotels" ? 'active' : ''}`}>
              <FontAwesomeIcon icon={faHotel} className="icon text-blue-100" />
              <span className="text-sm font-semibold ml-2 sidebar-text text-white">Hotels</span>
            </li>
          </Link>
          )}

          {houses && (
          <Link to="/houses-sales" className="no-underline">
            <li className={`flex  p-2 cursor-pointer hover:bg-blue-500 rounded-lg ${use === "housesSales" ? 'active' : ''}`}>
              <FontAwesomeIcon icon={faHouse} className="icon text-blue-100" />
              <span className="text-sm font-semibold ml-2 sidebar-text text-white">Houses</span>
            </li>
          </Link>
          )}

          {users && (
          <Link to="/cities" className="no-underline">
            <li className={`flex  p-2 cursor-pointer hover:bg-blue-500 rounded-lg ${use === "cities" ? 'active' : ''}`}>
              <FontAwesomeIcon icon={faCity} className="icon text-blue-100" />
              <span className="text-sm font-semibold ml-2 sidebar-text text-white">Cities</span>
            </li>
          </Link>
          )}

          {shops && (
          <Link to="/shops" className="no-underline">
            <li className={`flex  p-2 cursor-pointer hover:bg-blue-500 rounded-lg ${use === "shops" ? 'active' : ''}`}>
              <FontAwesomeIcon icon={faShop} className="icon text-blue-100" />
              <span className="text-sm font-semibold ml-2 sidebar-text text-white">Shops</span>
            </li>
          </Link>
          )} 

          {cars && (
          <Link to="/cars" className="no-underline">
            <li className={`flex  p-2 cursor-pointer hover:bg-blue-500 rounded-lg ${use === "cars" ? 'active' : ''}`}>
              <FontAwesomeIcon icon={faCar} className="icon text-blue-100" />
              <span className="text-sm font-semibold ml-2 sidebar-text text-white">Cars</span>
            </li>
          </Link>
          )}


          <p className="text-xs font-bold text-blue-200 my-4 uppercase tracking-wider">Useful</p>
          <li className="flex p-3 cursor-pointer hover:bg-blue-500 rounded-lg transition-all duration-200">
            <FontAwesomeIcon icon={faChartLine} className="icon text-blue-100" />
            <span className="text-sm font-medium ml-3 sidebar-text text-white">Stats</span>
          </li>
          <li className="flex  p-2 cursor-pointer hover:bg-blue-500 rounded-lg transition-colors">
            <FontAwesomeIcon icon={faBell} className="icon text-blue-100" />
            <span className="text-sm font-semibold ml-2 sidebar-text text-white">Notifications</span>
          </li>
          <p className="text-xs font-bold text-blue-200 my-4 uppercase tracking-wider">Service</p>
          
          <li className="flex  p-2 cursor-pointer hover:bg-blue-500 rounded-lg transition-colors">
            <FontAwesomeIcon icon={faClipboardList} className="icon text-blue-100" />
            <span className="text-sm font-semibold ml-2 sidebar-text text-white">Logs</span>
          </li>
          <li className="flex  p-2 cursor-pointer hover:bg-blue-500 rounded-lg transition-colors">
            <FontAwesomeIcon icon={faGears} className="icon text-blue-100" />
            <span className="text-sm font-semibold ml-2 sidebar-text text-white">Settings</span>
          </li>
          <p className="text-xs font-bold text-blue-200 my-4 uppercase tracking-wider">User</p>
          <li className="flex  p-2 cursor-pointer hover:bg-blue-500 rounded-lg transition-colors">
            <FontAwesomeIcon icon={faCircleUser} className="icon text-blue-100" />
            <span className="text-sm font-semibold ml-2 sidebar-text text-white">Profile</span>
          </li>
          <button className="w-full mt-4" onClick={() => setLogout(!logout)}>
            <li className="flex p-3 cursor-pointer hover:bg-blue-500 rounded-lg transition-all duration-200">
              <FontAwesomeIcon icon={faRightFromBracket} className="icon text-blue-100" />
              <span className="text-sm font-medium ml-3 sidebar-text text-white">Logout</span>
              <Logout open={logout} setOpen={setLogout} />
            </li>
          </button>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
