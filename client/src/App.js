import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";

function App() {
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [pins, setPins] = useState([]);

  // const API = axios.create({
  //   baseURL: "http://localhost:5000",
  // });

  const [viewport, setViewport] = useState({
    width: "90vw",
    height: "90vh",
    latitude: lat,
    longitude: lng,
    zoom: 4,
  });

  useEffect(() => {
    let isMounted = true;
    const getPins = async () => {
      try {
        const { data } = await axios.get("/pins");
        setPins(data);
        console.log(pins);
      } catch (error) {
        console.log(error);
      }
    };
    getPins();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        console.log(position.coords.latitude);
        console.log(position.coords.longitude);
        await setLat(position.coords.latitude);
        await setLng(position.coords.longitude);
      },
      (err) => console.log(err)
    );
  }, []);

  return (
    <div className="App">
      <ReactMapGL
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        {...viewport}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        mapStyle={process.env.REACT_APP_MAP_STYLE}
      >
        {pins.map((pin, idx) => (
          <div key={idx}>
            <Marker
              latitude={pin.lat}
              longitude={pin.long}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <FaMapMarkerAlt
                style={{ fontSize: "2.5rem", color: "#ff0984" }}
              />
            </Marker>
            {/* <Popup
              latitude={pin.lat}
              longitude={pin.long}
              closeButton={true}
              closeOnClick={false}
              anchor="left"
            >
              <div>You are here</div>
            </Popup> */}
          </div>
        ))}
      </ReactMapGL>
    </div>
  );
}

export default App;
