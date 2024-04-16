/* eslint-disable react/jsx-key */
import { useState, useEffect, useContext } from "react";
import Event from "./Event";
import "../Styles/Events.css";
import Grid from "@mui/material/Unstable_Grid2";
import { NavBarContext } from "./context";
import Alert from '@mui/material/Alert';

function Events() {
  const [events, setEvents] = useState([]);
  const { userInSession } = useContext(NavBarContext);
  const [userId, setUserId] = useState(null);
  const [signInAlert, setSignInAlert] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user session info and events (separate requests preferred)
        const userSessionResponse = await fetch(
          "http://localhost:3000/user_sess",
          {
            credentials: "include", // Include session cookies
          },
        );
        const eventsResponse = await fetch("http://localhost:3000/events", {
          credentials: "include", // Include session cookies (if event data depends on user)
        });

        if (!userSessionResponse.ok || !eventsResponse.ok) {
          throw new Error("Network response was not ok");
        }

        const userSessionData = await userSessionResponse.json();
        const eventsData = await eventsResponse.json();

        setUserId(userSessionData);
        setEvents(eventsData);
        setSignInAlert(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
      fetchData();

  }, [userInSession]);
  return (
    <>
    {signInAlert && (
        <Alert variant="filled" severity="warning" style={{ margin: "0px 12px 10px 0px" }}>
          Please Sign Up or Sign In To view more Information
        </Alert>
      )}
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
              eventDescription:
                event.eventDescription && event.eventDescription.length > 100
                  ? `${event.eventDescription.substring(0, 100)}...`
                  : event.eventDescription,
            }}
            userInfo={userId}
            setShowAlert={setSignInAlert}
          />
        </Grid>
      ))}
    </Grid>
    </>
    
  );
}

export default Events;
