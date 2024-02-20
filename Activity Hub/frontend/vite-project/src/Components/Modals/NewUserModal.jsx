import React, { useState, useEffect } from 'react';
import BasicModal from '../BasicModal/BasicModal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const defaultInputValues = {
    userId: '',
    email: '',
    phoneNumber: '',
    image: '',
    description: '',
    title: '',
    name: '',
    location: '',
    event_visibility: ''
};

const NewUserModal = ({ open, onClose, addNewEvent }) => {
    const [values, setValues] = useState(defaultInputValues);

    const modalStyles = {
        inputFields: {
            display: 'flex',
            flexDirection: 'column',
            marginTop: '20px',
            marginBottom: '15px',
            '.MuiFormControl-root': {
                marginBottom: '20px',
            },
        },
    };

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

    const validationSchema = Yup.object().shape({
        userId: Yup.string()
            .required('User ID is required')
            .min(6, 'User ID must be at least 6 characters'),
        email: Yup.string()
            .required('Email is required')
            .email('Email is invalid.'),
        phoneNumber: Yup.string()
            .matches(phoneRegExp, 'Phone number is not valid'),
        image: Yup.string().required('Image is required'),
        description: Yup.string().required('Description is required'),
        title: Yup.string().required('Title is required'),
        name: Yup.string().required('Name is required'),
        location: Yup.string().required('Location is required'),
        event_visibility: Yup.string().optional()
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema)
    });

    const addUser = (data) => {
        addNewEvent(data);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value
        }));
    };

    useEffect(() => {
        if (open) setValues(defaultInputValues);
    }, [open]);

    const getContent = () => (
        <Box sx={modalStyles.inputFields}>
            {/* <TextField
                placeholder="User ID"
                name="userId"
                label="User ID"
                required
                {...register('userId')}
                error={errors.userId ? true : false}
                helperText={errors.userId?.message}
                value={values.userId}
                onChange={handleChange}
            />
            <TextField
                placeholder="Email"
                name="email"
                label="Email"
                required
                {...register('email')}
                error={errors.email ? true : false}
                helperText={errors.email?.message}
                value={values.email}
                onChange={handleChange}
            /> */}
            <TextField
                placeholder="Phone number"
                name="phoneNumber"
                label="Phone number"
                required
                {...register('phoneNumber')}
                error={errors.phoneNumber ? true : false}
                helperText={errors.phoneNumber?.message}
                value={values.phoneNumber}
                onChange={handleChange}
            />
            <TextField
                placeholder="Image URL"
                name="image"
                label="Image"
                required
                {...register('image')}
                error={errors.image ? true : false}
                helperText={errors.image?.message}
                value={values.image}
                onChange={handleChange}
            />
            <TextField
                placeholder="Description"
                name="description"
                label="Description"
                required
                {...register('description')}
                error={errors.description ? true : false}
                helperText={errors.description?.message}
                value={values.description}
                onChange={handleChange}
            />
            <TextField
                placeholder="Title"
                name="title"
                label="Title"
                required
                {...register('title')}
                error={errors.title ? true : false}
                helperText={errors.title?.message}
                value={values.title}
                onChange={handleChange}
            />
            <TextField
                placeholder="Name"
                name="name"
                label="Name"
                required
                {...register('name')}
                error={errors.name ? true : false}
                helperText={errors.name?.message}
                value={values.name}
                onChange={handleChange}
            />
            <TextField
                placeholder="Location"
                name="location"
                label="Location"
                required
                {...register('location')}
                error={errors.location ? true : false}
                helperText={errors.location?.message}
                value={values.location}
                onChange={handleChange}
            />
            <TextField
                placeholder="Event Visibility"
                name="event_visibility"
                label="Event Visibility"
                {...register('event_visibility')}
                error={errors.event_visibility ? true : false}
                helperText={errors.event_visibility?.message}
                value={values.event_visibility}
                onChange={handleChange}
            />
        </Box>
    );
    

    return (
        <BasicModal
            open={open}
            onClose={onClose}
            title="New user"
            subTitle="Fill out inputs and hit 'submit' button."
            content={getContent()}
            onSubmit={handleSubmit(addUser)}
        />
    );
};

export default NewUserModal;
