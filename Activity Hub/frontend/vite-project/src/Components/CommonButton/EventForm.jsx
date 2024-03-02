import {
  FormControl,
  FormGroup,
  InputLabel,
  Input,
  Button,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Visibility from "./Visibility";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import { Form, useNavigate } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";

const EventForm = () => {
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [selectedVisibility, setSelectedVisibility] = useState(null);
  const [eventImage, setEventImage] = useState(null);

  const navigate = useNavigate();

  const handleVisibilityChange = (newVisibility) => {
    setSelectedVisibility(newVisibility);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("eventName", eventName);
    formData.append("eventDescription", eventDescription);
    formData.append("eventLocation", eventLocation);
    formData.append("selectedVisibility", selectedVisibility);
    formData.append("eventImage", eventImage);

    try {
      const url = "http://localhost:3000/addEvent";
      const response = await fetch(url, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      console.log(response.data);
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <InputLabel>Add Event Form</InputLabel>
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
            <FormControl>
              <TextField
                type="file"
                onChange={(e) => setEventImage(e.target.files[0])}
              />
            </FormControl>
            <FormControl>
              <Visibility onVisibilityChange={handleVisibilityChange} />
            </FormControl>
          </Stack>
          <Button type="submit" variant="contained" onClick={handleSubmit}>
            ADD EVENT
          </Button>
        </FormGroup>
      </Paper>
    </div>
  );
};

export default EventForm;
