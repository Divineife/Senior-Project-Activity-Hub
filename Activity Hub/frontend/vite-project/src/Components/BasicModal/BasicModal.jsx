import React from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { modalStyles } from './styles';
import SignIn from '../SignIn';
import SignUp from '../SignUp';

const BasicModal = ({ open, onClose, title, subTitle, content, onSubmit, sessionState, setSignIn, setSignUp }) => {
    console.log("Basic", sessionState)
    return (
        <Modal open={open} onClose={onClose} >
            <Box sx={modalStyles.wrapper}>
                <Typography
                    variant="h6"
                    component="h2"
                >
                    {title}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    {subTitle}
                </Typography>
                {content}
                <Box sx={modalStyles.buttons}>
                    {sessionState == "signUp" && <SignUp setSignIn = {setSignIn} />}
                    {sessionState == "signIn" && <SignIn setSignUp = {setSignUp} />}
                </Box>
            </Box>
        </Modal>
    )
}

export default BasicModal