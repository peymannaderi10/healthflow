import React from 'react';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

function PatientDashboard() {
  const { userData } = useAuth(); // Use useAuth hook to access user data
  return (
    <div className="patient-dashboard">
      <h1>Patient Dashboard</h1>
      <div className="patient-info">
        <h2>Welcome, {userData.name}</h2>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Address:</strong> {userData.address}</p>
        <p><strong>Contact:</strong> {userData.contact}</p>
      </div>
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
    </div>
  );
}

export default PatientDashboard;
