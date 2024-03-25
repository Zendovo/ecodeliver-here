import React, { useState } from "react";

const SearchBox = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);

  async function searchLocation(source) {
    try {
      const res = await fetch(import.meta.env.VITE_SEARCH_API + `=${source}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer `,
        },
      });

      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  }

  const handleSourceChange = (event) => {
    const value = event.target.value;
    setSource(value);
  
    // Call a function to fetch location suggestions based on the input value
    // fetchLocationSuggestions(value, 0);
  };
  
  const handleDestChange = (event) => {
    const value = event.target.value;
    setDestination(value);
  
    // fetchLocationSuggestions(value, 1);
  };
  
  const fetchLocationSuggestions = (query, index) => {
    fetch(
      `https://geocode.search.hereapi.com/v1/geocode?q=${query}&apiKey=${import.meta.env.VITE_API_KEY}`
    )
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      // Extract suggestions from response and update state
      const suggestions = data.items.map((item) => item.title);
      if (index === 0) {
        setSourceSuggestions(suggestions);
      } else {
        setDestSuggestions(suggestions);
      }
    })
    .catch((error) => {
      console.error("Error fetching location suggestions:", error);
    });
  };
  

  const handleSearch = () => {
    console.log("Searching for:", source);
    searchLocation(source);
  };

  return (
    <div className="flex justify-center w-full text-2xl relative">
      <div className="absolute top-16 w-9/12 flex flex-col items-center">
        <input
          type="text"
          placeholder="Search for restaurants"
          value={source}
          onChange={handleSourceChange}
          className="w-full bg-white p-4 shadow-md rounded-lg relative "
        />
        <img
          src="/assets/arrow.svg"
          height={50}
          width={50}
          alt=""
          className="relative z-10 mt-[-.75rem]"
        />
        <input
          type="text"
          placeholder="Enter delivery address"
          value={destination}
          onChange={handleDestChange}
          className="w-full bg-white p-4 shadow-md rounded-lg mt-[-1.5rem] relative"
        />
        <button
          onClick={handleSearch}
          className="mt-4 bg-black hover:bg-gray-600 px-4 py-2 text-white uppercase rounded text-lg tracking-wider"
        >
          Search
        </button>
      </div>
      {/* {sourceSuggestions.length > 0 && (
        <ul className="absolute top-36 bg-white rounded-lg w-9/12 p-2 shadow-md">
          {sourceSuggestions.map((suggestion, index) => (
            <li
              key={index}
              className="cursor-pointer hover:bg-gray-200 p-2"
              onClick={() => setSource(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
      {destSuggestions.length > 0 && (
        <ul className="absolute top-80 bg-white rounded-lg w-9/12 p-2 shadow-md">
          {destSuggestions.map((suggestion, index) => (
            <li
              key={index}
              className="cursor-pointer hover:bg-gray-200 p-2"
              onClick={() => setSource(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )} */}
    </div>
  );
};

export default SearchBox;
