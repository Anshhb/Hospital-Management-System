// import React, { useState, useEffect } from 'react';
// import {
//     Box,
//     Heading,
//     Grommet,
//     Button
// } from 'grommet';
// import './App.css';
// import Header from './components/header';

// const theme = {
//     global: {
//         colors: {
//             brand: '#000000',
//             focus: "#000000",
//             active: "#000000",
//         },
//         font: {
//             family: 'Lato',
//         },
//     },
// };

// const AppBar = (props) => (
//     <Box
//         tag='header'
//         direction='row'
//         align='center'
//         justify='between'
//         background='brand'
//         pad={{ left: 'medium', right: 'small', vertical: 'small' }}
//         style={{ zIndex: '1' }}
//         {...props} />
// );

// const PatientsViewAppointments = () => {
//     const [appointmentsState, setAppointmentsState] = useState([]);

//     useEffect(() => {
//         getNames("");
//     }, []);

//     const getNames = (value) => {
//         let patName = value;
//         console.log(patName);
//         fetch("http://localhost:3001/userInSession")
//             .then(res => res.json())
//             .then(res => {
//                 const email_in_use = res.email;
//                 fetch('http://localhost:3001/patientViewAppt?email=' + email_in_use)
//                     .then(res => res.json())
//                     .then(res => {
//                         setAppointmentsState(res.data);
//                     });
//             });
//     };

//     const Body = () => (
//         <div className="container">
//             <div className="panel panel-default p50 uth-panel">
//                 <table className="table table-hover">
//                     <thead>
//                         <tr>
//                             <th>Date of Appointment</th>
//                             <th>Start Time</th>
//                             <th>End Time</th>
//                             <th>Concerns</th>
//                             <th>Symptoms</th>
//                             <th>Status</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {appointmentsState.map(patient => (
//                             <tr key={patient.user}>
//                                 <td align="center">
//                                     {new Date(patient.theDate).toLocaleDateString().substring(0, 10)}
//                                 </td>
//                                 <td align="center">{patient.theStart.substring(0, 5)}</td>
//                                 <td align="center">{patient.theEnd.substring(0, 5)}</td>
//                                 <td align="center">{patient.theConcerns}</td>
//                                 <td align="center">{patient.theSymptoms}</td>
//                                 <td align="center">{patient.status}</td>
//                                 <td>
//                                     <Button label="See Diagnosis" href={`/showDiagnoses/${patient.ID}`} />
//                                 </td>
//                                 <td>
//                                     {patient.status === "NotDone" ?
//                                         <Button
//                                             label="Cancel"
//                                             onClick={() => {
//                                                 fetch('http://localhost:3001/deleteAppt?uid=' + patient.ID);
//                                                 window.location.reload();
//                                             }}
//                                         />
//                                         :
//                                         <Button
//                                             label="Delete"
//                                             onClick={() => {
//                                                 fetch('http://localhost:3001/deleteAppt?uid=' + patient.ID);
//                                                 window.location.reload();
//                                             }}
//                                         />
//                                     }
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );

//     return (
//         <Grommet theme={theme} full>
//             <Box>
//                 <Header />
//                 <Body />
//             </Box>
//         </Grommet>
//     );
// };

// export default PatientsViewAppointments;
import React, { useState, useEffect } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography } from '@mui/material';
import './App.css';
import Header from './components/header';

const theme = {
    global: {
        colors: {
            brand: '#000000',
            focus: "#000000",
            active: "#000000",
        },
        font: {
            family: 'Lato',
        },
    },
};

const PatientsViewAppointments = () => {
    const [appointmentsState, setAppointmentsState] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getNames("");
    }, []);

    const getNames = (value) => {
        let patName = value;
        console.log(patName);
        fetch("http://localhost:3001/userInSession")
            .then(res => res.json())
            .then(res => {
                const email_in_use = res.email;
                fetch('http://localhost:3001/patientViewAppt?email=' + email_in_use)
                    .then(res => res.json())
                    .then(res => {
                        setAppointmentsState(res.data);
                        setLoading(false);
                    });
            });
    };

    return (
        <Box>
            <Header />
            <Box sx={{ margin: 3 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="appointments table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center"><strong>Date of Appointment</strong></TableCell>
                                    <TableCell align="center"><strong>Start Time</strong></TableCell>
                                    <TableCell align="center"><strong>End Time</strong></TableCell>
                                    <TableCell align="center"><strong>Concerns</strong></TableCell>
                                    <TableCell align="center"><strong>Symptoms</strong></TableCell>
                                    <TableCell align="center"><strong>Status</strong></TableCell>
                                    <TableCell align="center"><strong>Actions</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {appointmentsState.map(patient => (
                                    <TableRow key={patient.user}>
                                        <TableCell align="center">{new Date(patient.theDate).toLocaleDateString().substring(0, 10)}</TableCell>
                                        <TableCell align="center">{patient.theStart.substring(0, 5)}</TableCell>
                                        <TableCell align="center">{patient.theEnd.substring(0, 5)}</TableCell>
                                        <TableCell align="center">{patient.theConcerns}</TableCell>
                                        <TableCell align="center">{patient.theSymptoms}</TableCell>
                                        <TableCell align="center">{patient.status}</TableCell>
                                        <TableCell align="center">
                                            <Button variant="outlined" color="primary" href={`/showDiagnoses/${patient.ID}`} sx={{ marginRight: 1 }}>
                                                See Diagnosis
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color={patient.status === "NotDone" ? "primary" : "error"}
                                                onClick={() => {
                                                    fetch('http://localhost:3001/deleteAppt?uid=' + patient.ID);
                                                    window.location.reload();
                                                }}
                                            >
                                                {patient.status === "NotDone" ? "Cancel" : "Delete"}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </Box>
    );
};

export default PatientsViewAppointments;
