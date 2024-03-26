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

function convertToList(str) {
    if (typeof str !== 'string') {
        return [];
      }
      const array = str.split(',');
      return array.map(item => item.trim());
  }

const EventForm = () => {
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [selectedVisibility, setSelectedVisibility] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [eventImgId, setEventImgId] = useState(null)
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
        setEventLocation(eventData.eventLocation)
        setEventDescription(eventData.eventDescription);
        setSelectedVisibility(convertToList(eventData.selectedVisibility));
        setEventImgId(eventData.eventImgId)

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
  
    const formData = {
      eventName,
      eventDescription,
      eventLocation,
      selectedVisibility,
      eventImgId,
      // Any other data you want to send in the request body
    };
  
    try {
      const response = await fetch(`http://localhost:3000/event/update/${event_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Add any additional headers if needed
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("Failed to update event");
      }
  
      // Handle success response
      // For example, redirect to another page
      navigate("/success");
    } catch (error) {
      console.error("Error updating event:", error);
      // Handle error, display error message to the user, etc.
    }
  };
  
  

  
  console.log("Main", typeof(selectedVisibility), selectedVisibility)

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
