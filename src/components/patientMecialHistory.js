import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function PatientMedicalHistory() {
  const [medicalHistory, setMedicalHistory] = useState([]);
  const location = useLocation();
  const patientId = location.state?.patientId;
  const patientName = location.state?.patientName;
  const [showAddForm, setShowAddForm] = useState(false);
  const [testName, setTestName] = useState('');
  const [testResult, setTestResult] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const fetchMedicalHistory = async () => {
      const response = await fetch('http://localhost:3000/get-medical-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ patientid: patientId })
      });
      const data = await response.json();
      if (data && data.medicalHistory) {
        setMedicalHistory(data.medicalHistory);
      }
    };

    if (patientId) {
      fetchMedicalHistory();
    }
  }, [patientId]);

  const handleAddMedicalHistory = async (event) => {
    event.preventDefault();
    const newHistory = {
      patientid: patientId,
      testName: testName,
      testResult: testResult,
      date: date
    };
  
    const response = await fetch('http://localhost:3000/add-medical-history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newHistory)
    });
  
    if (response.ok) {
      // Assuming the response includes the added history item
      const addedHistoryData = await response.json();
      // Structure the new item to match the expected structure in your state
      const newHistoryItem = {
        ...newHistory,
        historyid: addedHistoryData.historyid, // or generate a temporary ID if not returned from server
        testname: testName,
        testresult: testResult,
      };
  
      // Add the new item to the state
      setMedicalHistory([...medicalHistory, newHistoryItem]);
  
      // Reset form fields and close form
      setTestName('');
      setTestResult('');
      setDate('');
      setShowAddForm(false);
    } else {
      // Handle error
      console.error('Failed to add medical history');
    }
  };
  



  return (
    <div>
      <h1>{patientName}'s Medical History</h1>
      <button onClick={() => setShowAddForm(!showAddForm)}>
        Add Medical Information
      </button>
      {showAddForm && (
        <form onSubmit={handleAddMedicalHistory}>
          <input type="text" value={testName} onChange={(e) => setTestName(e.target.value)} placeholder="Test Name" />
          <input type="text" value={testResult} onChange={(e) => setTestResult(e.target.value)} placeholder="Test Result" />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <button type="submit">Submit</button>
        </form>
      )}
      {medicalHistory.length > 0 ? (
        <ul>
          {medicalHistory.map((history, index) => (
            <li key={index}>
              <p>Test Name: {history.testname}</p>
              <p>Result: {history.testresult}</p>
              <p>Date: {history.date}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>There is no medical history available for this patient.</p>
      )}
      <button className="btn btn-warning"onClick={() => navigate('/doctor-dashboard')}>Back</button>

    </div>
  );
}

export default PatientMedicalHistory;
