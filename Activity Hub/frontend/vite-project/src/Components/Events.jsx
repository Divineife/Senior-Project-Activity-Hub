/* eslint-disable react/jsx-key */
import { useState, useEffect } from 'react';
import Event from './Event';
import "../Styles/Events.css"
import { Grid } from '@mui/material';
import axios from 'axios';


function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/events')
      .then(response => {
        setEvents(response.data);
      })
      .catch(error => console.error('Error fetching events:', error));
  }, []);

  return (
    <Grid container spacing={2} className='event-list-container'>
        {events.map((event, index) => (
          <Grid item xs={4} sx={{marginBottom: 2 }}>
              <Event key={index} event={event} />
          </Grid>
          
        ))}
    </Grid>
    
  );
}

export default Events;
