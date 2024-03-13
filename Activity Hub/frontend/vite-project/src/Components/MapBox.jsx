import React, { useState, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiZGl2aW5lZmFsZXllIiwiYSI6ImNsdG9zajYxbDBpejAya3J5eHZ6aDNwMHEifQ.HOVsmfrlboFr53UUeFKncA";

function MapBox() {
  const [viewport, setViewport] = useState({
    latitude: 42.35,
    longitude: -70.9,
    zoom: 9,
  });
  const mapContainerRef = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12", // Choose your map style
      center: [viewport.longitude, viewport.latitude],
      zoom: viewport.zoom,
      accessToken: MAPBOX_ACCESS_TOKEN,
    });

    map.on("move", () => {
      const newViewport = { ...viewport }; // Create a copy of viewport
      newViewport.longitude = map.getCenter().lng.toFixed(4);
      newViewport.latitude = map.getCenter().lat.toFixed(4);
      newViewport.zoom = map.getZoom().toFixed(2);
      setViewport(newViewport);
    });

    // Add cleanup function to remove map instance on unmount
    return () => map.remove();
  }, []); // Empty dependency array

  return (
    <div>
      <div className="sidebar">
        Longitude: {viewport.longitude} | Latitude: {viewport.latitude} | Zoom: {viewport.zoom}
      </div>
      <div ref={mapContainerRef} className="map-container" />
    </div>
  );
}

export default MapBox;
