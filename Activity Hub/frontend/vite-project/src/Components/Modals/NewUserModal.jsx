import React, { useState, useEffect } from 'react';
import BasicModal from '../BasicModal/BasicModal';

const NewUserModal = ({ open, onClose, addNewEvent, sessionState, setSignIn, setSignUp }) => {

    const addUser = (data) => {
        addNewEvent(data);
    };

    const handleSubmit = (user)=> {
        console.log("Handled", user)
    }

    return (
        <BasicModal
            open={open}
            onClose={onClose}
            sessionState = {sessionState}
            setSignIn = {setSignIn}
            setSignUp = {setSignUp}
            title="We are Excited to have you Join Our Hub"
            onSubmit={handleSubmit(addUser)}
        />
    );
};

export default NewUserModal;
