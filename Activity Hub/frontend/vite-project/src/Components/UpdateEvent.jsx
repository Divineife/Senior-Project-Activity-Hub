import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormGroup,
  InputLabel,
  Input,
  Button,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Visibility from "../Components/CommonButton/Visibility";
import CardMedia from "@mui/material/CardMedia";
import { useNavigate, useParams } from "react-router-dom";
import TextField from "@mui/material/TextField";

function convertToList(str) {
  if (typeof str !== "string") {
    return [];
  }
  const array = str.split(",");
  return array.map((item) => item.trim());
}

const EventForm = () => {
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [selectedVisibility, setSelectedVisibility] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [curEventImage, setCurEventImage] = useState(null);
  const [newEventImg, setNewEventImg] = useState(null);
  const { event_id } = useParams();
  const [imgUrl, setImgUrl] = useState(false);
  const navigate = useNavigate();

  const handleVisibilityChange = (newVisibility) => {
    setSelectedVisibility(newVisibility);
  };

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/events/${event_id}`,
        );
        const eventData = await response.json();
        setEventDetails(eventData);
        setEventName(eventData.eventName);
        setEventLocation(eventData.eventLocation);
        setEventDescription(eventData.eventDescription);
        setSelectedVisibility(convertToList(eventData.selectedVisibility));
        setCurEventImage(eventData.eventImgId);
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };

    fetchEventData();
  }, [event_id]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("eventName", eventName);
    formData.append("eventDescription", eventDescription);
    formData.append("eventLocation", eventLocation);
    formData.append("selectedVisibility", selectedVisibility);
    formData.append("curEventImage", curEventImage);
    formData.append("newEventImg", newEventImg);

    try {
      const response = await fetch(
        `http://localhost:3000/editEvent/${event_id}`,
        {
          method: "PUT",
          body: formData,
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update event");
      }
      navigate(`/eventDetails/${event_id}`);
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };
  return (
    <div>
      <InputLabel>Edit Event Form</InputLabel>
      <Paper elevation={3}>
        <FormGroup onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <FormControl>
              <InputLabel>Event Name</InputLabel>
              <Input
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              ></Input>
            </FormControl>
            <FormControl>
              <InputLabel>Event Description</InputLabel>
              <Input
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
              ></Input>
            </FormControl>
            <FormControl>
              <InputLabel>Event Location</InputLabel>
              <Input
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
              ></Input>
            </FormControl>
            <CardMedia
              component="img"
              sx={{ height: 200 }}
              image={imgUrl ? imgUrl : null}
            />
            <InputLabel>
              You may or may not change current Event Image
            </InputLabel>
            <FormControl>
              <TextField
                type="file"
                onChange={(e) => setNewEventImg(e.target.files[0])}
              />
            </FormControl>
            <FormControl>
              <Visibility
                selectedVisibility={selectedVisibility}
                onVisibilityChange={handleVisibilityChange}
              />
            </FormControl>
          </Stack>
          <Button type="submit" variant="contained" onClick={handleSubmit}>
            SAVE CHANGES
          </Button>
        </FormGroup>
      </Paper>
    </div>
  );
};

export default EventForm;
