import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot , faBookmark} from "@fortawesome/free-solid-svg-icons";

export const HotelHeader = ({ hotel }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start gap-4 my-6 ">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{hotel?.title}</h1>
        <div className="flex items-center gap-2 mt-2 bg-gray-100 p-1 rounded-lg"> 
          <FontAwesomeIcon icon={faLocationDot} className="text-blue-500" />
          <span className="text-gray-900">{hotel?.address || "Nador, Morocco"}</span>
        </div>
        <div className="text-blue-600 text-sm mt-2">
          Excellent location - {hotel?.distance || 500}m from center
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button className="flex items-center gap-2 text-gray-600 bg-gray-100 p-2 rounded-lg transition-colors">
          <FontAwesomeIcon icon={faBookmark} className="text-xl" />
          <span>Save</span>
        </button>
      </div>
    </div>
  );
}; 