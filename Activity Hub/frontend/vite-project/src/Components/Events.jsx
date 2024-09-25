/* eslint-disable react/jsx-key */
import { useState, useEffect, useContext } from "react";
import Event from "./Event";
import "../Styles/Events.css";
import Grid from "@mui/material/Unstable_Grid2";
import { NavBarContext } from "./context";
import Alert from "@mui/material/Alert";

function Events() {
  const [events, setEvents] = useState([]);
  const { userInSession } = useContext(NavBarContext);
  const [userId, setUserId] = useState(null);
  const [signInAlert, setSignInAlert] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userSessionResponse = await fetch("http://localhost:3000/user_sess", {
          credentials: "include",
        });
        const eventsResponse = await fetch("http://localhost:3000/events", {
          credentials: "include",
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

  const totalPages = Math.ceil(events.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEvents = events.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      {signInAlert && (
        <Alert
          variant="filled"
          severity="warning"
          style={{ margin: "0px 12px 10px 0px" }}
        >
          Please Sign Up or Sign In to view more information on this event,
          gracias
        </Alert>
      )}
      <Grid
        container
        spacing={3}
        rowSpacing={4}
        sx={{ backgroundColor: "#edf3f9", width: "100%", height: "100%" }}
      >
        {currentEvents.map((event) => (
          <Grid xs={12} sm={6} md={4} lg={3} sx={{ marginBottom: 2 }} key={event.id}>
            <Event
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

      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </>
  );
}

export default Events;
