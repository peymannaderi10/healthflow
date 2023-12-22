import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function DoctorDashboard() {
  const { userData, setUserData } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]); // State for storing doctors
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [editedDate, setEditedDate] = useState('');
  const [editedDocId, setEditedDocId] = useState('');
  const [editedVenue, setEditedVenue] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = () => {
    // Clear the user data from AuthContext
    setUserData({});

    // Navigate to the login page
    navigate('/login');
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Fetch appointments
        const response = await fetch('http://localhost:3000/get-appointments-doctors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ doctorid: userData.doctorid })
        });
        const data = await response.json();
        if (data && data.appointments) {
          const appointmentsWithPatients = await Promise.all(data.appointments.map(async (appointment) => {
            if(appointment.patientid) {
              const patientResponse = await fetch(`http://localhost:3000/getPatient?patientID=${appointment.patientid}`);
              const patientData = await patientResponse.json();
              return { ...appointment, patient: patientData[0] };
            }
            return appointment;
          }));
          setAppointments(appointmentsWithPatients);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();



    const fetchDoctors = async () => {
      const response = await fetch('http://localhost:3000/doctors');
      const data = await response.json();
      setDoctors(data);
    };
    fetchDoctors();

    
  }, [userData.doctorid]);


// UPDATE FUNCTION
const handleUpdate = async (event, appointmentid) => {
  event.preventDefault();
  const updatedAppointment = {
    doctorid: editedDocId,
    appointmentid,
    appointmentdate: editedDate,
    venue: editedVenue
  };

  const response = await fetch('http://localhost:3000/update-appointment', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedAppointment)
  });

  if (response.ok) {
    setAppointments(appointments.map(appointment => {
      if (appointment.appointmentid === appointmentid) {
        // Check if the updated doctor ID matches the current user's doctor ID
        if (editedDocId === userData.doctorid) {
          return { ...appointment, doctorid: editedDocId, appointmentdate: editedDate, venue: editedVenue };
        } else {
          // If not, remove the appointment from the list
          return null;
        }
      }
      return appointment;
    }).filter(appointment => appointment !== null)); // Filter out null values

    setEditingAppointment(null); // Exit editing mode
    setEditedDate('');
    setEditedVenue('');
    setEditedDocId('');
  } else {
    // Handle errors
    console.error('Failed to update appointment');
  }
};


//DELETE FUNCTION
const handleDelete = async (appointmentid) => {
  await fetch('http://localhost:3000/delete-appointment', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ appointmentid })
  });

  setAppointments(appointments.filter(appointment => appointment.appointmentid !== appointmentid));
};


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
        <ul>
        {appointments.map((appointment) => (
          <li key={appointment.appointmentid}>
            {editingAppointment === appointment.appointmentid ? (
              <form onSubmit={(e) => handleUpdate(e, appointment.appointmentid)}>
                <label>
                  Doctor:
                  <select value={editedDocId} onChange={(e) => setEditedDocId(e.target.value)}>
                    <option value="">Select a Doctor</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.doctorid} value={doctor.doctorid}>
                        {doctor.name} ({doctor.specialization})
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Date and Time:
                  <input
                    type="datetime-local"
                    value={editedDate}
                    onChange={(e) => setEditedDate(e.target.value)}
                  />
                </label>
                <label>
                  Venue:
                  <select value={editedVenue} onChange={(e) => setEditedVenue(e.target.value)}>
                    {/* Example static venues */}
                    <option value="Venue A">Venue A</option>
                    <option value="Venue B">Venue B</option>
                    <option value="Venue C">Venue C</option>
                  </select>
                </label>
                <button type="submit">Save Changes</button>
              </form>
            ) : (
              <>
                <p>Patient ID: {appointment.patientid}</p>
                <p>Patient Name: {appointment.patient?.name}</p>
                <p>Date: {appointment.appointmentdate}</p>
                <p>Venue: {appointment.venue}</p>
                <button onClick={() => navigate('/patientMedicalHistory', { state: { patientId: appointment.patientid, patientName: appointment.patient?.name } })}>
                  Medical History
                </button>
                <button onClick={() => {
                  setEditingAppointment(appointment.appointmentid);
                  setEditedDate(appointment.appointmentdate);
                  setEditedVenue(appointment.venue);
                  setEditedDocId(appointment.doctorid);
                }}>Update</button>
                <button onClick={() => handleDelete(appointment.appointmentid)}>Cancel</button>
              </>
            )}
          </li>
        ))}
      </ul>
      </div>
      <button className="btn btn-primary" onClick={handleLogout}>Logout</button> 

    </div>
  );
}

export default DoctorDashboard;
