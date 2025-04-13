// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Box,
//   Button,
//   Heading,
//   Grommet,
//   FormField,
//   Form,
//   CheckBox,
// } from 'grommet';
// import './App.css';
// import Header from './components/header';
// const theme = {
//   global: {
//     colors: {
//       brand: '#000000',
//       focus: "#000000",
//       active: "#000000",
//     },
//     font: {
//       family: 'Lato',
//     },
//   },
// };



// const LogIn = () => {
//   const [isDoctor, setIsDoctor] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = ({ value }) => {
//     console.log("Submit", value);
//     if (value.isDoc === true) {
//       fetch(`http://localhost:3001/checkDoclogin?email=${value.email}&password=${value.password}`)
//         .then(res => res.json())
//         .then(res => {
//           if (res.data.length === 0) {
//             window.alert("Invalid Log In");
//           } else {
//             navigate("/DocHome");
//             console.log(res.data);
//           }
//         });
//     } else {
//       fetch(`http://localhost:3001/checklogin?email=${value.email}&password=${value.password}`)
//         .then(res => res.json())
//         .then(res => {
//           if (res.data.length === 0) {
//             window.alert("Invalid Log In");
//           } else {
//             navigate("/Home");
//             console.log(res.data);
//           }
//         });
//     }
//   };
//   // useEffect(()=>{
//   //   fetch("http://localhost:3001/userInSession")
//   //     .then(res => res.json())
//   //     .then(res => {
//   //     let string_json = JSON.stringify(res);
//   //     let email_json = JSON.parse(string_json);
//   //     let email = email_json.email;
//   //     let who = email_json.who;
//   //     if(email != ""){
//   //       window.location="/"
//   //     }
//   //   });
//   // }, [])

//   return (
//     <Grommet theme={theme} full>
//       <Header/>

//       <Box fill align="center" justify="top" pad="medium">
//         <Box width="medium" pad="medium">
//           <Form
//             onReset={event => console.log(event)}
//             onSubmit={handleSubmit}
//           >
//             <FormField
//               color="#00739D"
//               label="Email"
//               name="email"
//               type="email"
//               placeholder="Please enter your email."
//               required
//             />
//             <FormField
//               color="#00739D"
//               type='password'
//               label="Password"
//               name="password"
//               placeholder="Please enter your password."
//               required
//             />
//             <FormField
//               component={CheckBox}
//               checked={isDoctor}
//               margin="large"
//               label="I'm a doctor"
//               name="isDoc"
//               onChange={(event) => setIsDoctor(event.target.checked)}
//             />
//             <Box direction="column" align="center">
//               <Button
//                 style={{ textAlign: 'center', margin: '1rem' }}
//                 type="submit"
//                 label="Log In"
//                 fill="horizontal"
//                 primary
//               />
//               <Button
//                 label="Create Account"
//                 style={{ textAlign: 'center', margin: '0.5rem' }}
//                 fill="horizontal"
//                 href="/createAcc"
//               />
//             </Box>
//           </Form>
//         </Box>
//       </Box>
//     </Grommet>
//   );
// };

// export default LogIn;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Checkbox, FormControlLabel, Typography, Container, Alert } from '@mui/material';
import Header from './components/header';
import './App.css';

const LogIn = () => {
  const [isDoctor, setIsDoctor] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    const loginEndpoint = isDoctor
      ? `http://localhost:3001/checkDoclogin?email=${email}&password=${password}`
      : `http://localhost:3001/checklogin?email=${email}&password=${password}`;

    fetch(loginEndpoint)
      .then(res => res.json())
      .then(res => {
        if (res.data.length === 0) {
          setError("Invalid Login credentials.");
        } else {
          setError('');
          navigate(isDoctor ? "/DocHome" : "/Home");
        }
      })
      .catch(err => {
        setError("An error occurred. Please try again.");
      });
  };

  return (
    <div className='flex flex-col  justify-center w-screen'>
      <Header />
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 4,
        padding: 3,
        
        backgroundColor: '#f4f6f8',
        borderRadius: 3,
        boxShadow: 3
      }}>
        <Typography variant="h4" gutterBottom>Log In</Typography>
        {error && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Box sx={{ marginBottom: 2 }}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              type="email"
              autoComplete="email"
              autoFocus
            />
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              type="password"
              autoComplete="current-password"
            />
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isDoctor}
                  onChange={(e) => setIsDoctor(e.target.checked)}
                  color="primary"
                />
              }
              label="I'm a doctor"
            />
          </Box>
          <div className='flex flex-col items-center justify-center'>
            <Button type="submit" variant="contained" color="primary"  sx={{ marginBottom: 2 }}>
              Log In
            </Button>
          </div>
          <div className='flex flex-col items-center justify-center'>

            <Button variant="outlined" color="primary"  sx={{ marginTop: 1 }} href="/createAcc">
              Create Account
            </Button>
          
          </div>
        </form>
      </Box>
    </div>
  );
};

export default LogIn;
