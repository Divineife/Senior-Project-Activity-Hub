import * as React from 'react';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { styled } from '@mui/system';
import { useState, useEffect, useContext } from "react";

export default function RSVP({eventInfo, userInfo, setInterestCount, interestCount}) {
  const [anchor, setAnchor] = React.useState(null);

  const open = Boolean(anchor);
  const id = open ? 'simple-popup' : undefined;

  const [isRSVPd, setIsRSVPd] = useState(
    eventInfo?.rsvpUsers ? eventInfo.rsvpUsers.includes(userInfo["user_id"]) : false,
  );

  const handleInterestClick = (event) => {
    setAnchor(anchor ? null : event.currentTarget);
    if (!isRSVPd) {
      setInterestCount(interestCount + 1);
      setIsRSVPd(true);
    } else {
      setInterestCount(interestCount - 1);
      setIsRSVPd(false);
    }
    fetch(`http://localhost:3000/events/${eventInfo._id}/rsvp`, {
      method: isRSVPd ? "DELETE" : "POST", // Use POST for adding, DELETE for removing
      credentials: "include", // Include session cookies
    }).then((response) => {
      if (response.ok) {
        console.log("RSVP updated successfully");
      } else {
        console.error("Error updating RSVP:", response.statusText);
      }
    });
  };

  const handlePopoverClose = () => {
    setAnchor(null)
  }

  const message = isRSVPd ? "You have RSVP'd for this event successfully" : "You are no longer RSVP'd"

  return (
    <div>
      <Button aria-describedby={id} type="button" onMouseLeave={handlePopoverClose} onClick={handleInterestClick}>
         RSVP
      </Button>
      <BasePopup id={id} open={open} anchor={anchor}>
        <PopupBody>{message}</PopupBody>
      </BasePopup>
    </div>
  );
}

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const blue = {
  200: '#99CCFF',
  300: '#66B2FF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0066CC',
};

const PopupBody = styled('div')(
  ({ theme }) => `
  width: max-content;
  padding: 12px 16px;
  margin: 8px;
  border-radius: 8px;
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  box-shadow: ${
    theme.palette.mode === 'dark'
      ? `0px 4px 8px rgb(0 0 0 / 0.7)`
      : `0px 4px 8px rgb(0 0 0 / 0.1)`
  };
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  z-index: 1;
`,
);

const Button = styled('button')(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.5;
  background-color: ${blue[500]};
  padding: 8px 16px;
  border-radius: 8px;
  color: white;
  transition: all 150ms ease;
  cursor: pointer;
  border: 1px solid ${blue[500]};
  box-shadow: 0 2px 4px ${
    theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 127, 255, 0.5)'
  }, inset 0 1.5px 1px ${blue[400]}, inset 0 -2px 1px ${blue[600]};

  &:hover {
    background-color: ${blue[600]};
  }

  &:active {
    background-color: ${blue[700]};
    box-shadow: none;
  }

  &:focus-visible {
    box-shadow: 0 0 0 4px ${theme.palette.mode === 'dark' ? blue[300] : blue[200]};
    outline: none;
  }

  &.disabled {
    opacity: 0.4;
    cursor: not-allowed;
    box-shadow: none;
    &:hover {
      background-color: ${blue[500]};
    }
  }
`,
);
