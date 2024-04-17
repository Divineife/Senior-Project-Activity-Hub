import { useEffect, useState } from "react";
import * as React from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import EventProfile from "./EventProfile";

function EventAccordion({ eventId }) {
  const [eventDetails, setEventDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = React.useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  useEffect(() => {
    fetch(`http://localhost:3000/events/${eventId}`, {
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
  }, [eventId]);

  if (loading) {
    return <Typography>Loading event details...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&::before": {
      display: "none",
    },
  }));

  const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
      expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
      {...props}
    />
  ))(({ theme }) => ({
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, .05)"
        : "rgba(0, 0, 0, .03)",
    flexDirection: "row-reverse",
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
      transform: "rotate(90deg)",
    },
    "& .MuiAccordionSummary-content": {
      marginLeft: theme.spacing(1),
    },
  }));

  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: "1px solid rgba(0, 0, 0, .125)",
  }));

  return (
    <Accordion expanded={expanded === eventId} onChange={handleChange(eventId)}>
      <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
        <Typography> {eventDetails?.eventName}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <EventProfile eventDetails={eventDetails} />
      </AccordionDetails>
    </Accordion>
  );
}

export default EventAccordion;
