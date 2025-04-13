import React, { useState } from 'react';
import { Box, Button, Heading, Grommet, FormField, Form, TextInput, Text } from 'grommet';
import './App.css';

const theme = {
  global: {
    colors: {
      brand: '#6f42c1', // Purple for brand color
      focus: '#6f42c1',
      background: '#f7f7f7', // Light background for better contrast
      accent: '#ff6f61',  // Accent color for buttons
    },
    font: {
      family: 'Lato',
    },
  },
};

const AppBar = (props) => (
  <Box
    tag='header'
    direction='row'
    align='center'
    justify='between'
    background='brand'
    pad={{ left: 'medium', right: 'small', vertical: 'small' }}
    style={{ zIndex: '1' }}
    {...props}
  />
);

const DocSettings = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage('');

    try {
      const userRes = await fetch("http://localhost:3001/userInSession");
      const userData = await userRes.json();
      const email_in_use = userData.email;

      const response = await fetch(`http://localhost:3001/resetPasswordDoctor?email=${email_in_use}&oldPassword=${oldPassword}&newPassword=${newPassword}`, { method: 'POST' });
      const data = await response.json();

      if (data.data.affectedRows === 0) {
        setMessage("Old Password is incorrect.");
      } else {
        setMessage("Password Reset Successful");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grommet theme={theme} full>
      <Box fill>
        <AppBar>
          <a style={{ color: 'inherit', textDecoration: 'inherit' }} href="/">
            <Heading level='3' margin='none'>HMS</Heading>
          </a>
        </AppBar>

        <Box pad="small" align="center" width="100%">
          <Box
            background="light-2"
            round="small"
            pad="medium"
            elevation="medium"
            width="400px"
            margin={{ top: 'large' }}
          >
            <Heading level={3} textAlign="center" margin="small">Change Password</Heading>

            {message && (
              <Text color={message.includes("Successful") ? "status-ok" : "status-critical"} textAlign="center" margin="small">
                {message}
              </Text>
            )}

            <Form onSubmit={handleSubmit}>
              <FormField
                label="Old Password"
                name="oldPassword"
                required
                type="password"
                value={oldPassword}
                onChange={(event) => setOldPassword(event.target.value)}
              />
              <FormField
                label="New Password"
                name="newPassword"
                required
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
              <Box align="center" margin="small">
                <Button
                  type="submit"
                  label={loading ? "Processing..." : "Change Password"}
                  primary
                  color="accent"
                  disabled={loading}
                />
              </Box>
            </Form>
          </Box>
        </Box>
      </Box>
    </Grommet>
  );
};

export default DocSettings;
