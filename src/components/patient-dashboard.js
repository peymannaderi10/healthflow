import React from 'react';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function PatientDashboard() {
  const { userData, setUserData} = useAuth(); // Use useAuth hook to access user data
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = () => {
    // Clear the user data from AuthContext
    setUserData({});

    // Navigate to the login page
    navigate('/login');
  };
  const handleCreateAppointment = () => {
    navigate('/patientAppointment'); // Navigate to PatientAppointment component
  };
  return (
    <div className="patient-dashboard">
      <h1>Patient Dashboard</h1>
      <div className="patient-info">
        <h2>Welcome, {userData.name}</h2>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Address:</strong> {userData.address}</p>
        <p><strong>Contact:</strong> {userData.contact}</p>
        <p><strong>Patient ID:</strong>{userData.patientid}</p>
      </div>
      <button onClick={handleCreateAppointment}>View/Create Appointments</button> {/* Create Appointment Button */}
      <div className="medical-history">
        <h3>Medical History</h3>
        <ul>
          {userData.medicalHistory && userData.medicalHistory.length > 0 ? (
            userData.medicalHistory.map((history, index) => (
              <li key={index}>
                <p><strong>Test Name:</strong> {history.testName}</p>
                <p><strong>Result:</strong> {history.testResult}</p>
                <p><strong>Date:</strong> {history.date}</p>
              </li>
            ))
          ) : (
            <p>No medical history available.</p>
          )}
        </ul>
      </div>
      <button className="btn btn-primary" onClick={handleLogout}>Logout</button> 

    </div>
  );
}

export default PatientDashboard;
