import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faHouse,
  faHouseChimneyMedical,
  faCar,
  faArrowUp,
  faCity,
  faShopLock,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Widget = ({ type, count }) => {
  const diff = 25; // temporary

  const data = {
    cities: {
      title: "CITIES",
      Count: count,
      isMoney: false,
      path: "/cities",
      link: "See all cities",
      icon: faCity,
      iconStyle: "bg-red-200 text-red-800", // Lighter red for a softer look
      bg: "bg-orange-400", // Softer background
    },
    hotel: {
      title: "HOUSE RENTALS",
      Count: count,
      isMoney: false,
      path: "/hotels",
      link: "View all hotels&houses ",
      icon: faHouse,
      iconStyle: "bg-blue-200 text-blue-800", // Softer blue
      bg: "bg-blue-300", // Softer background
    },
    house: {
      title: "REAL ESTATE",
      Count: count || 100,
      isMoney: false,
      path: "/houses-sales",
      link: "View all houses",
      icon: faHouseChimneyMedical,
      iconStyle: "bg-green-200 text-green-800", // Softer green
      bg: "bg-green-300", // Softer background
    },
    shops: {
      title: "SHOPS",
      Count: count,
      isMoney: false,
      path: "/shops",
      link: "View all shops",
      icon: faShopLock,
      iconStyle: "bg-yellow-200 text-yellow-800", // Softer yellow
      bg: "bg-yellow-300", // Softer background
    },
    cars: {
      title: "CARS",
      Count: count,
      isMoney: false,
      link: "See all cars",
      path: "/cars",
      icon: faCar,
      iconStyle: "bg-purple-200 text-purple-800", // Softer purple
      bg: "bg-purple-300", // Softer background
    },
    user: {
      title: "USERS",
      Count: count || 100,
      isMoney: false,
      path: "/users",
      link: "See all users",
      icon: faUser,
      iconStyle: "bg-orange-200 text-orange-800", // Softer orange
      bg: "bg-orange-300", // Softer background
    },
  }[type] || {};

  return (
    <div className={`flex justify-between flex-1 p-2.5 shadow-lg ${data.bg} rounded-xl h-[100px]`}>
      <div className="flex flex-col justify-between">
        <span className="font-bold text-sm text-gray-600">{data.title}</span>
        <span className="text-2xl font-light">
          {data.isMoney && "$"} {data.Count}
        </span>
        <Link to={`${data.path}`}>
          <span className="text-xs border-b border-gray-400 w-max cursor-pointer hover:text-blue-600 hover:text-sm transition-all duration-200">
            {data.link}
          </span>
        </Link>
      </div>
      <div className="flex flex-col justify-between">
        <div className="flex items-center text-sm text-green-600">
          <FontAwesomeIcon icon={faArrowUp} />
          {diff} %
        </div>
        <div className={`p-1.5 rounded-md self-end ${data.iconStyle}`}>
          <FontAwesomeIcon icon={data.icon} className="text-lg" />
        </div>
      </div>
    </div>
  );
};

export default Widget;