import React, { useState, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import '../Styles/map.css'
const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiZGl2aW5lZmFsZXllIiwiYSI6ImNsdG9zajYxbDBpejAya3J5eHZ6aDNwMHEifQ.HOVsmfrlboFr53UUeFKncA";

function MapBox({ eventDetails }) {
    const {geometry} = eventDetails || {}
    if (!geometry){
        return <p>Location information not available.</p>;
    }
  const [viewport, setViewport] = useState({
    lat: geometry[1],
    long: geometry[0],
    zoom: 10,
  });
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [viewport.long, viewport.lat],
      zoom: viewport.zoom,
      accessToken: MAPBOX_ACCESS_TOKEN,
    });
    const marker = new mapboxgl.Marker()
      .setLngLat([viewport.long, viewport.lat])
      .setPopup(
        new mapboxgl.Popup({offset: 10})
        .setHTML(
            `<h3>${eventDetails.eventLocation}</h3>`
        )
      )
      .addTo(map);

    map.on("move", () => {
      const newViewport = { ...viewport }; 
      newViewport.long = map.getCenter().lng.toFixed(4);
      newViewport.lat = map.getCenter().lat.toFixed(4);
      newViewport.zoom = map.getZoom().toFixed(2);
      setViewport(newViewport);
    });

    return () => {map.remove(); marker.remove()};
  }, []);



  return (
    <>
      <div className="sidebar">
        Longitude: {viewport.long} | Latitude: {viewport.lat} | Zoom: {viewport.zoom}
      </div>
      <div ref={mapContainerRef} className="map-container" />
    </>
  );
}

export default MapBox;
