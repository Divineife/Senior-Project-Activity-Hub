import { Typography, Paper } from "@mui/material";
import { useRef, useEffect, useState } from "react";
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
import MapBox from "./MapBox";

function EventDetails() {
  const { id } = useParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [imgUrl, setImgUrl] = useState(false);
  const mapContainer = useRef(null);
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
  }, [id]);

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

  const handleEditEvent = async (id) => {
    const event_id = eventDetails["_id"];
    navigate(`/editEvent/${event_id}`);
  };

  return (
    <Card
      sx={{
        border: "none",
        padding: 1,
        marginRight: 2,
        backgroundColor: "#edf3f9",
      }}
    >
      <Paper elevation={4}>
        <Stack
          direction="column"
          spacing={2}
          alignItems="center"
          justifyContent="center"
          display="flex"
        >
          <Chip
            sx={{ borderRadius: 0, backgroundColor: "#edf3f9", fontSize: 20 }}
            label="Details Page"
          />

          <CardMedia
            component="img"
            sx={{
              width: 450,
              height: 500,
              marginTop: "30px",
            }}
            image={imgUrl ? imgUrl : null}
          />
          <Typography gutterBottom variant="h6" component="div">
            {eventDetails.eventName}
          </Typography>
          <Typography variant="caption">{eventDetails.eventLocation}</Typography>
          <Typography
            gutterBottom
            variant="h9"
            component="div"
            sx={{ padding: "20px" }}
          >
            {eventDetails.eventDescription}
          </Typography>
        </Stack>
      </Paper>

      <div style={{ marginBottom: 20 }}></div>

      <Paper elevation={20}>
        {/* <MapBox eventDetails={eventDetails} /> */}
        <MapBox eventDetails={eventDetails} />
      </Paper>

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
            size="small"
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
          <Button
            size="small"
            aria-haspopup="true"
            variant="contained"
            onClick={handleEditEvent}
          >
            {"Edit Event"}
          </Button>
        )}
      </Paper>
    </Card>
  );
}

export default EventDetails;
