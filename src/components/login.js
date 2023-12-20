import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import './login.css';
import { Navigation } from "./Navigation";

function Login() {
  const { login, setUserData } = useAuth(); // Destructure setUserData from the context
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // To display messages to the user
  const [userType,setUserType] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(""); // Clear previous messages
    // Simple validation
    if (!email || !password) {
      setMessage("Email and password are required");
      return;
    }

    try {
      const apiEndpoint = userType === 'doctor' ? 'http://localhost:3000/login-doctor' : 'http://localhost:3000/login-patient';
  
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email, password: password }) // Corrected payload
      });
  
      const data = await response.json(); // Always parse the response
  
      // Check if login is successful by inspecting the response data
      if (data.message && data.message === "Invalid Credentials") {
        setMessage("Invalid Credentials"); // Set error message
      } else {
        login(data); // Assuming valid data is returned on successful login
  
        // Navigate to the appropriate dashboard based on user type
        if (userType === "patient") {
          navigate('/patient-dashboard');
        } else if (userType === "doctor") {
          navigate('/doctor-dashboard');
        }
      }
    } catch (error) {
      console.error("Error during Login", error);
      setMessage("An error occurred during Login");
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
        <h3>Sign in here</h3>
        {message && <div className="error-message">{message}</div>}
        <form onSubmit={handleSubmit}>
        <select className="buttonSpace" 
          value={userType} onChange={(e) => setUserType(e.target.value)}>
          <option value="" disabled selected>
          Select User Type
          </option>
          <option value="doctor">Doctor</option>
          <option value="patient">Patient</option>
          </select>
          <div className="inputBox">
            <input   
              id="uname"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Username" disabled={!userType}/>
            <input 
              id="pass"  
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Password" disabled={!userType}/>
          </div>
          <input type="submit" name="" value="Login" />
        </form>
        {/* <a href="#">Forget Password<br /></a> */}
        <div className="text-center">
          {/* <p style={{ color: '#59238F' }}>Sign-Up</p> */}
        </div>
      </div>
      </div>
    );
    
    
    
    
    
    
    <div className='container'>
    <form className='format2' onSubmit={handleSubmit}>
      <h2>Login</h2>
      {message && <div>{message}</div>} {/* Display messages to the user */}
      <div>
      <label className='inputField'>
        {/* Email: */}
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
      </label>
      </div>
      <div>
      <label className='inputField'>
        {/* Password: */}
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
      </label>
      </div>
      <button type="submit">Login</button>
    </form>
    </div>
  // );
}

export default Login;
