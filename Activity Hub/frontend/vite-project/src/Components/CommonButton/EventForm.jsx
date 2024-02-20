import { FormControl, FormGroup, InputLabel,Input, Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Visibility from './Visibility';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const EventForm = () => {
    const [eventName, setEventName] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [selectedVisibility, setSelectedVisibility] = useState(null);
    const navigate = useNavigate();

    const handleVisibilityChange = (newVisibility) => {
      setSelectedVisibility(newVisibility);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const data = {
            eventName,
            eventDescription,
            eventLocation,
            selectedVisibility
        };
    
        try {
            const url = "http://localhost:3000/addEvent"
            const response = await axios.post(url, data, {
              headers: {
                'Content-Type': 'application/json',
              },
            });
    
            console.log(response.data);
            navigate('/');
          } catch (error) {
            console.error('Error:', error);
          }
        
    };
    

    return (
        <div>
            <InputLabel>Add Event Form</InputLabel>
            <Paper elevation={3}>
                <FormGroup onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <FormControl>
                            <InputLabel>Event Name</InputLabel>
                            <Input value={eventName} onChange={(e) => setEventName(e.target.value)}></Input>
                        </FormControl>
                        <FormControl>
                            <InputLabel>Event Description</InputLabel>
                            <Input value={eventDescription} onChange={(e) => setEventDescription(e.target.value)}></Input>
                        </FormControl>
                        <FormControl>
                            <InputLabel>Event Location</InputLabel>
                            <Input value={eventLocation} onChange={(e) => setEventLocation(e.target.value)}></Input>
                        </FormControl>
                        <FormControl>
                            <Visibility onVisibilityChange={handleVisibilityChange} />
                        </FormControl>
                    </Stack>

                    <Button type="submit" variant='contained' onClick={handleSubmit}>ADD EVENT</Button>
                </FormGroup>
            </Paper>
        </div>
    );
};

export default EventForm;
