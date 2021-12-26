import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import styled from "styled-components";
import { FaMapMarkerAlt } from "react-icons/fa";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import axios from "axios";
import { format } from "timeago.js";
import "./app.css";

const Title = styled.h3`
  margin-bottom: 0.5rem;
`;
const Description = styled.p`
  font-size: 15px;
  margin-bottom: 0.6rem;
`;
const User = styled.p`
  font-size: 12px;
`;
const Time = styled.p`
  font-size: 12px;
`;
const Rating = styled.div``;
const Container = styled.div`
  padding: 5px 3px;
`;

function App() {
  const currentUser = "smith";
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [pins, setPins] = useState([]);
  const [placeId, setPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);

  const [viewport, setViewport] = useState({
    width: "95vw",
    height: "95vh",
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
        await setLat(position.coords.latitude);
        await setLng(position.coords.longitude);
      },
      (err) => console.log(err)
    );
  }, []);

  const handlePinClick = (id) => {
    setPlaceId(id);
  };

  const handleAddPlace = (e) => {
    const [long, lat] = e.lnglat;
    console.log(long, lat);
    // setNewPlace({
    //   long,
    //   lat,
    // });
  };

  return (
    <div className="App">
      <ReactMapGL
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        {...viewport}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        mapStyle={process.env.REACT_APP_MAP_STYLE}
        onDblClick={handleAddPlace}
      >
        {pins.map((pin, idx) => (
          <div key={idx}>
            <Marker
              latitude={pin.lat}
              longitude={pin.long}
              offsetLeft={-20}
              offsetTop={-10}
              onClick={() => handlePinClick(pin._id)}
            >
              <FaMapMarkerAlt
                style={{
                  fontSize: "2.5rem",
                  color: pin.username === currentUser ? "#ff0984" : "#4f56a5",
                  cursor: "pointer",
                }}
              />
            </Marker>
            {pin._id === placeId && (
              <Popup
                latitude={pin.lat}
                longitude={pin.long}
                closeButton={true}
                closeOnClick={true}
                anchor="left"
                onClose={() => setPlaceId(null)}
              >
                <Container>
                  <Title>{pin.title}</Title>
                  <Description>{pin.description}</Description>
                  <Rating>
                    {new Array(pin.rating).fill(null).map(() => (
                      <AiFillStar />
                    ))}
                    {new Array(5 - pin.rating).fill(null).map(() => (
                      <AiOutlineStar />
                    ))}
                  </Rating>
                  <User>
                    by <b>{pin.username}</b>{" "}
                  </User>
                  <Time>{format(pin.createdAt)}</Time>
                </Container>
              </Popup>
            )}
          </div>
        ))}

        {/* {newPlace && (
          <Popup
            latitude={newPlace.lat}
            longitude={newPlace.long}
            closeButton={true}
            closeOnClick={true}
            anchor="left"
            onClose={() => setNewPlace(null)}
          >
            new place
          </Popup>
        )} */}
      </ReactMapGL>
    </div>
  );
}

export default App;
