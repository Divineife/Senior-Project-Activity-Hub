/* eslint-disable react/jsx-key */
import { useState, useEffect, useContext } from "react";
import Event from "./Event";
import "../Styles/Events.css";
import Grid from "@mui/material/Unstable_Grid2";
import { NavBarContext } from "./context";


function Events() {
  const [events, setEvents] = useState([]);
  const { userInSession } = useContext(NavBarContext);

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
  }, [userInSession]);

  return (
    <Grid
      container
      spacing={3}
      rowSpacing={4}
      sx={{ backgroundColor: "#edf3f9", width: "100%", height: "100%" }}
    >
      {events.map((event, index) => (
        <Grid xs={12} sm={6} md={4} lg={3} sx={{ marginBottom: 2 }}>
          <Event
          key={index}
          event={{
            ...event,
            eventDescription: event.eventDescription && event.eventDescription.length > 100
              ? `${event.eventDescription.substring(0, 100)}...`
              : event.eventDescription,
          }}
        />
        </Grid>
      ))}
    </Grid>
  );
}

export default Events;
