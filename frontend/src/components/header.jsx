import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ContactUs from "../ContactUs";
export default function Header() {
    const navigate=useNavigate();
    
  return (
    <div className=' w-screen bg-slate-800 h-16 flex justify-between items-center'>
    <nav className='flex flex-row justify-between w-full'>
        <ul className='flex flex-row justify-between w-full gap-20 font-medium text-white mx-10 cursor-pointer items-center'>
            <li className='rounded-sm bg-slate-500 p-1 w-20 items text-center'   onClick={()=>navigate('/')} >HMS</li>
            <li className="" onClick={()=>navigate('/contactUs')}>Contact Us</li>
        </ul>
        
      
    </nav>
    
    </div>
  );
}

