/* eslint-disable react/jsx-key */
import { useState, useEffect } from 'react';
import Event from './Event';
import "../Styles/Events.css"
import { Grid } from '@mui/material';


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
    <Grid container spacing={2}>
      {/* <div className="event-list-container"> */}
        {events.map((event, index) => (
          <Grid item xs={4}>
              <Event key={index} event={event} />
          </Grid>
          
        ))}
      {/* </div> */}
    </Grid>
    
  );
}

export default Events;
