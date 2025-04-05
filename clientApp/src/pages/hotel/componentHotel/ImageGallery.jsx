import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { CgMenuGridR } from "react-icons/cg";

export function ImageGallery({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [animating, setAnimating] = useState(false);
  const imageContainerRef = useRef(null);
  
  // Détection du mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile(); // Vérification initiale
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Filter images by selected type
  const filteredImages = selectedType 
    ? images.filter(img => img.type === selectedType) 
    : images;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (showModal && !animating) {
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
  }, [showModal, filteredImages, animating]);
  
  const nextImage = () => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredImages.length);
      setTimeout(() => {
        setAnimating(false);
      }, 300);
    }, 300);
  };

  const previousImage = () => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
      setTimeout(() => {
        setAnimating(false);
      }, 300);
    }, 300);
  };

  // Gestion du défilement tactile
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!touchStart || animating) return;
    
    const touchEnd = e.touches[0].clientX;
    const diff = touchStart - touchEnd;
    
    // Défilement horizontal pour mobile - un défilement vers la gauche = image suivante
    if (diff > 50) {
      nextImage();
      setTouchStart(null);
    } else if (diff < -50) {
      previousImage();
      setTouchStart(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  // Count images by type
  const typeCount = {};
  images.forEach(img => {
    if (img.type) {
      typeCount[img.type] = (typeCount[img.type] || 0) + 1;
    }
  });

  // Get unique types
  const uniqueTypes = Array.from(new Set(images.map(img => img.type))).filter(Boolean);

  // Handle type selection
  const handleTypeClick = (type) => {
    setSelectedType(type);
    setCurrentIndex(0);
  };
  
  // Reset current index when filtered images change
  useEffect(() => {
    if (currentIndex >= filteredImages.length) {
      setCurrentIndex(0);
    }
  }, [filteredImages, currentIndex]);

  // Gallery grid configuration based on device
  const gridClassName = isMobile 
    ? "relative grid grid-cols-2 gap-1 rounded-xl overflow-hidden bg h-[40vh]"
    : "relative grid grid-cols-4 gap-2 rounded-xl overflow-hidden bg h-[54vh]";

  // Types buttons row style for mobile
  const typesContainerStyle = isMobile
    ? "overflow-x-auto flex space-x-2 py-2 px-1 w-full"
    : "flex space-x-2";

  return (
    <>
      {/* Type selector visible by default on mobile */}
      {
        isMobile && (
          <div className='flex gap-2'>
            <button
          className={`px-3 py-1 text-sm whitespace-nowrap rounded-md transition-all duration-200 ${selectedType === null ? 'bg-blue text-white' : 'bg-gray-200'}`}
          onClick={() => {
            setSelectedType(null);
            setCurrentIndex(0);
          }}
        >
          All ({images.length})
        </button>
          <div className={typesContainerStyle}>
            {uniqueTypes.map((type) => (
              <button
                key={type}
            className={`p-2 rounded-full transition-colors duration-200 min-w-24 focus:outline-none ${selectedType === type ? 'bg-blue text-white' : 'bg-gray-200'}`}
                onClick={() => handleTypeClick(type)}
              >
                {type} ({typeCount[type]})
              </button>
            ))}
          </div>
          </div>
        )
      }

{/* <div className={typesContainerStyle}>
        <button
          className={`px-3 py-1 text-sm whitespace-nowrap rounded-md transition-all duration-200 ${selectedType === null ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => {
            setSelectedType(null);
            setCurrentIndex(0);
          }}
        >
          All ({images.length})
        </button>
        {uniqueTypes.map((type, index) => (
          <button
            key={index}
            className={`px-3 py-1 text-sm whitespace-nowrap rounded-md transition-all duration-200 ${selectedType === type ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => handleTypeClick(type)}
          >
            {type} ({typeCount[type]})
          </button>
        ))}
      </div> */}



      {/* Version mobile : affichage direct sans modal */}
      {isMobile && (
        <div 
          className="absolute left-0 right-0  w-full h-72 overflow-hidden mt-2 shadow-xl "
          ref={imageContainerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded z-10 text-sm">
            {currentIndex + 1} / {filteredImages.length}
          </div>
          {filteredImages[currentIndex]?.type && (
            <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded z-10 text-sm">
              {filteredImages[currentIndex].type}
            </div>
          )}
          
          {/* Image container without animation */}
          <div className={`w-full h-full relative`}>
            <img
              src={filteredImages[currentIndex]?.url}
              alt={`Property ${currentIndex + 1}`}
              className={`w-full h-full object-cover`}
            />
          </div>

          <div className="absolute inset-x-0 bottom-2 flex justify-between px-2">
            <button 
              className="bg-black bg-opacity-50 text-white p-2 rounded-full transition-transform duration-200 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:scale-100"
              onClick={previousImage}
              disabled={animating}
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              className="bg-black bg-opacity-50 text-white p-2 rounded-full transition-transform duration-200 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:scale-100"
              onClick={nextImage}
              disabled={animating}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Version desktop : grille avec modal */}
      {!isMobile && (
        <>
          <div className={gridClassName}>
            <div className="col-span-2 row-span-2 relative overflow-hidden group bg">
              <img
                src={images[0]?.url}
                alt="Main property"
                className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
                onClick={() => {
                  setSelectedType(null);
                  setCurrentIndex(0);
                  setShowModal(true);
                }}
              />
              {images[0]?.type && (
                <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded">
                  {images[0].type}
                </div>
              )}
            </div>
            {images?.slice(1, 5).map((image, index) => (
              <div key={index} className="relative overflow-hidden group">
                <img
                  src={image?.url}
                  alt={`Property ${index + 2}`}
                  className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
                  onClick={() => {
                    setSelectedType(null);
                    setCurrentIndex(index + 1);
                    setShowModal(true);
                  }}
                />
                {image?.type && (
                  <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded">
                    {image.type}
                  </div>
                )}
              </div>
            ))}
            <button
              className="absolute  flex items-center justify-normal gap-2 bottom-4 right-4 px-2 py-2 bg-blue/90 rounded-lg text-sm font-semibold hover:bg-blue/80 hover:scale-105 transition-all duration-200 hover:shadow-md"
              onClick={() => {
                setSelectedType(null);
                setShowModal(true);
              }}
            >
              <CgMenuGridR className='w-6 h-6' />
              
              <span>Show all photos</span>
            </button>
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center transition-opacity duration-300">
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <button
                  className={`px-3 py-1 text-white rounded-md transition-all duration-200 ${selectedType === null ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                  onClick={() => {
                    setSelectedType(null);
                    setCurrentIndex(0);
                  }}
                >
                  All ({images.length})
                </button>
                {uniqueTypes.map((type, index) => (
                  <button
                    key={index}
                    className={`px-3 py-1 text-white rounded-md transition-all duration-200 ${selectedType === type ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                    onClick={() => handleTypeClick(type)}
                  >
                    {type} ({typeCount[type]})
                  </button>
                ))}
              </div>
              
              <button
                className="absolute top-4 left-4 text-white p-2 hover:bg-white/10 rounded-full transition-transform duration-200 hover:scale-110 active:scale-95"
                onClick={() => setShowModal(false)}
              >
                <X size={24} />
              </button>
              
              <div className="absolute top-6 left-40 bg-black bg-opacity-70 text-white px-3 py-1 rounded-md">
                {filteredImages[currentIndex]?.type || 'All'} - {currentIndex + 1}/{filteredImages.length}
              </div>
              
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full transition-transform duration-200 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:scale-100"
                onClick={previousImage}
                disabled={filteredImages.length <= 1 || animating}
              >
                <ChevronLeft size={24} />
              </button>
              
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full transition-transform duration-200 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:scale-100"
                onClick={nextImage}
                disabled={filteredImages.length <= 1 || animating}
              >
                <ChevronRight size={24} />
              </button>
              
              <div className="relative w-full flex justify-center items-center h-[80vh]">
                <div className={`max-h-[80vh] max-w-[90vw] object-contain`}>
                  <img
                    src={filteredImages[currentIndex]?.url}
                    alt={`Property ${currentIndex + 1}`}
                    className={`max-h-[80vh] max-w-[90vw] object-contain`}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}