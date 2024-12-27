import Sidebar from "../../components/sideBar/SideBar";
import Navbar from "../../components/navBar/NavBar";
import Chart from "../../components/chart/Chart";
// import List from "../../components/table/Table";

const Single = () => {
  return (
    <div className="w-full">
      <div className="flex gap-5 p-5">
          {/* Left Side */}
          <div className="flex-1 relative p-5 shadow-lg rounded bg-white">
            <div className="absolute  top-0 right-0 p-1.5 text-sm text-purple-600 bg-purple-100 cursor-pointer rounded-bl">
              Edit
            </div>
            <h1 className="text-base text-gray-500 mb-5">Information</h1>
            <div className="flex gap-5">
              <img
                src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
                alt=""
                className="w-24 h-24 rounded-full object-cover"
              />
              <div className="details">
                <h1 className="text-gray-600 mb-2.5">Jane Doe</h1>
                <div className="mb-2.5 text-sm">
                  <span className="font-bold text-gray-500 mr-1">Email:</span>
                  <span className="font-light">janedoe@gmail.com</span>
                </div>
                <div className="mb-2.5 text-sm">
                  <span className="font-bold text-gray-500 mr-1">Phone:</span>
                  <span className="font-light">+1 2345 67 89</span>
                </div>
                <div className="mb-2.5 text-sm">
                  <span className="font-bold text-gray-500 mr-1">Address:</span>
                  <span className="font-light">
                    Elton St. 234 Garden Yd. NewYork
                  </span>
                </div>
                <div className="mb-2.5 text-sm">
                  <span className="font-bold text-gray-500 mr-1">Country:</span>
                  <span className="font-light">USA</span>
                </div>
              </div>
            </div>
          </div>
          {/* Right Side */}
          <div className="flex-[2]">
            <Chart aspect={3 / 1} title="User Spending ( Last 6 Months)" />
          </div>
        </div>
    </div>
  );
};

export default Single;
