import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function EventDetails() {
    const { id } = useParams();
    const [eventDetails, setEventDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Make API call using fetch or Axios
        fetch(`http://localhost:3000/events/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch event details');
                }
                return response.json();
            })
            .then(data => {
                // Set event details in state
                setEventDetails(data);
                setLoading(false);
            })
            .catch(error => {
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
            <h1>Details Page</h1>
            {eventDetails && (
                <div>
                    <h2>{eventDetails.event_name}</h2>
                    <p>{eventDetails.event_desc}</p>
                </div>
            )}
        </div>
    );
}

export default EventDetails;
