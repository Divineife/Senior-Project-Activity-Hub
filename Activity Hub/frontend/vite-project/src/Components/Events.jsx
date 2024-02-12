import { useState, useEffect } from 'react';
import Event from './Event';

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
      <ul>
        {events.map(event => (
          // eslint-disable-next-line react/jsx-key
          <Event event = {event}/>
        ))}
      </ul>
    </div>
  );
}

export default Events;
