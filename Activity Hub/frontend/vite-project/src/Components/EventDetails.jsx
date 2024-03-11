import { Container, Typography, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArchiveIcon from "@mui/icons-material/Archive";
import Button from "@mui/material/Button";
import axios from "axios";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

function EventDetails() {
  const { id } = useParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [imgUrl, setImgUrl] = useState(false);
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
      })
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        // Set error state
        setError(error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (eventDetails) {
      fetch(`http://localhost:3000/validate/` + eventDetails.author, {
        credentials: "include",
      })
        .then((response) => {
          return response.json();
        })
        .then((res) => {
          setIsOwner(res.result);
        });
    }
  }, [eventDetails]);

  useEffect(() => {
    if (eventDetails) {
      fetch(`http://localhost:3000/image/` + eventDetails.eventImgId, {
        credentials: "include",
      })
        .then((response) => {
          return response.json();
        })
        .then((res) => {
          setImgUrl(res.result);
        })
        .catch((error) => {
          console.log("Error on Image Load", error);
        });
    }
  }, [eventDetails]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleDeleteEvent = async () => {
    try {
      {
        "ONDELETE", console.log(eventDetails);
      }
      const id = eventDetails._id;
      const url =
        "http://localhost:3000/events/" +
        id +
        "?imgId=" +
        eventDetails.eventImgId;
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
      <Card sx={{border: 'none', padding: 1, marginRight: 2, backgroundColor: '#edf3f9'}}>
        <Stack direction="column" spacing={2}>
          <Chip sx={{ borderRadius: 0, backgroundColor: '#edf3f9', fontSize: 20}} label="Details Page" />
          <CardMedia component="img" sx={{ height: 200 }} image={imgUrl? imgUrl : null} />
          <Typography gutterBottom variant="h5" component="div">
            {eventDetails.eventName}
          </Typography>
          <Typography gutterBottom variant="h9" component="div">
            {eventDetails.eventDescription}
          </Typography>
          <Paper
            sx={{
              display: "flex",
              justifyContent: "center",
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
            }}
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
        </Stack>
      </Card>
  );
}

export default EventDetails;
