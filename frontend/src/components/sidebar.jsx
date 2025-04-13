import React, { useState } from "react";

export default function Sidebar() {

    const [active, setActive] = useState();

  const handleSidebarClick = (label) => {
    if (label === "Schedule Appointment") {
      window.location = "/scheduleAppt";
    } else if (label === "Sign Out") {
      fetch("http://localhost:3001/endSession");
      window.location = "/";
    } else if (label === "View Appointments") {
      window.location = "/PatientsViewAppt";
    } else if (label === "View Medical History") {
      fetch("http://localhost:3001/userInSession")
        .then(res => res.json())
        .then(res => {
          const email_in_use = res.email;
          console.log("Email In Use Is :" + email_in_use);
          window.location = "/ViewOneHistory/" + email_in_use;
        });
    } else if (label === "Settings") {
      window.location = "/Settings";
    }
    setActive(label);
}
    return (
      
        <div className="h-full p-5 bg-blue-400 items-center">
        
            <ul className='flex flex-col justify-around  h-full font-medium text-white text-center  items-center'>
                <li className='rounded-sm bg-blue-400  hover:bg-blue-300 p-2  cursor-pointer'   onClick={()=>handleSidebarClick('Home')} >Home</li>
                <li className='rounded-sm bg-blue-400  hover:bg-blue-300 p-2  cursor-pointer'   onClick={()=>handleSidebarClick('Schedule Appointment')} >Schedule Appointment</li>
                <li className='rounded-sm bg-blue-400  hover:bg-blue-300 p-2  cursor-pointer'   onClick={()=>handleSidebarClick('View Appointments')} >View Appointments</li>
                <li className='rounded-sm bg-blue-400  hover:bg-blue-300 p-2  cursor-pointer'   onClick={()=>handleSidebarClick('View Medical History')} >View Medical History</li>
                <li className='rounded-sm bg-blue-400  hover:bg-blue-300 p-2  cursor-pointer'   onClick={()=>handleSidebarClick('Settings')} >Settings</li>
                <li className='rounded-sm bg-blue-400  hover:bg-blue-300 p-2  cursor-pointer'   onClick={()=>handleSidebarClick('Sign Out')} >Sign Out</li>
            </ul>
            
        
        
        </div>
   
    );
}