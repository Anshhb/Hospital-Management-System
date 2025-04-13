// import React, { useState, useEffect } from 'react';
// import {
//     Box,
//     Heading,
//     Grommet,
//     Table,
//     TableBody,
//     TableCell,
//     TableRow,
// } from 'grommet';
// import './App.css';
// import Header from './components/header';
// import { useParams } from 'react-router-dom';


// const ShowDiagnoses = ({ match }) => {
//     const [diagnoses, setDiagnoses] = useState([]);
//     const { id } = useParams(); 

//     useEffect(() => {
//         console.log("Fetching Data");
//         fetch(`http://localhost:3001/showDiagnoses?id=${id}`)
//             .then((res) => res.json())
//             .then((res) => setDiagnoses(res.data));
//     }, [id]);

    

//     const Body = () => (
//         <div className="container">
//             <div className="panel panel-default p50 uth-panel">
//                 {diagnoses.map((diagnosis) => (
//                     <Table key={diagnosis.appt}>
//                         <TableBody>
//                             <TableRow>
//                                 <TableCell scope="row">
//                                     <strong>Appointment Id</strong>
//                                 </TableCell>
//                                 <TableCell>{diagnosis.appt}</TableCell>
//                             </TableRow>
//                             <br />
//                             <TableRow>
//                                 <TableCell scope="row">
//                                     <strong>Doctor</strong>
//                                 </TableCell>
//                                 <TableCell>{diagnosis.doctor}</TableCell>
//                             </TableRow>
//                             <br />
//                             <TableRow>
//                                 <TableCell scope="row">
//                                     <strong>Diagnosis</strong>
//                                 </TableCell>
//                                 <TableCell>{diagnosis.diagnosis}</TableCell>
//                             </TableRow>
//                             <br />
//                             <TableRow>
//                                 <TableCell scope="row">
//                                     <strong>Prescription</strong>
//                                 </TableCell>
//                                 <TableCell>{diagnosis.prescription}</TableCell>
//                             </TableRow>
//                         </TableBody>
//                     </Table>
//                 ))}
//             </div>
//             <hr />
//         </div>
//     );

//     return (
//         <div>
//                 <Header />
//                 <Body />
//         </div>
//     );
// };

// export default ShowDiagnoses;
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, Button, Card, CardContent } from '@mui/material';
import './App.css';
import Header from './components/header';

const ShowDiagnoses = () => {
  const { id } = useParams();
  const [diagnoses, setDiagnoses] = useState([]);

  useEffect(() => {
    console.log('Fetching Data');
    fetch(`http://localhost:3001/showDiagnoses?id=${id}`)
      .then((res) => res.json())
      .then((res) => setDiagnoses(res.data));
  }, [id]);

  return (
    <div className="h-screen bg-gray-100 w-screen">
      <Header />
      
      <div className="container mx-auto ">
        <Typography variant="h4" component="h1" gutterBottom>
          Diagnoses for Appointment ID: {id}
        </Typography>
        
        {/* Render each diagnosis inside a Card */}
        {diagnoses.map((diagnosis) => (
          <Card key={diagnosis.appt} className="mb-6">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Appointment Details
              </Typography>
              
              <Table component={Paper} aria-label="diagnosis table">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Field</strong></TableCell>
                    <TableCell><strong>Details</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell><strong>Appointment Id</strong></TableCell>
                    <TableCell>{diagnosis.appt}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Doctor</strong></TableCell>
                    <TableCell>{diagnosis.doctor}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Diagnosis</strong></TableCell>
                    <TableCell>{diagnosis.diagnosis}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Prescription</strong></TableCell>
                    <TableCell>{diagnosis.prescription}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="mt-4 flex justify-between">
                <Button variant="contained" color="primary" href={`/showDiagnoses/${diagnosis.appt}`}>
                  View More
                </Button>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={() => {
                    fetch(`http://localhost:3001/deleteAppt?uid=${diagnosis.appt}`);
                    window.location.reload();
                  }}
                >
                  Delete Appointment
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ShowDiagnoses;
