import { useState } from 'react';
// import Map, { Marker } from 'react-map-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';

export function MapView({ latitude, longitude }) {
  const [viewState, setViewState] = useState({
    latitude,
    longitude,
    zoom: 12
  });

  return (
    <div className="h-[400px] rounded-xl overflow-hidden">
      {/* <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken="YOUR_MAPBOX_TOKEN"
      >
        <Marker latitude={latitude} longitude={longitude} anchor="center">
          <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-white border-4 border-white">
            ★
          </div>
        </Marker>
      </Map> */}
    </div>
  );
}
