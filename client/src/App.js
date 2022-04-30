import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import styled from "styled-components";
import { FaMapMarkerAlt } from "react-icons/fa";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import axios from "axios";
import { format } from "timeago.js";
import { Rating } from "react-simple-star-rating";
import "./app.css";
import MyNav from "./MyNav";

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
  position: relative;
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
  const storage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(storage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [placeId, setPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [formData, setFormData] = useState({
    username: currentUser,
    title: "",
    description: "",
    rating: 0,
    lat: 0,
    long: 0,
  });

  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 46,
    longitude: 17,
    zoom: 4,
  });

  useEffect(() => {
    let isMounted = true;
    const getPins = async () => {
      try {
        const { data } = await axios.get(
          "https://pin-map-app.herokuapp.com/pins"
        );
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

  useEffect(() => {
    if (currentUser) {
      console.log("user logged");
    }
  }, [currentUser]);

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
    setFormData({
      ...formData,
      lat: lat,
      long: long,
    });
  };

  const handleRating = (rate) => {
    setFormData({ ...formData, rating: rate / 20 });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      const res = await axios.post(
        "https://pin-map-app.herokuapp.com/pins",
        formData
      );
      setPins([...pins, res.data]);
      clear();
    } catch (error) {
      console.log(error);
    }
  };

  const clear = () => {
    setFormData({
      username: currentUser,
      title: "",
      description: "",
      rating: 0,
      lat: 0,
      long: 0,
    });
  };

  return (
    <div className="App">
      <MyNav
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        storage={storage}
      />
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
              offsetLeft={-viewport.zoom * 3.5}
              offsetTop={-viewport.zoom * 7}
              onClick={() => handlePinClick(pin._id, pin.lat, pin.long)}
            >
              <FaMapMarkerAlt
                style={{
                  fontSize: viewport.zoom * 7,
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

        {newPlace && currentUser && (
          <Popup
            latitude={newPlace.latitude}
            longitude={newPlace.longitude}
            closeButton={true}
            closeOnClick={false}
            anchor="left"
            onClose={() => setNewPlace(null)}
          >
            <Container>
              <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <Label>Title</Label>
                  <input
                    placeholder="Name of the place"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <Label>Description</Label>
                  <textarea
                    cols="30"
                    rows="3"
                    placeholder="Tell us about the place"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                  ></textarea>
                </div>
                <div className="form-group">
                  <Label>Rating</Label>
                  <Rating
                    onClick={handleRating}
                    size={30}
                    ratingValue={formData.rating}
                    showTooltip={true}
                    tooltipDefaultText="Hover and double click to rate"
                    tooltipStyle={{
                      fontSize: "10px",
                      position: "absolute",
                      bottom: "30%",
                      left: "19%",
                    }}
                    required
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
