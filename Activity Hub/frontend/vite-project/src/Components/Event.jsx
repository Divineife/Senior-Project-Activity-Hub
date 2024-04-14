import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { Paper } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import { NavBarContext } from "./context";
import Fab from "@mui/material/Fab";

function Event({ event, userInfo }) {
  const navigate = useNavigate();
  const [imgUrl, setImgUrl] = useState(false);
  const [interestCount, setInterestCount] = useState(
    event.rsvpUsers?.length || 0,
  );
  const [isRSVPd, setIsRSVPd] = useState(
    event?.rsvpUsers ? event.rsvpUsers.includes(userInfo["user_id"]) : false,
  );

  const { userInSession, setUserInSession } = useContext(NavBarContext);

  const handleLearnMore = (eventId) => {
    try {
      let val = fetch("http://localhost:3000/user/validate", {
        credentials: "include",
      })
        .then((res) => {
          return res.text();
        })
        .then((result) => {
          if (result === "True") {
            navigate(`/eventDetails/${eventId}`);
          }
        });
    } catch (e) {
      console.log("Failed to validate", e);
    }
  };

  useEffect(() => {
    fetch(`http://localhost:3000/image/` + event?.eventImgId, {
      credentials: "include",
    })
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        setImgUrl(res.result);
      });
  }, []);

  const handleInterestClick = () => {
    if (!isRSVPd) {
      setInterestCount(interestCount + 1);
      setIsRSVPd(true);
    } else {
      setInterestCount(interestCount - 1);
      setIsRSVPd(false);
    }
    fetch(`http://localhost:3000/events/${event._id}/rsvp`, {
      method: isRSVPd ? "DELETE" : "POST", // Use POST for adding, DELETE for removing
      credentials: "include", // Include session cookies
    }).then((response) => {
      if (response.ok) {
        console.log("RSVP updated successfully");
      } else {
        console.error("Error updating RSVP:", response.statusText);
        // Handle errors, potentially revert local state changes
      }
    });
  };
  return (
    <Paper elevation={15} sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        sx={{ height: 200 }}
        image={imgUrl ? imgUrl : event.eventImage}
      />
      <CardContent padding={0}>
        <Typography gutterBottom variant="h5" component="div">
          {event.eventName}
        </Typography>
        {/* <Typography variant="body2" color="text.secondary">
          {event.eventDescription}
        </Typography> */}
        <Typography
          variant="body2"
          color="text.secondary"
          style={{ marginTop: 8 }}
        >
          {event.eventLocation}
        </Typography>
        <Typography variant="body2" style={{ marginTop: 8 }}>
          {interestCount} Going
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => setClicked(true)}>
          Share
        </Button>
        <Button size="small" onClick={() => handleLearnMore(event._id)}>
          Learn More
        </Button>
        {userInSession && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "8px",
            }}
          >
            <Fab
              variant="extended"
              size="small"
              color="primary"
              onClick={handleInterestClick}
            >
              RSVP
            </Fab>
          </div>
        )}
      </CardActions>
    </Paper>
  );
}

export default Event;
