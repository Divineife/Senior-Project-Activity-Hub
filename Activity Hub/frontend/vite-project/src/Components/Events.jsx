import React, { useState, useEffect } from 'react';

function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch events data from the backend
    fetch('http://localhost:3000/events')
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.error('Error fetching events:', error));
  }, []);

  return (
    <div>
    {console.log("Found", events)}
      <h1>Events</h1>
      <ul>
        {events.map(event => (
          <li key={event._id}>
            <h2>{event.event_name}</h2>
            <p>{event.event_desc}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Events;
