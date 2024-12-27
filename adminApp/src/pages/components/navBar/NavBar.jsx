import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faGlobe,
  faExpand,
  faBell,
  faMessage
} from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ closeSide }) => {
  return (
    <nav className={`absolute top-0 right-0 h-[50px] border-b border-gray-200 flex items-center text-sm text-gray-600 bg-blue-600 z-50 ${closeSide ? 'left-[167px]' : 'left-[76px]'}`}>
      <div className="w-full px-5 flex items-center justify-between">
        <div className="flex items-center border border-black p-1 rounded">
          <input 
            type="text" 
            placeholder="Search..." 
            className="border-none outline-none bg-transparent placeholder:text-xs placeholder:text-black "
          />
          <FontAwesomeIcon icon={faSearch} className="text-black" />
        </div>
        
        <div className="flex items-center">
          <div className="flex items-center mr-5 relative">
            <FontAwesomeIcon icon={faGlobe} className="text-lg" />
            <span className="ml-1">English</span>
          </div>
          
          <div className="flex items-center mr-5">
            <FontAwesomeIcon icon={faExpand} className="text-lg" />
          </div>
          
          <div className="flex items-center mr-5 relative">
            <FontAwesomeIcon icon={faBell} className="text-lg" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
              1
            </div>
          </div>
          
          <div className="flex items-center mr-5 relative">
            <FontAwesomeIcon icon={faMessage} className="text-lg" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
              2
            </div>
          </div>
          
          <div className="flex items-center">
            <img
              src="https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
              alt="User profile"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
