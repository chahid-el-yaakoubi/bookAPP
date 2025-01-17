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
  faCar
} from '@fortawesome/free-solid-svg-icons';
import Logout from "../../login/Logout";
import { AuthContext } from "../../context/AuthContect";

const Sidebar = ({ use }) => {

  const { user } = useContext(AuthContext);
  const { adminCars, adminUsers, adminHotes, adminHouses, adminShops } = user;
  if(!adminHotes){
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
  }
  const [logout, setLogout] = useState(false);

  return (
    <div className="sidebar w-20 hover:w-48 bg-blue-600  border-r border-gray-200 transition-all duration-300 fixed top-0 left-0 z-50 bottom-0 overflow-auto scrollbar-hide ">
      <div className="h-12 flex  justify-between px-4">
        <Link to="/" className="no-underline">
          <span className="block text-xl font-bold">
            logo
          </span>
        </Link>
      </div>
      <hr className="border-gray-200" />
      <div className="px-3">
        <ul className="list-none m-0 p-0 items ">
          <p className="text-xs font-bold text-gray-400 my-4">MAIN</p>
          <Link to="/" className="no-underline">
            <li className={`my-4 ${use === "dashboard" ? 'active' : ''} flex p-2 cursor-pointer hover:bg-blue-100 rounded-md transition-colors`}>
              <FontAwesomeIcon icon={faGauge} className="icon" />
              <span className="text-sm font-semibold ml-2 sidebar-text">Dashboard</span>
            </li>
          </Link>
          {adminUsers && (
            <>
          <p className="text-xs font-bold text-gray-400 my-4">LISTS</p>
          <Link to="/users" className="no-underline">
            <li className={`flex  p-2 cursor-pointer hover:bg-blue-100 rounded-md ${use === "user" ? 'active' : ''}`}>
              <FontAwesomeIcon icon={faUsers} className="icon" />
              <span className="text-sm font-semibold ml-2 sidebar-text">Users</span>
            </li>
          </Link>
          </>
          )} 

          {adminHotes && (
          <Link to="/hotels" className="no-underline">
            <li className={`flex  p-2 cursor-pointer hover:bg-blue-100 rounded-md ${use === "hotels" ? 'active' : ''}`}>
              <FontAwesomeIcon icon={faHotel} className="icon" />
              <span className="text-sm font-semibold ml-2 sidebar-text">Hotels</span>
            </li>
          </Link>
          )}

          {adminHouses && (
          <Link to="/houses-sales" className="no-underline">
            <li className={`flex  p-2 cursor-pointer hover:bg-blue-100 rounded-md ${use === "housesSales" ? 'active' : ''}`}>
              <FontAwesomeIcon icon={faHouse} className="icon" />
              <span className="text-sm font-semibold ml-2 sidebar-text">Houses</span>
            </li>
          </Link>
          )}

          {adminUsers && (
          <Link to="/cities" className="no-underline">
            <li className={`flex  p-2 cursor-pointer hover:bg-blue-100 rounded-md ${use === "cities" ? 'active' : ''}`}>
              <FontAwesomeIcon icon={faCity} className="icon" />
              <span className="text-sm font-semibold ml-2 sidebar-text">Cities</span>
            </li>
          </Link>
          )}

          {adminShops && (
          <Link to="/shops" className="no-underline">
            <li className={`flex  p-2 cursor-pointer hover:bg-blue-100 rounded-md ${use === "shops" ? 'active' : ''}`}>
              <FontAwesomeIcon icon={faShop} className="icon" />
              <span className="text-sm font-semibold ml-2 sidebar-text">Shops</span>
            </li>
          </Link>
          )} 

          {adminCars && (
          <Link to="/cars" className="no-underline">
            <li className={`flex  p-2 cursor-pointer hover:bg-blue-100 rounded-md ${use === "cars" ? 'active' : ''}`}>
              <FontAwesomeIcon icon={faCar} className="icon" />
              <span className="text-sm font-semibold ml-2 sidebar-text">Cars</span>
            </li>
          </Link>
          )}


          <p className="text-xs font-bold text-gray-400 my-4">USEFUL</p>
          <li className="flex  p-2 cursor-pointer hover:bg-blue-100 rounded-md transition-colors">
            <FontAwesomeIcon icon={faChartLine} className="icon" />
            <span className="text-sm font-semibold ml-2 sidebar-text">Stats</span>
          </li>
          <li className="flex  p-2 cursor-pointer hover:bg-blue-100 rounded-md transition-colors">
            <FontAwesomeIcon icon={faBell} className="icon" />
            <span className="text-sm font-semibold ml-2 sidebar-text">Notifications</span>
          </li>
          <p className="text-xs font-bold text-gray-400 my-4">SERVICE</p>
          
          <li className="flex  p-2 cursor-pointer hover:bg-blue-100 rounded-md transition-colors">
            <FontAwesomeIcon icon={faClipboardList} className="icon" />
            <span className="text-sm font-semibold ml-2 sidebar-text">Logs</span>
          </li>
          <li className="flex  p-2 cursor-pointer hover:bg-blue-100 rounded-md transition-colors">
            <FontAwesomeIcon icon={faGears} className="icon" />
            <span className="text-sm font-semibold ml-2 sidebar-text">Settings</span>
          </li>
          <p className="text-xs font-bold text-gray-400 my-4">USER</p>
          <li className="flex  p-2 cursor-pointer hover:bg-blue-100 rounded-md transition-colors">
            <FontAwesomeIcon icon={faCircleUser} className="icon" />
            <span className="text-sm font-semibold ml-2 sidebar-text">Profile</span>
          </li>
          <button className="w-full" onClick={() => setLogout(!logout)}>
            <li className="flex  p-2 cursor-pointer hover:bg-blue-100 rounded-md transition-colors group relative">
              <FontAwesomeIcon icon={faRightFromBracket} className="icon" />
            <span className="text-sm font-semibold ml-2 sidebar-text">Logout</span>

             
              <Logout open={logout} setOpen={setLogout} />
            </li>
          </button>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
