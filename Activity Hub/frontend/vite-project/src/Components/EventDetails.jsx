import { Container, Typography, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArchiveIcon from "@mui/icons-material/Archive";

function EventDetails() {
  const { id } = useParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Make API call using fetch or Axios
    fetch(`http://localhost:3000/events/${id}`, {
      credentials: 'include',
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
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
          <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
          <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
          <BottomNavigationAction label="Archive" icon={<ArchiveIcon />} />
        </Paper>
      </Container>
    </div>
  );
}

export default EventDetails;
