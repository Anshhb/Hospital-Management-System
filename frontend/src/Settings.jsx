import React, { useState } from 'react';
import { Box, Button, Heading, FormField, Form, TextInput, Grommet, Text } from 'grommet';
import './App.css';
import Header from './components/header';

const theme = {
    global: {
        colors: {
            brand: '#000000',
            focus: '#000000'
        },
        font: {
            family: 'Lato',
        },
    },
};



const Settings = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');

    const handlePasswordChange = (event) => {
        event.preventDefault();
        let email_in_use = "";

        // Get the current user's email
        fetch("http://localhost:3001/userInSession")
            .then(res => res.json())
            .then(res => {
                email_in_use = res.email;
                
                // Send password reset request
                fetch(`http://localhost:3001/resetPasswordPatient?email=${email_in_use}&oldPassword=${oldPassword}&newPassword=${newPassword}`, { method: 'POST' })
                    .then(res => res.json())
                    .then(res => {
                        const didUpdate = res.data?.affectedRows;
                        if (didUpdate === 0) {
                            setError("Entered your old password incorrectly");
                        } else {
                            alert("Password Reset Successful");
                        }
                    })
                    .catch(err => setError("Something went wrong. Please try again."));
            })
            .catch(err => setError("Could not fetch user session."));
    };

    return (
        <Grommet theme={theme} full>
            <Box>
            <Header/>
                <Box pad="medium" align="center">
                    <Box width="medium" border={{ color: 'brand', size: 'small' }} round="small" pad="medium">
                        <Heading level={2} margin="small">Change Password</Heading>
                        <Form onSubmit={handlePasswordChange}>
                            <FormField
                                label="Old Password"
                                name="oldPassword"
                                required
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                type="password"
                            />
                            <FormField
                                label="New Password"
                                name="newPassword"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                type="password"
                            />
                            {error && (
                                <Text color="status-critical" size="small" margin={{ top: 'small' }}>
                                    {error}
                                </Text>
                            )}
                            <Button
                                type="submit"
                                label="Change Password"
                                primary
                                margin={{ top: 'medium' }}
                            />
                        </Form>
                    </Box>
                </Box>
            </Box>
        </Grommet>
    );
};

export default Settings;
