import React, { useEffect } from "react";

export default function DocSidebar() {
    const [active, setActive] = React.useState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3001/userInSession`);
                const result = await response.json();
                setActive(result.email);
            } catch (error) {
                console.error("Error fetching doctor info:", error);
            }
        };
        fetchData();
    },
        []);
    const handleSidebarClick = (label) => {
        if (label === "View Patients") {
            window.location = "/MedHistView";
        } else if (label === "Sign Out") {
            fetch("http://localhost:3001/endSession");
            window.location = "/";
        } else if (label === "Appointments") {
            window.location = "/ApptList";
        } else if (label === "Settings") {
            window.location = "/DocSettings";
        }
        else if(label === "See Documents"){
            fetch("http://localhost:3001/seeDocs?email="+active);
            window.location = "/SeeDocs";
        }
        setActive(label);
    }
    return (
        <div className="h-full p-5 bg-blue-400 items-center mr-auto w-1/4">
            <ul className='flex flex-col justify-around   font-medium text-white text-center  items-center h-full'>
                {/* <li className='rounded-sm bg-blue-400  hover:bg-blue-300 p-2  cursor-pointer'   onClick={()=>handleSidebarClick('Home')} >Home</li> */}
                <li className='rounded-sm bg-blue-400  hover:bg-blue-300 p-2  cursor-pointer'   onClick={()=>handleSidebarClick('Appointments')} >Appointments</li>
                <li className='rounded-sm bg-blue-400  hover:bg-blue-300 p-2  cursor-pointer'   onClick={()=>handleSidebarClick('View Patients')} >View Patients</li>
                {/* <li className='rounded-sm bg-blue-400  hover:bg-blue-300 p-2  cursor-pointer'   onClick={()=>handleSidebarClick('View Medical History')} >View Medical History</li> */}
                <li className='rounded-sm bg-blue-400  hover:bg-blue-300 p-2  cursor-pointer'   onClick={()=>handleSidebarClick('Settings')} >Settings</li>
                <li className='rounded-sm bg-blue-400  hover:bg-blue-300 p-2  cursor-pointer'   onClick={()=>handleSidebarClick('See Documents')} >See Documents</li>
                <li className='rounded-sm bg-blue-400  hover:bg-blue-300 p-2  cursor-pointer'   onClick={()=>handleSidebarClick('Sign Out')} >Sign Out</li>
            </ul>
        </div>
    );
}