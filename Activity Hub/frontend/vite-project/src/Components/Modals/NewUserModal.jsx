import React, { useState, useEffect } from "react";
import BasicModal from "../BasicModal/BasicModal";

const NewUserModal = ({
  open,
  onClose,
  addNewEvent,
  sessionState,
  setSignIn,
  setSignUp,
  setSignUpSuccess,
  setUserInSession,
}) => {
  const addUser = (data) => {
    addNewEvent(data);
  };

  const handleSubmit = (user) => {
    console.log("Handled", user);
  };

  return (
    <BasicModal
      open={open}
      onClose={onClose}
      sessionState={sessionState}
      setSignIn={setSignIn}
      setSignUp={setSignUp}
      setSignUpSuccess={setSignUpSuccess}
      title="We are Excited to have you Join Our Hub"
      onSubmit={handleSubmit(addUser)}
      setUserInSession={setUserInSession}
    />
  );
};

export default NewUserModal;
