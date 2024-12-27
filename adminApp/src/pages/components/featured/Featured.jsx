import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Featured = () => {
  return (
    <div className="flex-2 shadow-lg bg-blue-200 rounded p-2.5">
      <div className="flex items-center justify-between text-gray-500">
        <h1 className="text-base font-medium">Total Revenue</h1>
        <FontAwesomeIcon icon={faEllipsisVertical} className="text-sm" />
      </div>
      <div className="p-5 flex flex-col items-center justify-center gap-4">
        <div className="w-24 h-24">
          <CircularProgressbar value={70} text={"70%"} strokeWidth={5} />
        </div>
        <p className="font-medium text-gray-500">Total sales made today</p>
        <p className="text-3xl">$420</p>
        <p className="font-light text-sm text-gray-500 text-center">
          Previous transactions processing. Last payments may not be included.
        </p>
        <div className="w-full flex items-center justify-between">
          <div className="text-center">
            <div className="text-sm text-gray-500">Target</div>
            <div className="flex items-center mt-2.5 text-sm text-red-500">
              <FontAwesomeIcon icon={faCaretDown} className="text-sm" />
              <div className="ml-1">$12.4k</div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Last Week</div>
            <div className="flex items-center mt-2.5 text-sm text-green-500">
              <FontAwesomeIcon icon={faCaretUp} className="text-sm" />
              <div className="ml-1">$12.4k</div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Last Month</div>
            <div className="flex items-center mt-2.5 text-sm text-green-500">
              <FontAwesomeIcon icon={faCaretUp} className="text-sm" />
              <div className="ml-1">$12.4k</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
