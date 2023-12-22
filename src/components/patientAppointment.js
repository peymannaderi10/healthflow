import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PatientAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [venue, setVenue] = useState('Venue A');
  const [appointments, setAppointments] = useState([]); // State for storing appointments
  const [editingAppointment, setEditingAppointment] = useState(null); // Track the appointment being edited
  const [editedDate, setEditedDate] = useState('');
  const [editedDocId, setEditedDocId] = useState('');
  const [editedVenue, setEditedVenue] = useState('');
  const { userData } = useAuth(); // Assuming userData contains patientid
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();
  
// UPDATE FUNCTION
const handleUpdate = async (event, appointmentid) => {
    event.preventDefault(); // Prevent default form submission behavior
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
      // Update the appointment in the local state
      setAppointments(appointments.map(appointment => {
        if (appointment.appointmentid === appointmentid) {
          return { ...appointment, appointmentdate: editedDate, venue: editedVenue };
        }
        return appointment;
      }));
  
      setEditingAppointment(null); // Exit editing mode
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

  // FETCH ALL DOCTORS
  useEffect(() => {
    const fetchDoctors = async () => {
      const response = await fetch('http://localhost:3000/doctors');
      const data = await response.json();
      setDoctors(data);
    };

    fetchDoctors();


    // FETCH PATIENT APPOINTMENTS 
    const fetchAppointments = async () => {
        try {
          const response = await fetch('http://localhost:3000/get-appointments-patient', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ patientid: userData.patientid })
          });
  
          const data = await response.json();
          if (data.appointments) {
            setAppointments(data.appointments);
          }
        } catch (error) {
          console.error("Error fetching appointments:", error);
          // Handle errors here
        }
      };
  
      fetchAppointments();




  }, [userData.patientid]);

  // Handle form submission
const handleSubmit = async (event) => {
    event.preventDefault();
    const appointmentData = {
      doctorid: selectedDoctor,
      patientid: userData.patientid,
      appointmentdate: appointmentDate,
      venue: venue
    };
  
    const response = await fetch('http://localhost:3000/add-appointment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(appointmentData)
    });
  
    if (response.ok) {
      // Construct new appointment object with necessary details
      const newAppointment = {
        ...appointmentData,
        appointmentid: 'generated or returned id', // Replace with actual id if returned from the server
      };
      // Update current appointments
      setAppointments([...appointments, newAppointment]);
  
      setSuccessMessage("Successfully added appointment");
      // Reset form fields
      setSelectedDoctor('');
      setAppointmentDate('');
      setVenue('');
    } else {
      // Handle errors
      setSuccessMessage("Failed to add appointment");
    }
  };
  


  return (
    <div className="patient-appointment">
      <h1>Create an Appointment</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Doctor:
          <select value={selectedDoctor} onChange={e => setSelectedDoctor(e.target.value)}>
            <option value="">Select a Doctor</option>
            {doctors.map(doctor => (
              <option key={doctor.doctorid} value={doctor.doctorid}>{doctor.name} ({doctor.specialization})</option>
            ))}
          </select>
        </label>
  
        <label>
          Date and Time:
          <input
            type="datetime-local"
            value={appointmentDate}
            onChange={e => setAppointmentDate(e.target.value)}
            min={`${new Date().toISOString().split('T')[0]}T09:00`}
          />
        </label>
  
        <label>
          Venue:
          <select value={venue} onChange={e => setVenue(e.target.value)}>
            <option value="Venue A">Venue A</option>
            <option value="Venue B">Venue B</option>
            <option value="Venue C">Venue C</option>
          </select>
        </label>
  
        <button type="submit">Submit Appointment</button>
      </form>
      {successMessage && <div>{successMessage}</div>} {/* Display success message */}
  
      <h2>Current Appointments</h2>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment.appointmentid}>
            {editingAppointment === appointment.appointmentid ? (
              <form onSubmit={(e) => handleUpdate(e, appointment.appointmentid)}>
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
                <p>Doctor ID: {appointment.doctorid}</p>
                <p>Date: {appointment.appointmentdate}</p>
                <p>Venue: {appointment.venue}</p>
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
      <button className="btn btn-warning"onClick={() => navigate('/patient-dashboard')}>Back</button>
    </div>
  );
  
}

export default PatientAppointment;