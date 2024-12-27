import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faHouse,
  faHouseChimneyMedical,
  faCar,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Widget = ({ type }) => {
  // temporary
  const amount = 100;
  const diff = 20;

  const data = {
    user: {
      title: "USERS",
      isMoney: false,
      path: "/users",
      link: "See all users",
      icon: faUser,
      iconStyle: "bg-red-100 text-red-700",
      bg: "bg-orange-400",
    },
    order: {
      title: "HOUSE_RENTALS",
      isMoney: false,
      path: "/hotels",
      link: "View all orders",
      icon: faHouse,
      iconStyle: "bg-yellow-100 text-yellow-600",
      bg: "bg-yellow-300",
    },
    earning: {
      title: "REAL_ESTATE",
      isMoney: false,
      path: "/users",
      link: "View net earnings",
      icon: faHouseChimneyMedical,
      iconStyle: "bg-green-100 text-green-700",
      bg: "bg-green-300",
    },
    balance: {
      title: "CARS",
      isMoney: false,
      link: "See details",
      path: "/users",
      icon: faCar,
      iconStyle: "bg-purple-100 text-purple-700",
      bg: "bg-red-300",
    },
  }[type] || {};

  return (
    <div className={`flex justify-between flex-1 p-2.5 shadow-lg ${data.bg} rounded-xl h-[100px]`}>
      <div className="flex flex-col justify-between">
        <span className="font-bold text-sm text-gray-400">{data.title}</span>
        <span className="text-2xl font-light">
          {data.isMoney && "$"} {amount}
        </span>
        <Link to={`${data.path}`}>
          <span className="text-xs border-b border-gray-400 w-max cursor-pointer hover:text-blue-500 hover:text-sm transition-all duration-200">
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
