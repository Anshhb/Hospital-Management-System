
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Heading,
  Grommet,
  FormField,
  Form,
  TextInput,
  Spinner,
  Text,
} from 'grommet';
import './App.css';
import Header from './components/header';


const ViewMedHist = () => {
  const [allPatients, setAllPatients] = useState([]); // Store all patients data
  const [filteredPatients, setFilteredPatients] = useState([]); // Store filtered patients based on search
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all patients data when component mounts
  useEffect(() => {
    setLoading(true); // Show loading spinner
    fetch('http://localhost:3001/MedHistView?name=&variable=words') // Empty name fetches all patients
      .then((res) => res.json())
      .then((res) => {
        setAllPatients(res.data);
        setFilteredPatients(res.data); // Initially, show all patients
        setLoading(false); // Hide loading spinner after data is fetched
      });
  }, []);

  // Handle search and filter the patients based on the search term
  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value === '') {
      setFilteredPatients(allPatients); // If search term is empty, show all patients
    } else {
      setFilteredPatients(
        allPatients.filter((patient) =>
          patient.Name.toLowerCase().includes(value.toLowerCase()) ||
          patient.email.toLowerCase().includes(value.toLowerCase()) // Search by Name or Email
        )
      );
    }
  };

  const Body = () => (
    <div className="container" style={{ width: "100vw" }}>
      <div className="panel panel-default p50 uth-panel">
        {filteredPatients.length === 0 ? (
          <Box align="center" pad="large">
            <Text size="large">No data found for the search term.</Text>
          </Box>
        ) : (
          <Box
            direction="column"
            gap="medium"
            pad="medium"
            background="light-1"
            round="small"
            elevation="small"
            width="100%"
          >
            {filteredPatients.map((patient) => (
              <Box
                key={patient.id}
                direction="row"
                align="center"
                justify="between"
                background="light-2"
                pad="small"
                round="small"
                margin={{ bottom: 'small' }}
                elevation="small"
                hoverIndicator
                style={{ transition: '0.3s' }}
              >
                <Box width="50%">
                  <Text weight="bold" size="medium">{patient.Name}</Text>
                </Box>
                <Box width="50%" align="end">
                  <Button
                    label="View Medical Profile"
                    href={`/ViewOneHistory/${patient.email}`}
                    primary
                    color="#ff6f61"
                    style={{ width: 'auto' }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </div>
    </div>
  );

  return (
    <div className='flex flex-col items-center justify-center h-screen'> 
      <Header />
      <Box fill={true} align="center" pad="large">
        <Heading level={2} textAlign="center" margin="small" color="brand">
          View Medical History
        </Heading>
        <Form
          onSubmit={({ value }) => handleSearch(value.email)} // Trigger search on form submission
        >
          <FormField label="Search by Name or Email" name="email" htmlFor="email" align="center">
            <TextInput
              id="email"
              name="email"
              placeholder="Enter email or name to search"
              onChange={(event) => handleSearch(event.target.value)}
              value={searchTerm}
            />
          </FormField>
          <Box direction="row" justify="center" gap="medium">
            <Button type="submit" primary label="Search" color="accent" />
          </Box>
        </Form>
        <Box margin="large">
          {loading ? (
            <Box align="center">
              <Spinner size="large" />
            </Box>
          ) : (
            <Body />
          )}
        </Box>
      </Box>
          </div>
  );
};

export default ViewMedHist;
