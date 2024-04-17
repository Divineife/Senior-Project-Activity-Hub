import * as React from "react";
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
