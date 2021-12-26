import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import styled from "styled-components";
import { FaMapMarkerAlt } from "react-icons/fa";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import axios from "axios";
import { format } from "timeago.js";
import { Rating } from "react-simple-star-rating";
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

const Container = styled.div`
  padding: 5px 3px;
`;
const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
`;
const Button = styled.button`
  width: 100%;
  background-color: #00adf3;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 0.5rem;
  cursor: pointer;
`;

function App() {
  const currentUser = "smith";
  const [pins, setPins] = useState([]);
  const [placeId, setPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [userRating, setUserRating] = useState(0); // initial rating value

  const [viewport, setViewport] = useState({
    width: "95vw",
    height: "95vh",
    latitude: 46,
    longitude: 17,
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
        await setViewport({
          ...viewport,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (err) => console.log(err)
    );
  }, []);

  const handlePinClick = (id, lat, long) => {
    setPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };

  const handleAddPlace = (e) => {
    const [long, lat] = e.lngLat;
    setNewPlace({
      latitude: lat,
      longitude: long,
    });
  };

  const handleRating = (rate) => {
    setUserRating(rate / 20);
  };

  return (
    <div className="App">
      <ReactMapGL
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        {...viewport}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        mapStyle={process.env.REACT_APP_MAP_STYLE}
        onDblClick={handleAddPlace}
        transitionDuration={200}
      >
        {pins.map((pin, idx) => (
          <div key={idx}>
            <Marker
              latitude={pin.lat}
              longitude={pin.long}
              offsetLeft={-20}
              offsetTop={-10}
              onClick={() => handlePinClick(pin._id, pin.lat, pin.long)}
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
                  <div>
                    {new Array(pin.rating).fill(null).map((item, index) => (
                      <AiFillStar key={index} />
                    ))}
                    {new Array(5 - pin.rating).fill(null).map((item, index) => (
                      <AiOutlineStar key={index} />
                    ))}
                  </div>
                  <User>
                    by <b>{pin.username}</b>{" "}
                  </User>
                  <Time>{format(pin.createdAt)}</Time>
                </Container>
              </Popup>
            )}
          </div>
        ))}

        {newPlace && (
          <Popup
            latitude={newPlace.latitude}
            longitude={newPlace.longitude}
            closeButton={true}
            closeOnClick={false}
            anchor="left"
            onClose={() => setNewPlace(null)}
          >
            <Container>
              <form>
                <div className="form-group">
                  <Label>Title</Label>
                  <input placeholder="Name of the place" />
                </div>
                <div className="form-group">
                  <Label>Description</Label>
                  <textarea
                    cols="30"
                    rows="3"
                    placeholder="Tell us about the place"
                  ></textarea>
                </div>
                <div className="form-group">
                  <Label>Rating</Label>
                  <Rating
                    onClick={handleRating}
                    ratingValue={userRating}
                    size={30}
                  />
                </div>
                <Button type="submit">Add my pin</Button>
              </form>
            </Container>
          </Popup>
        )}
      </ReactMapGL>
    </div>
  );
}

export default App;
