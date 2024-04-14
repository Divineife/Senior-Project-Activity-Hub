import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import EventGuests from "./EventGuests";

export default function EventProfile({ eventDetails }) {
  console.log(eventDetails)
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
        <Typography gutterBottom variant="body2">
          Who is coming?
          <EventGuests eventGuests={eventDetails.rsvpUsers}/>
        </Typography>
        <Stack direction="row" spacing={1}>
          <Chip color="primary" label="Nashville" size="small" />
        </Stack>
      </Box>
    </Card>
  );
}
