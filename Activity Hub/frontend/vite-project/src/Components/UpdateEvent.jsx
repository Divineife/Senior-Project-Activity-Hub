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

const EventForm = () => {
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [selectedVisibility, setSelectedVisibility] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
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
        console.log(eventData);
        setEventDetails(eventData);
        setEventName(eventData.eventName);
        setEventDescription(eventData.eventDescription);
        setEventLocation(eventData.eventLocation);
        setSelectedVisibility(eventData.selectedVisibility);
        handleVisibilityChange(eventData.selectedVisibility)
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
    // Form submission logic remains the same
    // ...
  };
  console.log("Main", selectedVisibility)

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
