import React, { useState } from 'react';
import { Button, TextField, Typography, Snackbar, CircularProgress } from '@mui/material';

const MakeDoc = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    schedule: '',
    password: '',
    degree: null,
    recommendationLetter: null,
  });

  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:3001/checkIfDocExists?email=${formData.email}`);
      const result = await response.json();

      if (result.data[0]) {
        setSnackbarMessage('A doctor is already associated with that email.');
        setSnackbarOpen(true);
        setLoading(false);
      } else {
        const formDataToSubmit = new FormData();
        formDataToSubmit.append('name', formData.firstName);
        formDataToSubmit.append('lastname', formData.lastName);
        formDataToSubmit.append('email', formData.email);
        formDataToSubmit.append('password', formData.password);
        formDataToSubmit.append('gender', formData.gender);
        formDataToSubmit.append('schedule', formData.schedule);
        formDataToSubmit.append('degrees', formData.degree);
        formDataToSubmit.append('cover_letter', formData.recommendationLetter);

      const res= await fetch("http://localhost:3001/makeDocAccount", {
          method: 'POST',
          body: formDataToSubmit,
        });
        if(res.status===500){
          
          alert("Account creation failed, changes have been rolled back");
          window.location = "/login";
        }
       else if(res.status===400){
          
          alert("Account creation failed, changes have been rolled back");
          window.location = "/login";
        }
        else
       { setLoading(false);
        setSnackbarMessage('Account created successfully!');
        setSnackbarOpen(true);
        window.location = '/DocHome';}
      }
    } catch (error) {
      setLoading(false);
      setSnackbarMessage('An error occurred. Please try again.');
      setSnackbarOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
        <Typography variant="h4" align="center" color="primary" gutterBottom className="text-xl font-semibold">
          Doctor Registration
        </Typography>
        <Typography variant="body2" align="center" color="secondary" className="text-sm text-gray-500 mb-6">
          Please fill in the form to create a doctor account.
        </Typography>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <TextField
              label="First Name"
              variant="outlined"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              fullWidth
              required
              className="mb-4"
            />
          </div>
          <div>
            <TextField
              label="Last Name"
              variant="outlined"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              fullWidth
              required
              className="mb-4"
            />
          </div>
          <div>
            <TextField
              label="Email"
              variant="outlined"
              name="email"
              
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
              className="mb-4"
            />
          </div>
          <div>
            <TextField
              label="Schedule Number"
              variant="outlined"
              name="schedule"
              value={formData.schedule}
              onChange={handleChange}
              fullWidth
              required
              className="mb-4"
            />
          </div>
          <div>
            <TextField
              label="Gender"
              variant="outlined"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              fullWidth
              required
              className="mb-4"
            />
          </div>
          <div>
            <TextField
              label="Password"
              variant="outlined"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
              helperText="At least 8 characters containing 2 digits"
              className="mb-4"
              // inputProps={{
              //   minLength: 8,
              //   pattern: '.*[0-9].*[0-9].*',
              // }}
            />
          </div>

          {/* File Uploads */}
          <div>
            <label className="block text-sm font-semibold mb-2">Degree (PDF)</label>
            <input
              type="file"
              accept=".pdf"
              name="degree"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Recommendation Letter (PDF)</label>
            <input
              type="file"
              accept=".pdf"
              name="recommendationLetter"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-between gap-4 mt-6">
            <Button variant="outlined" color="secondary" href="/" fullWidth>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
            </Button>
          </div>
        </form>
      </div>

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

export default MakeDoc;
