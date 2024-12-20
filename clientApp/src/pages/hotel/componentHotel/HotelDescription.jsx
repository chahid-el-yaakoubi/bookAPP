export const HotelDescription = ({ hotel }) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold mb-4">About this property</h2>
      <p className="text-gray-600 leading-relaxed">
        {hotel?.desc}
      </p>
      <div className="mt-4 space-y-2">
        <h3 className="font-semibold">Property highlights</h3>
        <ul className="list-disc list-inside text-gray-600">
          <li>Perfect for {hotel?.stayDuration || '1-7'} night stays</li>
          <li>Located in the heart of {hotel?.city}</li>
          <li>Highly rated by recent guests ({hotel?.rating}/10)</li>
          <li>Popular with {hotel?.popularWith || 'families'}</li>
        </ul>
      </div>
    </div>
  );
}; 