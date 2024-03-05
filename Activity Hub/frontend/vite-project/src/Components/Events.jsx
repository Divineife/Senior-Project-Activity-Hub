/* eslint-disable react/jsx-key */
import { useState, useEffect } from "react";
import Event from "./Event";
import "../Styles/Events.css";
// import { Grid } from "@mui/material/";
import Grid from '@mui/material/Unstable_Grid2';

function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/events", {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setEvents(data);
      })
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  return (
    <Grid container spacing={3} rowSpacing={4}  className="event-list-container" >
      {events.map((event, index) => (
        <Grid xs={12} sm={6} md={4} lg = {3} sx={{ marginBottom: 2 }}>
          <Event key={index} event={event} />
        </Grid>
      ))}
    </Grid>
  );
}

export default Events;
