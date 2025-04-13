import React from "react";

export default function Contact() {
  return (
    <div style={{cursor: "pointer"}}
    onClick={() => window.location = "/contactUs"}>
   
      <h1>Contact Us</h1>
    </div>
  );
}