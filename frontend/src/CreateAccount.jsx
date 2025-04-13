import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Snackbar, CircularProgress } from '@mui/material';
import Header from './components/header';
import './App.css';

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    address: '',
    gender: '',
    conditions: '',
    surgeries: '',
    medications: '',
  });
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:3001/checkIfPatientExists?email=${formData.email}`);
      const result = await response.json();
      if (result.data[0]) {
        setSnackbarMessage('An account is already associated with that email.');
        setSnackbarOpen(true);
        setLoading(false);
      } else {
       const res= await fetch(`http://localhost:3001/makeAccount?name=${formData.firstName}&lastname=${formData.lastName}&email=${formData.email}&password=${formData.password}&address=${formData.address}&gender=${formData.gender}&conditions=${formData.conditions}&medications=${formData.medications}&surgeries=${formData.surgeries}`);
       if(res.status===500){
          
         alert("Account creation failed, changes have been rolled back");
         window.location = "/login";
       }
       if(res.status===400){

         alert("Account creation failed, changes have been rolled back");
         window.location = "/login";
       }
       setLoading(false);
        setSnackbarMessage('Account created successfully!');
        setSnackbarOpen(true);
        // Redirect or handle success (e.g., navigate to home)
        window.location = "/Home";
      }
    } catch (error) {
      setLoading(false);
      setSnackbarMessage('An error occurred. Please try again.');
      setSnackbarOpen(true);
    }
  };

  return (
   <div className='max-w-screen over overflow-auto'>
      <Header />
      <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
        <Typography variant="h4">Patient Registration</Typography>
        <Typography variant="body2" color="textSecondary">Please fill in the details below:</Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <div className='flex flex-col items-center justify-center gap-2 ' >
          <TextField
            label="First Name"
            variant="outlined"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            
            required
          />

          <TextField
            label="Last Name"
            variant="outlined"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            
            required
          />

          <TextField
            label="Gender"
            variant="outlined"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            
            required
          />

          <TextField
            label="Medical History - Conditions"
            variant="outlined"
            name="conditions"
            value={formData.conditions}
            onChange={handleChange}
            
          />

          <TextField
            label="Medical History - Surgeries"
            variant="outlined"
            name="surgeries"
            value={formData.surgeries}
            onChange={handleChange}
            
          />

          <TextField
            label="Medical History - Medications"
            variant="outlined"
            name="medications"
            value={formData.medications}
            onChange={handleChange}
            
          />

          <TextField
            label="Address"
            variant="outlined"
            name="address"
            value={formData.address}
            onChange={handleChange}
            
            required
          />

          <TextField
            label="Email"
            variant="outlined"
            name="email"

            value={formData.email}
            onChange={handleChange}
            
            required
          />

          <TextField
            label="Password"
            variant="outlined"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            
            required
            helperText="At least 8 characters containing 2 digits"
            // inputProps={{
            //   minLength: 8,
            //   pattern: '.*[0-9].*[0-9].*',
            // }}
          />

         
       <div className='flex flex-row items-center justify-between w-1/2 gap-4'>
            <Button variant="outlined" color="secondary" href="/" sx={{ flex: 1 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ flex: 1}}
              disabled={loading}
              
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
            </Button>
            </div>
        </div>
      </form>

      <Box sx={{ textAlign: 'center', marginTop: 2 }}>
        <Typography variant="body2">Are you a doctor?</Typography>
        <Button variant="contained" color="secondary" href="/MakeDoc">I'm a doctor</Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </div>
  );
};

export default CreateAccount;
