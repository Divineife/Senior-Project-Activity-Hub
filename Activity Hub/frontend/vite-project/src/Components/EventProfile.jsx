import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import React, { useState, useEffect } from "react";
import axios from "axios";
import GroupsIcon from "@mui/icons-material/Groups";

import EventGuests from "./EventGuests";

export default function EventProfile({ eventDetails }) {
  let guestIds = eventDetails.rsvpUsers;
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const promises = guestIds.map(async (id) => {
          const response = await axios.get(`http://localhost:3000/data/${id}`); // Replace with your Flask endpoint
          return response.data;
        });

        const results = await Promise.all(promises);
        setData(results);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card variant="outlined" sx={{ maxWidth: 360 }}>
      <Box sx={{ p: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography gutterBottom variant="h5" component="div">
            {eventDetails?.eventName}
          </Typography>
          <Typography gutterBottom variant="h6" component="div">
            $4.50
          </Typography>
        </Stack>
        <Typography color="text.secondary" variant="body2">
          {eventDetails?.eventLocation}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="h7" gutterBottom style={{ fontWeight: "bold" }}>
          <span style={{ marginLeft: 10, marginRight: 10 }}>
            <GroupsIcon />
          </span>
          {eventDetails.rsvpUsers.length} people are Coming
        </Typography>
        <EventGuests eventGuests={data} />
      </Box>
    </Card>
  );
}
