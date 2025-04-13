import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, CircularProgress, Snackbar } from '@mui/material';
import Header from './components/header';
import './App.css';
import { useParams } from 'react-router-dom';

const DiagnosisTextArea = ({ value, onChange }) => (
  <Box sx={{ marginBottom: 3 }}>
    <Typography variant="h6">Diagnosis</Typography>
    <TextField
      label="Enter Diagnosis"
      variant="outlined"
      multiline
      // rows={4}
      value={value}
      onChange={onChange}
      fullWidth
      required
    />
  </Box>
);

const PrescriptionTextArea = ({ value, onChange }) => (
  <Box sx={{ marginBottom: 3 }}>
    <Typography variant="h6">Prescription</Typography>
    <TextField
      label="Enter Prescription"
      variant="outlined"
      multiline
      rows={4}
      value={value}
      onChange={onChange}
      fullWidth
      required
    />
  </Box>
);

const Diagnose = ({ match }) => {
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const {id} = useParams();

  const handleDiagnosisChange = (e) => setDiagnosis(e.target.value);
  const handlePrescriptionChange = (e) => setPrescription(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch(`http://localhost:3001/diagnose?diagnosis=${diagnosis}&prescription=${prescription}&id=${id}`);
      setLoading(false);
      setSnackbarOpen(true); // Show success message
    } catch (error) {
      setLoading(false);
      alert('Error submitting diagnosis.');
    }
  };

  return (
    <div>
      <Header />
      <Box sx={{ marginTop: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Submit Diagnosis</Typography>

        <form onSubmit={handleSubmit}>
          <DiagnosisTextArea value={diagnosis} onChange={handleDiagnosisChange} />
          <PrescriptionTextArea value={prescription} onChange={handlePrescriptionChange} />

          <Box sx={{ marginTop: 2 }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
              // sx={{ width: '100%' }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Diagnosis'}
            </Button>
          </Box>
        </form>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Diagnosis Submitted!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </div>
  );
};

export default Diagnose;
