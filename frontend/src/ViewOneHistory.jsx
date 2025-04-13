import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Table, TableBody, TableCell, TableRow } from '@mui/material';
import './App.css';
import Header from './components/header';

const ViewOneHistory = () => {
    const { email } = useParams();
    const [medhiststate, setMedhiststate] = useState([]);
    const [medhiststate2, setMedhiststate2] = useState([]);

    useEffect(() => {
        getHistory(email);
        allDiagnoses(email);
    }, [email]);

    const getHistory = (value) => {
        let patientEmail = "'" + value + "'";
        fetch(`http://localhost:3001/OneHistory?patientEmail=${patientEmail}`)
            .then(res => res.json())
            .then(res => setMedhiststate(res.data));
    };

    const allDiagnoses = (value) => {
        let patientEmail = "'" + value + "'";
        fetch(`http://localhost:3001/allDiagnoses?patientEmail=${patientEmail}`)
            .then(res => res.json())
            .then(res => setMedhiststate2(res.data));
    };

   
    const Body = () => (
        <div className="container m-0 p-0">
            <div className="panel panel-default p50 uth-panel">
                {medhiststate.map(patient => (
                    <Table key={patient.email}>
                        <TableBody>
                            <TableRow>
                                <TableCell scope="row">
                                    <strong>Name</strong>
                                </TableCell>
                                <TableCell>{patient.name}</TableCell>
                                <TableCell />
                                <TableCell>
                                    <strong>Email</strong>
                                </TableCell>
                                <TableCell>{patient.email}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell scope="row">
                                    <strong>Gender</strong>
                                </TableCell>
                                <TableCell>{patient.gender}</TableCell>
                                <TableCell />
                                <TableCell>
                                    <strong>Address</strong>
                                </TableCell>
                                <TableCell>{patient.address}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell scope="row" />
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <strong>Conditions</strong>
                                </TableCell>
                                <TableCell>{patient.conditions}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell scope="row" />
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <strong>Surgeries</strong>
                                </TableCell>
                                <TableCell>{patient.surgeries}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell scope="row" />
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <strong>Medications</strong>
                                </TableCell>
                                <TableCell>{patient.medication}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                ))}
            </div>
            <hr />
        </div>
    );

    const Body2 = () => (
        <div className="container m-0 p-0">
            <div className="panel panel-default p50 uth-panel">
                {medhiststate2.map(patient => (
                    <div key={patient.date}>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell scope="row">
                                        <strong>Date</strong>
                                    </TableCell>
                                    <TableCell>{patient.date.split('T')[0]}</TableCell>
                                    <TableCell />
                                    <TableCell>
                                        <strong>Doctor</strong>
                                    </TableCell>
                                    <TableCell>{patient.doctor}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell scope="row">
                                        <strong>Concerns</strong>
                                    </TableCell>
                                    <TableCell>{patient.concerns}</TableCell>
                                    <TableCell />
                                    <TableCell>
                                        <strong>Symptoms</strong>
                                    </TableCell>
                                    <TableCell>{patient.symptoms}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell scope="row" />
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <strong>Diagnosis</strong>
                                    </TableCell>
                                    <TableCell>{patient.diagnosis}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell scope="row" />
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <strong>Prescription</strong>
                                    </TableCell>
                                    <TableCell>{patient.prescription}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell scope="row" />
                                </TableRow>
                            </TableBody>
                        </Table>
                        <hr />
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className=' flex flex-col overflow-x-auto '>

            <Header />
            <Body />
            <Body2 />
        
        </div>
    );
};

export default ViewOneHistory;
