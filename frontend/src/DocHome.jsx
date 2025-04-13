import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/header';
import DocSidebar from './docSidebar';

import LogIn from './logIn';

import DocModel from './docModel';
import DoctorMod from './Doctor';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const DocHome = () => {
    const [component,setComponent]=React.useState()
    const [name, setName] = useState();
    useEffect(() => {
       fetch("http://localhost:3001/userInSession")
        .then(res => res.json())
        .then(res => {
            // console.log(res)
          let string_json = JSON.stringify(res);
          let email_json = JSON.parse(string_json);
          console.log(string_json)
          let email = email_json.email;
          let who = email_json.who;
          let name=email_json.name;
          setName(name);
          if(email === ""){
            setComponent(<LogIn />)
          }
          else{
            if(who==="pat"){
              setComponent(<Home />)
            }
            else{
              setComponent(<DocHome />)
            }
          }
        });
    }, []);

    return (
            <div className='flex flex-col justify-center items-center w-full h-screen'>

                    <Header />
                <div className='flex flex-row justify-start items-center w-full h-screen'>
                <DocSidebar />
                <div className='flex flex-col justify-center items-center w-full text-2xl  h-full'>
               <div >
                Welcome Dr. {name} 
                </div>
                {/* <div className='flex flex-col justify-center items-center w-full text-2xl'>
                  Welcome Dr. {name} */}
                <Canvas className="relative overflow-visible " style={{zIndex:1}}>
          <OrbitControls />
          
          <ambientLight intensity={1} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <DoctorMod/>
        </Canvas>
                {/* </div> */}
                </div>
                </div>

            </div>
                  
    );
};

export default DocHome;
