import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, Grid3X3, ZoomIn } from 'lucide-react';

export function ImageGallery({ images = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mobile detection with debounce
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter images by selected type
  const filteredImages = selectedType
    ? images.filter(img => img.type === selectedType)
    : images;

  // Navigation functions with useCallback for performance
  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % filteredImages.length);
  }, [filteredImages.length]);

  const previousImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  }, [filteredImages.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!showModal) return;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          previousImage();
          break;
        case 'ArrowRight':
          event.preventDefault();
          nextImage();
          break;
        case 'Escape':
          event.preventDefault();
          setShowModal(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal, nextImage, previousImage]);

  // Enhanced touch gesture handling
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;

    const touchEnd = e.touches[0].clientX;
    const diff = touchStart - touchEnd;
    const threshold = 75; // Increased threshold for better UX

    if (Math.abs(diff) < threshold) return;

    if (diff > 0) {
      nextImage();
    } else {
      previousImage();
    }

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

  // Handle image loading
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = (e) => {
    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiAxNkM5Ljc5IDEwIDkuNzkgMTQgMTIgMTQgMTQuMjEgMTQgMTQuMjEgMTAgMTIgMTBaIiBmaWxsPSIjOUNBM0FGIi8+CjwvZXZnPgo=';
    setIsLoading(false);
  };

  const openModal = (index) => {
    setCurrentIndex(index);
    setShowModal(true);
    setIsLoading(true);
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-72 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500 text-lg">No images available</p>
      </div>
    );
  }

  return (
    <div className="w-full" dir="ltr">
      {/* Mobile View */}
      {isMobile && (
        <div className="relative w-full h-80 overflow-hidden shadow-lg rounded-lg bg-gray-900">
          {/* Image Counter */}
          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full z-20 text-sm font-medium">
            {currentIndex + 1} / {filteredImages.length}
          </div>

          {/* Main Image Slider */}
          <div
            className="w-full h-full overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="w-full h-full flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {filteredImages.map((image, index) => (
                <div key={index} className="w-full h-full flex-shrink-0 relative">
                  <img
                    src={image.url}
                    alt={image.alt || `Property image ${index + 1}`}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => openModal(index)}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                  {isLoading && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          {filteredImages.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200 hover:bg-black/70 active:scale-95 z-20"
                onClick={previousImage}
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200 hover:bg-black/70 active:scale-95 z-20"
                onClick={nextImage}
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>

              {/* Dot Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                {filteredImages.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentIndex
                      ? 'bg-white scale-125'
                      : 'bg-white/50 hover:bg-white/75'
                      }`}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Desktop View */}
      {!isMobile && (
        <>
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Premium Header Bar */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-slate-900/80 via-slate-800/70 to-slate-900/80 backdrop-blur-md z-20 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <h3 className="text-white font-semibold text-lg tracking-tight">Property Gallery</h3>
                </div>
                <div className="text-white/80 text-sm font-medium">
                  {images.length} {images.length === 1 ? 'Photo' : 'Photos'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-1 h-[70vh] pt-16">
              {/* Hero Image - Takes up 8 columns */}
              <div className="col-span-8 relative cursor-pointer overflow-hidden group bg-gradient-to-br from-gray-50 to-gray-100 "
                    onClick={() => openModal(0)}
                    >
                <div className="absolute inset-0 w-full h-full">
                  <img
                    src={images[0]?.url}
                    alt={images[0]?.alt || "Featured property image"}
                    className="w-full h-full max-h-[640px] object-cover cursor-pointer transition-all duration-700 group-hover:scale-110"
                    onClick={() => openModal(0)}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                </div>

                {/* Premium Overlay Effects */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500"></div>

                {/* Hover Controls */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">

                </div>

                {/* Image Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white font-medium text-lg">Featured Image</p>
                  <p className="text-white/80 text-sm">Click to view in full size</p>
                </div>
              </div>

              {/* Sidebar Grid - Takes up 4 columns */}
              <div className="col-span-4 grid grid-rows-4 gap-1">
                {images?.slice(1, 5).map((image, index) => (
                  <div
                    key={index} className="relative overflow-hidden cursor-pointer  group bg-gradient-to-br from-gray-50 to-gray-100 min-h-0"
                    onClick={() => openModal(index + 1)}
                  >
                    <img
                      src={image?.url}
                      alt={image?.alt || `Property image ${index + 2}`}
                      className="h-full object-cover cursor-pointer transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                      onClick={() => openModal(index + 1)}
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                    />

                    {/* Sophisticated Hover Effect */}
                    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-500/0 to-purple-600/0 group-hover:from-blue-500/20 group-hover:to-purple-600/20 transition-all duration-500"></div>

                    {/* Hover Icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg transform scale-50 group-hover:scale-100 transition-all duration-300">
                        <ZoomIn className="text-gray-700 w-4 h-4" />
                      </div>
                    </div>

                    {/* Image Number Badge */}
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
                      {index + 2}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium View All Button */}
            {images.length > 2 && (
              <div className="absolute bottom-6 right-6 z-30">
                <button
                  className="group relative overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-3 rounded-xl font-semibold shadow-2xl hover:shadow-slate-900/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                  onClick={() => openModal(0)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-3">
                    <Grid3X3 size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                    <span>View All {images.length} Photos</span>
                  </div>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></div>
                </button>
              </div>
            )}

            {/* Elegant Bottom Border */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
          </div>

          {/* Ultra-Professional Fullscreen Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 bg-black/98 backdrop-blur-lg">
              {/* Sophisticated Header */}
              <div className="absolute top-0 left-0 right-0 z-60 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
                <div className="flex justify-between items-center p-8">
                  <div className="flex items-center space-x-6">
                    <div className="text-white">
                      <h2 className="text-2xl font-bold tracking-tight">Property Gallery</h2>
                      <p className="text-white/70 text-sm font-medium mt-1">
                        Image {currentIndex + 1} of {filteredImages.length}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Image Counter Badge */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full">
                      <span className="text-white font-medium text-sm">
                        {currentIndex + 1} / {filteredImages.length}
                      </span>
                    </div>

                    {/* Close Button */}
                    <button
                      className="group bg-white/10 backdrop-blur-md border border-white/20 text-white p-3 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110"
                      onClick={() => setShowModal(false)}
                      aria-label="Close gallery"
                    >
                      <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Premium Navigation Arrows */}
              {filteredImages.length > 1 && (
                <>
                  <button
                    className="absolute left-8 top-1/2 -translate-y-1/2 group bg-white/10 backdrop-blur-md border border-white/20 text-white p-4 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110 z-60"
                    onClick={previousImage}
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform duration-300" />
                  </button>

                  <button
                    className="absolute right-8 top-1/2 -translate-y-1/2 group bg-white/10 backdrop-blur-md border border-white/20 text-white p-4 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110 z-60"
                    onClick={nextImage}
                    aria-label="Next image"
                  >
                    <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </>
              )}

              {/* Main Image Display */}
              <div className="w-full h-full flex items-center justify-center p-8 pt-24 pb-20">
                <div className="relative w-full h-full max-w-7xl">
                  <div
                    className="flex transition-transform duration-700 ease-out h-full"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                  >
                    {filteredImages.map((image, index) => (
                      <div key={index} className="w-full flex-shrink-0 flex justify-center items-center px-4">
                        <div className="relative group">
                          <img
                            src={image.url}
                            alt={image.alt || `Property image ${index + 1}`}
                            className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl ring-1 ring-white/10"
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                          />

                          {/* Loading Overlay */}
                          {isLoading && (
                            <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                              <div className="flex flex-col items-center space-y-4">
                                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <p className="text-white/80 text-sm">Loading image...</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Elegant Bottom Navigation */}
              <div className="absolute bottom-0 left-0 right-0 z-60 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex justify-center items-center p-8">
                  {filteredImages.length > 1 && (
                    <div className="flex items-center space-x-6">
                      {/* Thumbnail Strip */}
                      <div className="flex space-x-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-3">
                        {filteredImages.slice(Math.max(0, currentIndex - 2), currentIndex + 3).map((image, index) => {
                          const actualIndex = Math.max(0, currentIndex - 2) + index;
                          return (
                            <button
                              key={actualIndex}
                              className={`relative w-12 h-12 rounded-full overflow-hidden transition-all duration-300 border-2 ${actualIndex === currentIndex
                                ? 'border-white scale-110 shadow-lg'
                                : 'border-white/30 hover:border-white/60 hover:scale-105'
                                }`}
                              onClick={() => setCurrentIndex(actualIndex)}
                              aria-label={`Go to image ${actualIndex + 1}`}
                            >
                              <img
                                src={image.url}
                                alt={`Thumbnail ${actualIndex + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          );
                        })}
                      </div>

                      {/* Progress Indicator */}
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2">
                        <div className="flex space-x-2">
                          {filteredImages.map((_, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                ? 'bg-white scale-125'
                                : 'bg-white/40'
                                }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Keyboard Shortcuts Info */}
              <div className="absolute bottom-4 left-8 text-white/60 text-xs">
                <p>Use ← → keys to navigate • ESC to close</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}