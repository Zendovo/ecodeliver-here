import React, { useEffect, useRef } from "react";
import H from "@here/maps-api-for-javascript";

const MapComponent = () => {
  const mapRef = useRef(null);
  const map = useRef(null);
  const platform = useRef(null);

  useEffect(() => {
    // Check if the map object has already been created
    if (!map.current) {
      // Create a platform object
      platform.current = new H.service.Platform({
        apikey: "0EvGHy5pYqRinr-hVz8PccR7NJALTnq4HBs2Nf2gyg4",
      });

      // Get user's location using Geolocation API
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Create a new Raster Tile service instance
          const rasterTileService = platform.current.getRasterTileService({
            queryParams: {
              style: "explore.day",
              size: 512,
            },
          });

          // Creates a new instance of the H.service.rasterTile.Provider class
          // The class provides raster tiles for a given tile layer ID and pixel format
          const rasterTileProvider = new H.service.rasterTile.Provider(
            rasterTileService
          );

          // Create a new Tile layer with the Raster Tile provider
          const rasterTileLayer = new H.map.layer.TileLayer(rasterTileProvider);

          // Create a new map instance with the Tile layer and user's location
          const newMap = new H.Map(mapRef.current, rasterTileLayer, {
            pixelRatio: window.devicePixelRatio,
            center: { lat: latitude, lng: longitude }, // Center map at user's location
            zoom: 14,
          });

          // Add panning and zooming behavior to the map
          const behavior = new H.mapevents.Behavior(
            new H.mapevents.MapEvents(newMap)
          );

          // Set the map object to the reference
          map.current = newMap;
        },
        (error) => {
          console.error("Error getting user's location:", error);
        }
      );
    }
  }, []);

  // Return a div element to hold the map
  return <div style={{ width: "100%", height: "100vh" }} ref={mapRef} />;
};

export default MapComponent;
