import React, {useState} from "react";
import MapComponent from "../components/Map";
import SearchBox from "../components/SearchBox";

const Canvas = () => {
  const [restaurantPosition, setRestaurantPosition] = useState({
    lat: 26.9124,
    lng: 75.7873,
  });

  return (
    <div className=" w-screen h-screen relative">
      <MapComponent restaurantPosition={restaurantPosition} />
      <SearchBox />
    </div>
  );
};

export default Canvas;
