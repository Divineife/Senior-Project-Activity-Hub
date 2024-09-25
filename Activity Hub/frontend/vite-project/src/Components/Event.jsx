import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { Paper } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import { NavBarContext } from "./context";
import RSVP from "./RSVP";

function Event({ event, userInfo, setShowAlert }) {
  const navigate = useNavigate();
  const [imgUrl, setImgUrl] = useState(null);
  const [interestCount, setInterestCount] = useState(
    event.rsvpUsers?.length || 0
  );

  const { userInSession, setUserInSession } = useContext(NavBarContext);

  const handleLearnMore = (eventId) => {
    try {
      fetch("http://localhost:3000/user/validate", {
        credentials: "include",
      })
        .then((res) => res.text())
        .then((result) => {
          if (result === "True") {
            navigate(`/eventDetails/${eventId}`);
          } else {
            setShowAlert(true);
          }
        });
    } catch (e) {
      console.log("Failed to validate", e);
    }
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`http://localhost:3000/image/${event?.eventImgId}`, {
          credentials: "include",
        });
        const data = await response.json();
        setImgUrl(data.result);
      } catch (error) {
        console.error("Error fetching image:", error);
        setImgUrl(event.eventImage); // Fallback to the default image
      }
    };

    fetchImage();
  }, [event?.eventImgId]); // Add event.eventImgId as a dependency

  const padEventName = (eventName) => {
    return eventName + " ".repeat(70 - eventName.length);
  };

  return (
    <Paper elevation={15} sx={{ maxWidth: 500 }}>
      <CardMedia
        component="img"
        sx={{ height: 300 }}
        image={imgUrl || event.eventImage}
        alt={event.eventName}
      />
      <CardContent padding={0} style={{ textAlign: "justify", width: "100%" }}>
        <Typography gutterBottom variant="h5" component="div">
          <span style={{ display: "inline-block", width: "100%", textAlign: "start" }}>
            {padEventName(event.eventName)}
          </span>
        </Typography>
        {userInSession ? (
          <Typography variant="body2" color="text.secondary" style={{ marginTop: 8 }}>
            {event.eventLocation}
          </Typography>
        ) : (
          <Typography variant="body2" style={{ marginTop: 8 }}>
            Sign In to see location
          </Typography>
        )}
        <Typography variant="body2" style={{ marginTop: 8 }}>
          {interestCount} Going
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small" onClick={() => handleLearnMore(event._id)}>
          Learn More
        </Button>
        {userInSession && (
          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "8px",
            alignSelf: "right",
            marginLeft: "40px",
          }}>
            <RSVP
              eventInfo={event}
              userInfo={userInfo}
              interestCount={interestCount}
              setInterestCount={setInterestCount}
            />
          </div>
        )}
      </CardActions>
    </Paper>
  );
}

export default Event;