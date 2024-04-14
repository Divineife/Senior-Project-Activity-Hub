import { NavBarContext } from "./context";
import React, { useState, useEffect, useContext } from "react";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";

function UserProfile() {
  const { userInSession } = useContext(NavBarContext);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("http://localhost:3000/user", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Error fetching user info: ${response.status}`);
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, []);
  console.log("USER", user);

  if (isLoading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!user) {
    return <p>No user data found.</p>;
  }
  const { first_name, last_name, email, school, events } = user;
  const numEvents = events.length;

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar
            alt={first_name}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfjhH9JE8PzTw1bAo66ZaAa9JVbj8gCfB2QA&s"
          />
        }
        title={first_name + " " + last_name}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          Email: {email}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          School: {school}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Events Posted: {numEvents}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default UserProfile;