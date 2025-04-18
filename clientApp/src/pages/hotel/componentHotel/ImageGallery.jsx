import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { CgMenuGridR } from "react-icons/cg";
import { useTranslation } from 'react-i18next';

export function ImageGallery({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(null);

  const { t } = useTranslation();


  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile(); // Initial check
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter images by selected type
  const filteredImages = selectedType
    ? images.filter(img => img.type === selectedType)
    : images;

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (showModal) {
        if (event.key === 'ArrowLeft') {
          previousImage();
        } else if (event.key === 'ArrowRight') {
          nextImage();
        } else if (event.key === 'Escape') {
          setShowModal(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showModal]);

  // Simple navigation functions
  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const previousImage = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  // Touch gesture handling
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;

    const touchEnd = e.touches[0].clientX;
    const diff = touchStart - touchEnd;

    // Swipe threshold - require at least 50px movement
    if (Math.abs(diff) < 50) return;

    if (diff > 0) {
      // Left swipe = next image
      nextImage();
    } else {
      // Right swipe = previous image
      previousImage();
    }

    // Reset touch start to prevent multiple triggers
    setTouchStart(null);
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  // Reset current index when filtered images change
  useEffect(() => {
    if (currentIndex >= filteredImages.length && filteredImages.length > 0) {
      setCurrentIndex(0);
    }
  }, [filteredImages, currentIndex]);

  return (
    <div className="w-full" dir='ltr'>
      {/* Mobile view */}
      {isMobile && (
        <div
          className="relative w-full h-72 overflow-hidden shadow-xl rounded-xl"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Counter */}
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded z-10 text-sm">
            {currentIndex + 1} / {filteredImages.length}
          </div>

        

          {/* Simple slide image */}
          <div className="w-full h-full overflow-hidden">
            <div
              className="w-full h-full flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {filteredImages.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={`Property ${index + 1}`}
                  className="w-full h-full object-cover flex-shrink-0"
                />
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="absolute inset-x-0 bottom-2 flex justify-between px-2 z-10">
            <button
              className="bg-black bg-opacity-50 text-white p-2 rounded-full transition-transform active:scale-95"
              onClick={previousImage}
              disabled={filteredImages.length <= 1}
            >
              <ChevronLeft size={20} />
            </button>

            <button
              className="bg-black bg-opacity-50 text-white p-2 rounded-full transition-transform active:scale-95"
              onClick={nextImage}
              disabled={filteredImages.length <= 1}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Desktop view */}
      {!isMobile && (
        <>
          <div className="relative grid grid-cols-4 gap-2 rounded-xl overflow-hidden h-[54vh]">
            {/* Main large image */}
            <div className="col-span-2 row-span-2 relative overflow-hidden group">
              <img
                src={images[0]?.url}
                alt="Main property"
                className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
                onClick={() => {
                  setCurrentIndex(0);
                  setShowModal(true);
                }}
              />
              
            </div>

            {/* Small image grid */}
            {images?.slice(1, 4).map((image, index) => (
              <div key={index} className="relative overflow-hidden group">
                <img
                  src={image?.url}
                  alt={`Property ${index + 2}`}
                  className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
                  onClick={() => {
                    setCurrentIndex(index + 1);
                    setShowModal(true);
                  }}
                />
                
              </div>
            ))}

            {filteredImages.length > 0 && (
              <div className="absolute bottom-0 right-0 h-[47.5%] w-[24.5%] rounded-b-r-lg overflow-hidden z-10 ">
                {/* Background collage */}
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[1px] z-[-1]">
                  {filteredImages.slice(0, 6).map((img, idx) => (
                    <img
                      key={idx}
                      src={img.url}
                      alt={`bg-${idx}`}
                      className="w-full h-full object-cover"
                    />
                  ))}
                </div>

                {/* Button overlay */}
                <button
                  className="relative flex items-center justify-center gap-2 h-full w-full px-3 py-2 bg-black/50 text-white rounded-lg text-sm font-semibold hover:scale-105 transition-all duration-200 hover:shadow-md"
                  onClick={() => {
                    setShowModal(true);
                  }}
                >
                  <CgMenuGridR className="w-16 h-16 " />
                  <span className='text-blue bg-black p-4 rounded'>{t('singleProperty.viewAll')}</span>
                </button>
              </div>
            )}

          </div>

          {/* Fullscreen modal for desktop */}
          {showModal && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center overflow-auto p-4">

              {/* Close button */}
              <button
                className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-transform active:scale-95 z-50"
                onClick={() => setShowModal(false)}
              >
                <X size={28} />
              </button>

             

              {/* Navigation arrows */}
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full transition-transform active:scale-95 z-50"
                onClick={previousImage}
                disabled={filteredImages.length <= 1}
              >
                <ChevronLeft size={32} />
              </button>

              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full transition-transform active:scale-95 z-50"
                onClick={nextImage}
                disabled={filteredImages.length <= 1}
              >
                <ChevronRight size={32} />
              </button>

              {/* Image container */}
              <div className="w-full h-[80vh] flex items-center justify-center overflow-hidden">
                <div
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {filteredImages.map((image, index) => (
                    <div key={index} className="w-full flex-shrink-0 flex justify-center items-center px-4">
                      <img
                        src={image.url}
                        alt={`Property ${index + 1}`}
                        className="max-h-[80vh] max-w-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </>
      )}
    </div>
  );
}