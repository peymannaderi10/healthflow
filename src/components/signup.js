import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './login.css';

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [message, setMessage] = useState(""); // To display messages to the user


  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(""); // Clear previous messages

    // Simple validation
    if (!email || !password) {
      setMessage("Email and password are required");
      return;
    }
    if (userType === "") {
      setMessage("please select a user type");
      return;
    }
    const userData = {
      name: fullName,
      email,
      contact: phoneNumber,
      password,
      address: userType === 'patient' ? address : undefined,
      specialization: userType === 'doctor' ? specialization : undefined
    };

    try {
      // Choose API endpoint based on user type
      const apiEndpoint = userType === 'doctor' ? 'http://localhost:3000/sign-up-doctor' : 'http://localhost:3000/sign-up-patient';

      // API request to sign up the user
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const result = await response.json();

      // Handle response
      if (response.ok) {
        setMessage('Signup successful');
        navigate('/login'); // Redirect to login page
      } else {
        setMessage(result.message || 'Error occurred during sign up');
      }
    } catch (error) {
      console.error("Error during sign up", error);
      setMessage("An error occurred during sign up"); // Display error message
    }
  };

  return (

<div className="background">
<div class="area" >
                <ul class="circles">
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                </ul>
        </div >

    <div className="loginBox">

    <img className="user" src="https://i.ibb.co/yVGxFPR/2.png" height="100px" width="100px" alt="User" />
    <h3>Sign up here</h3>
    <form onSubmit={handleSubmit}>
      <div className="inputBox">
      <select className="buttonSpace" 
          value={userType} onChange={(e) => setUserType(e.target.value)}>
          <option value="" disabled selected>
          Select User Type
          </option>
          <option value="doctor">Doctor</option>
          <option value="patient">Patient</option>
          </select>

        <input   
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="full name" disabled={!userType} />

        {userType === 'patient' && (
          <input 
            value={address} 
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"  disabled={!userType}/>
        )}

        {userType === 'doctor' && (
          <input 
            value={specialization} 
            onChange={(e) => setSpecialization(e.target.value)}
            placeholder="Specialization" disabled={!userType}/>
        )}

        <input 
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="phone number" disabled={!userType}/>

        <input 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email" disabled={!userType}/>
        
        <input
            type="password"
            value={password}
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
            disabled={!userType}
          />
     
      </div>
      <input type="submit" name="" value="Sign up" disabled={!userType}/>
    </form>
    <div className="text-center">
      {/* <p style={{ color: '#59238F' }}>Sign-Up</p> */}
    </div>

  </div>
</div>
    
  );
}

export default SignUp;
