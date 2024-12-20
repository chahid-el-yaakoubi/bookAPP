import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faCircleArrowLeft, faCircleArrowRight } from "@fortawesome/free-solid-svg-icons";

export const HotelGallery = ({ photos }) => {
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);

  const handleOpen = (index) => {
    setSlideNumber(index);
    setOpen(true);
  };

  const handleMove = (direction) => {
    const newSlideNumber = direction === "l"
      ? slideNumber === 0 ? photos.length - 1 : slideNumber - 1
      : slideNumber === photos.length - 1 ? 0 : slideNumber + 1;
    setSlideNumber(newSlideNumber);
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        {photos.slice(0, 6).map((photo, index) => (
          <div
            key={index}
            className={`${
              index === 0 ? 'md:col-span-2 md:row-span-2' : ''
            } overflow-hidden rounded-lg cursor-pointer`}
            onClick={() => handleOpen(index)}
          >
            <img
              src={photo}
              alt=""
              className="w-full h-64 object-cover hover:scale-105 transition duration-300"
            />
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <div className="relative w-full max-w-4xl">
            <FontAwesomeIcon
              icon={faCircleXmark}
              className="absolute -top-10 right-0 text-white text-3xl cursor-pointer"
              onClick={() => setOpen(false)}
            />
            <FontAwesomeIcon
              icon={faCircleArrowLeft}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl cursor-pointer"
              onClick={() => handleMove("l")}
            />
            <FontAwesomeIcon
              icon={faCircleArrowRight}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl cursor-pointer"
              onClick={() => handleMove("r")}
            />
            <img
              src={photos[slideNumber]}
              alt=""
              className="w-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}; 