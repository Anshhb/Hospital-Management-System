import React, { useEffect, useState } from "react";
import Maps from "../Maps"
import ReactMarkdown from 'react-markdown';
export default function Content() {
    const [user, setUser] = useState();
    useEffect(()=>{
      fetch("http://localhost:3001/userInSession")
        .then(res => res.json())
        .then(res => {
        let string_json = JSON.stringify(res);
        let email_json = JSON.parse(string_json);
        let email = email_json.email;
        let who = email_json.who;
        let name=email_json.name;
        console.log(string_json);
        if(email != ""){
         setUser(name);
        }
        else
        window.location = "/login";
      });
    }, [])
    const [isVisible,setIsVisible]=React.useState(false);
    const [question,setQuestion]=React.useState("");
    const [response,setResponse]=React.useState(null);
    const [pressed,setPressed]=React.useState(false);
   async function handleSubmitQuestion(){
      // const data = question;
    setPressed(true);
      try {
        const response = await fetch("http://localhost:3001/submitQuestion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: question }),
        });
    
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
    
        // Parse the response data as JSON
        const data = await response.text();
      
        // Handle possible non-string responses
        // const markdownContent = typeof data === "string" ? data : JSON.stringify(data);
        // if(data.length>0)
        setResponse(data);
    
        // Do something with storedData
      } catch (error) {
        console.error("Error:", error);
      }
    }

    return (
        <div className='flex flex-col justify-center items-center w-full'>
            <h1 className='text-4xl font-bold text-slate-800'>Welcome to HMS</h1>
            <p className='text-2xl font-bold text-slate-800'>
               
               User : {user}
            </p>
            <div className="m-2 flex flex-row gap-10">
              <input type="text" placeholder="Ask a Question" className="p-2 bg-blue-300 text-white rounded-sm" onChange={(e)=>setQuestion(e.target.value)} onKeyDown={(e)=>{if(e.key=="Enter") handleSubmitQuestion()}}/>
              <button className="p-2 bg-blue-500 text-white rounded-sm" onClick={handleSubmitQuestion}>Submit</button>
            </div>
            {response!=null && response!='' && typeof response === 'string' && <div className=' p-4 bg-slate-600 text-white rounded-sm m-3'>
             Response:<ReactMarkdown>{response}</ReactMarkdown>
            </div> }
            
            {pressed && response ==null && <div>
                Generating Response
              </div>}
            <button onClick={()=>setIsVisible(!isVisible)} className="p-2 bg-blue-500 text-white rounded-sm">{isVisible?"Hide":"Show"} Nearby Hospitals</button>
            {isVisible && <Maps key={isVisible ? "show" : "hide"} />}
        </div>
    );
}