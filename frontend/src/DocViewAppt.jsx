// import React, { useState, useEffect } from 'react';
// import {
//     Box,
//     Button,
//     Heading,
//     Grommet,
// } from 'grommet';
// import './App.css';
// import Header from './components/header';

// const theme = {
//     global: {
//         colors: {
//             brand: '#000000',
//             focus: '#000000',
//         },
//         font: {
//             family: 'Lato',
//         },
//     },
// };

// const DocViewAppt = () => {
//     const [apptlist, setApptlist] = useState([]);

//     useEffect(() => {
//         getNames();
//     }, []);

//     const getNames = () => {
//         fetch('http://localhost:3001/doctorViewAppt')
//             .then(res => res.json())
//             .then(res => setApptlist(res.data));
//     };

  

//     const Body = () => (
//         <div className="container">
//             <div className="panel panel-default p50 uth-panel">
//                 <table className="table table-hover">
//                     <thead>
//                         <tr>
//                             <th>ID</th>
//                             <th>Name</th>
//                             <th>Date</th>
//                             <th>Start Time</th>
//                             <th>Concerns</th>
//                             <th>Symptoms</th>
//                             <th>Status</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {apptlist.map(appt => (
//                             <tr key={appt.name}>
//                                 <td>{appt.id}</td>
//                                 <td>{appt.name}</td>
//                                 <td>{new Date(appt.date).toLocaleDateString().substring(0, 10)}</td>
//                                 <td>{appt.starttime}</td>
//                                 <td>{appt.concerns}</td>
//                                 <td>{appt.symptoms}</td>
//                                 <td>{appt.status}</td>
//                                 <td>
//                                     <Button label="Diagnose" href={`/Diagnose/${appt.id}`} />
//                                 </td>
//                                 <td>
//                                     {appt.status === "NotDone" && (
//                                         <Button
//                                             label="Cancel"
//                                             onClick={() => {
//                                                 fetch('http://localhost:3001/deleteAppt?uid=' + appt.id);
//                                                 window.location.reload();
//                                             }}
//                                         />
//                                     )}
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );

//     return (
//         <Grommet full={true} theme={theme}>
//             <Header />
//             <Box fill={true}>
//                 <Body />
//             </Box>
//         </Grommet>
//     );
// };

// export default DocViewAppt;
import React, { useState, useEffect } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, CircularProgress } from '@mui/material';
import Header from './components/header';
import './App.css';

const DocViewAppt = () => {
    const [apptlist, setApptlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getAppointments();
    }, []);

    const getAppointments = () => {
        fetch('http://localhost:3001/doctorViewAppt')
            .then(res => res.json())
            .then(res => {
                setApptlist(res.data);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to load appointments');
                setLoading(false);
            });
    };

    const handleCancel = (id) => {
        fetch('http://localhost:3001/deleteAppt?uid=' + id)
            .then(() => {
                // Remove the cancelled appointment from the state
                setApptlist(apptlist.filter(appt => appt.id !== id));
            })
            .catch(err => setError('Failed to cancel the appointment'));
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Header />
            <Typography variant="h4" gutterBottom>Doctor's Appointment View</Typography>

            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <TableContainer component={Paper} sx={{ width: '90%' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Start Time</TableCell>
                                <TableCell>Concerns</TableCell>
                                <TableCell>Symptoms</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {apptlist.map(appt => (
                                <TableRow key={appt.id}>
                                    <TableCell>{appt.id}</TableCell>
                                    <TableCell>{appt.name}</TableCell>
                                    <TableCell>{new Date(appt.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{appt.starttime}</TableCell>
                                    <TableCell>{appt.concerns}</TableCell>
                                    <TableCell>{appt.symptoms}</TableCell>
                                    <TableCell>{appt.status}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" href={`/Diagnose/${appt.id}`} sx={{ marginRight: 1 }}>
                                            Diagnose
                                        </Button>
                                        {appt.status === 'NotDone' && (
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                onClick={() => handleCancel(appt.id)}
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default DocViewAppt;
