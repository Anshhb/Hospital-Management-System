import React,{useEffect, useState} from "react";
import {
  BrowserRouter ,
  Route,
  Routes
} from "react-router-dom";
import Home from './Home';
import LogIn from './logIn.jsx';
import CreateAccount from './CreateAccount.jsx';
import SchedulingAppt from './schedulingAppt.jsx';
import ViewMedHist from './ViewMedHist.jsx';
import DocHome from './DocHome.jsx';
import ViewOneHistory from './ViewOneHistory.jsx';
import Settings from './Settings.jsx';
import DocSettings from './DocSettings.jsx';
import PatientsViewAppt from './PatientsViewAppt.jsx';
import NoMedHistFound from './NoMedHistFound.jsx';
import DocViewAppt from './DocViewAppt.jsx';
import MakeDoc from './MakeDoc.jsx';
import Diagnose from './Diagnose.jsx';
import ShowDiagnoses from './ShowDiagnoses.jsx';
import ContactUs from "./ContactUs.jsx";
import SeeDocs from "./SeeDocs.jsx";
export default function App() {
  let [component, setComponent] = useState(<LogIn />)
  useEffect(()=>{
    fetch("http://localhost:3001/userInSession")
      .then(res => res.json())
      .then(res => {
      let string_json = JSON.stringify(res);
      let email_json = JSON.parse(string_json);
      let email = email_json.email;
      let who = email_json.who;
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
  }, [])
  return (
    <BrowserRouter>
      
        <Routes>
          <Route path="/NoMedHistFound" element={<NoMedHistFound />}/>
            
        
          <Route path="/MakeDoc" element={  <MakeDoc />}/>
         
          <Route path="/Settings" element={<Settings />}/>
          
          
          <Route path="/MedHistView" element={<ViewMedHist />}/>
         
          
          <Route path="/scheduleAppt" element={<SchedulingAppt />}/>
            

          <Route path="/showDiagnoses/:id" element={<ShowDiagnoses  />} />
          <Route path="/Diagnose/:id" element={<Diagnose />} />
          <Route name="onehist" path="/ViewOneHistory/:email" element={<ViewOneHistory />}/>
          <Route path="/Home" element={<Home />}/>
      
          <Route path="/createAcc" element={<CreateAccount />}/>
        
          <Route path="/DocHome" element={<DocHome />}/>
        
          <Route path="/PatientsViewAppt" element={<PatientsViewAppt />}/>
        
          <Route path="/DocSettings" element={<DocSettings />}/>
        
          <Route path="/ApptList" element={<DocViewAppt />}/>
            
          <Route path="/" element={component} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/contactUs" element={<ContactUs/>} />
          <Route path="/SeeDocs" element={<SeeDocs/>} />
          </Routes>
     
    </BrowserRouter>
  );
}