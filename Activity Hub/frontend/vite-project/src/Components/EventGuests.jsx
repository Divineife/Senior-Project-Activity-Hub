import React from "react";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { FixedSizeList } from "react-window";

function renderRow(props) {
  const { index, style, eventGuest } = props;
  const guestInfo = `${eventGuest?.first_name} ${eventGuest?.last_name} from ${eventGuest?.school}`;
  const guestName = guestInfo || `Guest ${index + 1}`;

  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton>
        <ListItemText primary={guestName} />
      </ListItemButton>
    </ListItem>
  );
}

export default function EventGuests({ eventGuests }) {
  return (
    <Box
      sx={{
        width: "100%",
        height: 400,
        maxWidth: 360,
        bgcolor: "background.paper",
      }}
    >
      <FixedSizeList
        height={400}
        width={360}
        itemSize={46}
        itemCount={eventGuests?.length || 0}
        overscanCount={5}
      >
        {({ index, style }) =>
          renderRow({ index, style, eventGuest: eventGuests?.[index] })
        }
      </FixedSizeList>
    </Box>
  );
}
