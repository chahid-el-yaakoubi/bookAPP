import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

export const ImageGallery = ({ photos }) => {
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber;
    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? photos.length - 1 : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === photos.length - 1 ? 0 : slideNumber + 1;
    }
    setSlideNumber(newSlideNumber);
  };

  const handleKeyDown = (e) => {
    if (!open) return;

    e.preventDefault();

    switch (e.key) {
      case 'ArrowLeft':
        handleMove('l');
        break;
      case 'ArrowRight':
        handleMove('r');
        break;
      case 'Escape':
        setOpen(false);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, slideNumber]);

  return (
    <>
      {/* Grid Gallery */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {photos?.slice(0, 4).map((photo, i) => (
          <div
            key={i}
            className={`${i === 0 ? 'col-span-2 row-span-2' : ''} overflow-hidden rounded-lg cursor-pointer aspect-[4/3]`}
            onClick={() => handleOpen(i)}
          >
            <img
              src={photo}
              alt=""
              className="w-full h-full object-cover hover:scale-105 transition duration-300"
            />
          </div>
        ))}
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 bg-gray-500/80 z-50 flex flex-col items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full h-screen flex flex-col  ">
            {/* Close button and counter */}
            <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between z-50">
              <div className="text-white text-sm md:text-lg flex items-center gap-2 md:gap-4">
                <span>{slideNumber + 1} / {photos.length}</span>
                <div className="hidden md:flex text-gray-400 text-sm gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-gray-800 rounded">←</kbd>
                    Previous
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-gray-800 rounded">→</kbd>
                    Next
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-gray-800 rounded">Esc</kbd>
                    Close
                  </span>
                </div>
              </div>
              <FontAwesomeIcon
                icon={faCircleXmark}
                className="text-white text-2xl md:text-4xl cursor-pointer hover:text-gray-300 transition"
                onClick={() => setOpen(false)}
                aria-label="Close gallery"
              />
            </div>

            {/* Main image */}
            <div className="flex-1 flex items-center justify-center relative">
              <div className="relative px-4 md:px-[100px] w-full max-w-[1400px] mx-auto">
                <div className="relative w-full h-full flex justify-center items-center rounded-lg bg-gray-100">
                  <img
                    src={photos[slideNumber]}
                    alt={`Photo ${slideNumber + 1} of ${photos.length}`}
                    className="w-full md:w-full h-auto md:h-[700px] object-contain max-h-[70vh] md:max-h-[80vh] rounded-lg"
                  />
                </div>

                {/* Navigation buttons */}
                <button
                  className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-1 md:gap-2 cursor-pointer group"
                  onClick={() => handleMove("l")}
                  aria-label="Previous image"
                >
                  <FontAwesomeIcon
                    icon={faCircleArrowLeft}
                    className="text-white text-2xl md:text-4xl group-hover:text-gray-300 transition-all group-hover:scale-110"
                  />
                  <span className="hidden md:inline text-white text-base opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Previous
                  </span>
                </button>

                <button
                  className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1 md:gap-2 cursor-pointer group"
                  onClick={() => handleMove("r")}
                  aria-label="Next image"
                >
                  <span className="hidden md:inline text-white text-base opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Next
                  </span>
                  <FontAwesomeIcon
                    icon={faCircleArrowRight}
                    className="text-white text-2xl md:text-4xl group-hover:text-gray-300 transition-all group-hover:scale-110"
                  />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="h-20 md:h-32 bg-black bg-opacity-90 flex justify-center items-center">
              <div className="flex gap-2 md:gap-3 px-2 md:px-4 overflow-x-auto max-w-full">
                {photos.map((photo, i) => (
                  <div
                    key={i}
                    onClick={() => setSlideNumber(i)}
                    className={`
                      relative h-16 md:h-24 w-24 md:w-36 flex-shrink-0 cursor-pointer 
                      transition-all duration-300 
                      ${i === slideNumber ? 'border-2 border-white scale-105 md:scale-110' : 'opacity-50 hover:opacity-75'}
                    `}
                  >
                    <img
                      src={photo}
                      alt=""
                      className="h-full w-full object-cover "
                    />
                    {i === slideNumber && (
                      <div className="absolute inset-0 border-2 border-white"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 