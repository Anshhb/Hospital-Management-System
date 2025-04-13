import React, { useState } from 'react';

import './App.css';
import Header from './components/header';
import Sidebar from './components/sidebar';
import Content from './components/content';



const Home = () => {
  return (

    <div className='h-screen w-screen flex flex-col '>
      <Header />
      <div className='flex flex-row justify-start h-screen items-center'>
        <Sidebar />
      
          <Content />
        
      </div>





    </div>

  );
};

export default Home;
