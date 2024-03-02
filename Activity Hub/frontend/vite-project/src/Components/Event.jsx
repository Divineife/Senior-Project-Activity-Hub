import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { Paper } from "@mui/material";
import { useEffect } from "react";

function Event(events) {
  const { event } = events;
  const navigate = useNavigate();

  const handleLearnMore = (eventId) => {
    try {
      let val = fetch("http://localhost:3000/user/validate", {
        credentials: "include",
      })
        .then((res) => {
          return res.text(); // Extract the response body as text
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

  return (
    <Paper elevation={15} sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        sx={{ height: 200 }}
        image={event.eventImage}
      />
      <CardContent padding={0}>
        <Typography gutterBottom variant="h5" component="div">
          {event.eventName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {event.eventDescription}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {event.eventLocation}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small" onClick={() => handleLearnMore(event._id)}>
          Learn More
        </Button>
      </CardActions>
    </Paper>
  );
}

export default Event;
