import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { Paper } from '@mui/material';


function Event(events) {
    const { event } = events;
    const navigate = useNavigate();

    const handleLearnMore = (eventId) => {
        navigate(`/eventDetails/${eventId}`)
      };

    return (
        <Paper elevation={15} sx={{ maxWidth: 345 }}>
            <CardMedia
            sx={{ height: 140 }}
            image="/static/images/cards/contemplative-reptile.jpg"
            title="green iguana"
            />
            <CardContent>
            <Typography gutterBottom variant="h5" component="div">
                {event.event_name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {event.event_desc}
            </Typography>
            </CardContent>
            <CardActions>
            <Button size="small">Share</Button>
            <Button size="small" onClick={() => handleLearnMore(event._id)}>Learn More</Button>
            </CardActions>
        </Paper>
    );
}

export default Event;