import React, { useContext } from 'react';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

function DoctorDashboard() {
  const { userData } = useAuth(); // Use useAuth hook to access user data

  return (
    <div className="doctor-dashboard">
      <h1>Doctor Dashboard</h1>
      <div className="doctor-info">
        <h2>Welcome, Dr. {userData.name}</h2>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Contact:</strong> {userData.contactnumber}</p>
        <p><strong>Specialization:</strong> {userData.specialization}</p>
      </div>
      <div className="appointments">
        <h3>Upcoming Appointments</h3>
        {/* Here you can add logic to list the doctor's appointments */}
        {/* This is a placeholder content */}
        <p>No upcoming appointments.</p>
      </div>
    </div>
  );
}

export default DoctorDashboard;
