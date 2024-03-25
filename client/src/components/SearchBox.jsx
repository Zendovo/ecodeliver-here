import React, { useState } from "react";

const SearchBox = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    // Implement your search logic here
    console.log("Searching for:", searchTerm);
  };

  return (
    <div className=" flex justify-center w-full text-2xl">
      <div className="absolute top-16 bg-white rounded-lg w-9/12 p-2 flex justify-between">
        <input
          type="text"
          placeholder="search for restaurants "
          value={searchTerm}
          onChange={handleInputChange}
          className=" w-full"
        />
        <button onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
};

export default SearchBox;
