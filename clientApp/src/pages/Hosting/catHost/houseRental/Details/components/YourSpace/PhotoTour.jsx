
import ImageGallery from '../../../../../ComponentHost/ImageGallery';
 
const PhotoTour = () => {

  return (
    <>
      {
        <div className="p-6 font-sans relative h-full">
          <h2 className="text-2xl font-bold mb-4">Generate Photos</h2>
          <ImageGallery />
        </div>
      }
    </>
  );
};

export default PhotoTour;




