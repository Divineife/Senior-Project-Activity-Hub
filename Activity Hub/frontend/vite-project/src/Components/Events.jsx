/* eslint-disable react/jsx-key */
import { useState, useEffect } from "react";
import Event from "./Event";
import "../Styles/Events.css";
import { Grid } from "@mui/material";

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
    <Grid container spacing={2} className="event-list-container">
      {events.map((event, index) => (
        <Grid item xs={4} sx={{ marginBottom: 2 }}>
          <Event key={index} event={event} />
        </Grid>
      ))}
    </Grid>
  );
}

export default Events;
