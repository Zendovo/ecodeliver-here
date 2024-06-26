import React, { useContext, useEffect, useRef, useState } from "react";
import H from "@here/maps-api-for-javascript";
import GlobalContext from "../context/GlobalContext";

const MapComponent = (props) => {
  const mapRef = useRef(null);
  const map = useRef(null);
  const platform = useRef(null);
  const { restaurantPosition } = props;
  const { polyline, destCoords, sourceCoords } = useContext(GlobalContext);

  useEffect(() => {
    // Check if the map object has already been created
    if (!map.current) {
      // Create a platform object
      platform.current = new H.service.Platform({
        apikey: import.meta.env.VITE_API_KEY,
      });

      // Get user's location using Geolocation API
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Create a new Raster Tile service instance
          const rasterTileService = platform.current.getRasterTileService({
            queryParams: {
              style: "explore.day",
              size: 64,
              lang: "en",
            },
          });

          // Creates a new instance of the H.service.rasterTile.Provider class
          // The class provides raster tiles for a given tile layer ID and pixel format
          const rasterTileProvider = new H.service.rasterTile.Provider(
            rasterTileService
          );
          const marker = new H.map.Marker({ lat: latitude, lng: longitude });

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
          if (polyline) {
            var polylineString = polyline;

            // convert Flexible Polyline encoded string to geometry
            const lineStrings = [];
            lineStrings.push(
              H.geo.LineString.fromFlexiblePolyline(polylineString)
            );
            const multiLineString = new H.geo.MultiLineString(lineStrings);
            const bounds = multiLineString.getBoundingBox();

            // Create the polyline for the route
            const routePolyline = new H.map.Polyline(multiLineString, {
              style: {
                lineWidth: 4,
                strokeColor: "rgba(0, 128, 255, 0.7)",
              },
            });
            map.current.addObject(routePolyline);
            newMap.setCenter(destCoords);
          }
          // Set the map object to the reference
          map.current = newMap;
          map.current.addObject(marker);
        },
        (error) => {
          console.error("Error getting user's location:", error);
        }
      );
    }
  }, [restaurantPosition, platform, map]);

  useEffect(() => {
    if (polyline && map.current) {
      // Remove the old polyline if it exists
      if (map.current.getObjects().length > 0) {
        map.current.removeObjects(map.current.getObjects());
      }

      // Convert Flexible Polyline encoded string to geometry
      const lineStrings = [];
      lineStrings.push(H.geo.LineString.fromFlexiblePolyline(polyline));
      const multiLineString = new H.geo.MultiLineString(lineStrings);
      const bounds = multiLineString.getBoundingBox();

      // Create the polyline for the route
      const routePolyline = new H.map.Polyline(multiLineString, {
        style: {
          lineWidth: 4,
          strokeColor: "rgba(0, 128, 255, 0.7)",
        },
      });

      // Add the polyline to the map
      map.current.addObject(routePolyline);
      map.current.setCenter(destCoords);
      map.current.addObject(new H.map.Marker(destCoords));
      map.current.addObject(new H.map.Marker(sourceCoords));
    }
  }, [polyline, destCoords, map]);

  function getMarkerIcon(color) {
    const svgCircle = `<svg width="20" height="20" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <g id="marker">
                <circle cx="10" cy="10" r="7" fill="${color}" stroke="${color}" stroke-width="4" />
                </g></svg>`;
    return new H.map.Icon(svgCircle, {
      anchor: {
        x: 10,
        y: 10,
      },
    });
  }

  function calculateRoute(platform, map, start, destination) {
    function routeResponseHandler(response) {
      const sections = response.routes[0].sections;
      const lineStrings = [];
      sections.forEach((section) => {
        // convert Flexible Polyline encoded string to geometry
        lineStrings.push(
          H.geo.LineString.fromFlexiblePolyline(section.polyline)
        );
      });
      const multiLineString = new H.geo.MultiLineString(lineStrings);
      const bounds = multiLineString.getBoundingBox();

      // Create the polyline for the route
      const routePolyline = new H.map.Polyline(multiLineString, {
        style: {
          lineWidth: 5,
        },
      });

      // Remove all the previous map objects, if any
      map.removeObjects(map.getObjects());
      // Add the polyline to the map
      map.addObject(routePolyline);
      map.addObjects([
        // Add a marker for the user
        new H.map.Marker(start, {
          icon: getMarkerIcon("red"),
        }),
        // Add a marker for the selected restaurant
        new H.map.Marker(destination, {
          icon: getMarkerIcon("green"),
        }),
      ]);
    }

    // Get an instance of the H.service.RoutingService8 service
    const router = platform.getRoutingService(null, 8);

    // Define the routing service parameters
    const routingParams = {
      origin: `${start.lat},${start.lng}`,
      destination: `${destination.lat},${destination.lng}`,
      transportMode: "car",
      return: "polyline",
    };
    // Call the routing service with the defined parameters
    router.calculateRoute(routingParams, routeResponseHandler, console.error);
  }

  // Return a div element to hold the map
  return (
    <div
      style={{ width: "100%", height: "100%", overflow: "hidden" }}
      ref={mapRef}
      className=" absolute top-0"
    />
  );
};

export default MapComponent;
