import React from 'react';
import './index.css';
import { Box, Heading, Text, Button, TextInput, Form, FormField, Anchor } from 'grommet';
import Header from './components/header';

export default function ContactUs() {
  return (
    <div style={{ backgroundColor: '#f7f7f7', minHeight: '100vh',minWidth:'100vw',margin:'0' }}>
      <Header />
      <Box
        direction="column"
        justify="center"
        align="center"
        pad="large"
        background="linear-gradient(to right, #ff7f50, #ff6347)"
        round="small"
        margin={{ top: 'medium' }}
        width="80%"
        style={{ maxWidth: '90%', margin: '0 auto' }}
      >
        <Heading level={2} textAlign="center" margin="small" color="white">
          Contact Us
        </Heading>

        <Text color="white" textAlign="center" size="large" margin={{ bottom: 'small' }}>
          We'd love to hear from you! Reach out for any inquiries, feedback, or support.
        </Text>

        <Box align="center" width="100%" margin={{ bottom: 'large' }}>
          <Heading level={4} color="white">
            Call Us at: <Text color="white">+91 8604479569</Text>
          </Heading>
          <div className='text-white  text-2xl font-bold'>
            <h4>Email Us at: <a href="mailto:b22cs006@iitj.ac.in">b22cs006@iitj.ac.in</a> or <a href="mailto:b22cs040@iitj.ac.in">b22cs040@iitj.ac.in</a></h4>
          </div>
         
        </Box>

        

        <Box direction="row" justify="center" margin={{ top: 'large' }}>
          <Anchor
            href="https://docs.google.com/forms/d/1axv9AVgpXDP7dcpdvI_Y-0ZFvb1b-4AJcxyzOMb_CrQ/edit?ts=67320ede"
            label="Fill Out a Form"
            size="large"
            color="white"
            style={{ textDecoration: 'underline' }}
          />
        </Box>
      </Box>
    </div>
  );
}
