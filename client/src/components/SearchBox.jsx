import React, { useState } from "react";

const SearchBox = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Call a function to fetch location suggestions based on the input value
    fetchLocationSuggestions(value);
  };

  const fetchLocationSuggestions = (query) => {
    fetch(
      `https://geocode.search.hereapi.com/v1/geocode?q=${query}&apiKey=${import.meta.env.VITE_API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        // Extract suggestions from response and update state
        const suggestions = data.items.map((item) => item.title);
        setSuggestions(suggestions);
      })
      .catch((error) =>
        console.error("Error fetching location suggestions:", error)
      );
  };

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
  };

  return (
    <div className="flex justify-center w-full text-2xl relative">
      <div className="absolute top-16 bg-white rounded-lg w-9/12 p-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search for restaurants"
          value={searchTerm}
          onChange={handleInputChange}
          className="w-full"
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {suggestions.length > 0 && (
        <ul className="absolute top-36 bg-white rounded-lg w-9/12 p-2 shadow-md">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="cursor-pointer hover:bg-gray-200 p-2"
              onClick={() => setSearchTerm(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;
