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
  setUserInfo,
}) => {
  const addUser = (data) => {
    addNewEvent(data);
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
      setUserInSession={setUserInSession}
      setUserInfo={setUserInfo}
    />
  );
};

export default NewUserModal;
