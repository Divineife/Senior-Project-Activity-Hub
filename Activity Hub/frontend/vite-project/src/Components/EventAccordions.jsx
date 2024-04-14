import * as React from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import EventProfile from "./EventProfile";
import EventAccordion from "./EventAccordion";

function EventAccordions({ events }) {
  return (
    <div>
      {events.map((event) => (
        <EventAccordion eventId={event} />
      ))}
    </div>
  );
}

export default EventAccordions;
