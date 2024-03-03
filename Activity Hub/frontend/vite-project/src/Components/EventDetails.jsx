import { Container, Typography, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArchiveIcon from "@mui/icons-material/Archive";
import Button from "@mui/material/Button";
import axios from "axios";

function EventDetails() {
  const { id } = useParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3000/events/${id}`, {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch event details");
        }
        return response.json();
      })
      .then((data) => {
        // Set event details in state
        setEventDetails(data);
        setLoading(false);
      })
      .catch((error) => {
        // Set error state
        setError(error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch(`http://localhost:3000/validate/` + eventDetails?.author, {
      credentials: "include",
    })
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        setIsOwner(res.result);
      });
  }, [eventDetails]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleDeleteEvent = async () => {
    try {
      {"ONDELETE", console.log(eventDetails)}
      const id = eventDetails._id;
      const url = "http://localhost:3000/events/" + id + "?imgId=" + eventDetails.eventImgId;
      const response = await axios.delete(url);

      if (response.data.success) {
        console.log("Event deleted successfully");
        navigate("/");
      } else {
        console.error("Error deleting event:", response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <Container
        sx={{
          justifyContent: "center",
          alignContent: "center",
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <Typography gutterBottom variant="h4" component="div">
          Details Page
        </Typography>
        <Typography gutterBottom variant="h5" component="div">
          {eventDetails.eventName}
        </Typography>
        <Typography gutterBottom variant="h9" component="div">
          {eventDetails.eventDescription}
        </Typography>
        <Paper
          sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
          elevation={3}
        >
          {isOwner && (
            <Button
              size="large"
              aria-haspopup="true"
              variant="contained"
              onClick={handleDeleteEvent}
            >
              {"Delete Event"}
            </Button>
          )}
          <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
          <BottomNavigationAction label="Archive" icon={<ArchiveIcon />} />
          {isOwner && (
            <Button size="large" aria-haspopup="true" variant="contained">
              {"Edit Event"}
            </Button>
          )}
        </Paper>
      </Container>
    </div>
  );
}

export default EventDetails;
