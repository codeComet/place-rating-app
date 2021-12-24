import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import { FaMapMarkerAlt } from "react-icons/fa";

function App() {
  const [lat, setLat] = useState(48.8584);
  const [lng, setLng] = useState(2.2945);
  const [viewport, setViewport] = useState({
    width: "90vw",
    height: "90vh",
    latitude: lat,
    longitude: lng,
    zoom: 4,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        await setLat(position.coords.latitude);
        await setLng(position.coords.longitude);
      },
      (err) => console.log(err)
    );
  }, []);
  console.log(lat);
  console.log(lng);
  return (
    <div className="App">
      <ReactMapGL
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        {...viewport}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        mapStyle={process.env.REACT_APP_MAP_STYLE}
      >
        <Marker latitude={lat} longitude={lng} offsetLeft={-20} offsetTop={-10}>
          <FaMapMarkerAlt style={{ fontSize: "2.5rem", color: "#ff0984" }} />
        </Marker>
      </ReactMapGL>
    </div>
  );
}

export default App;
