import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/login";
import SignUp from "./components/signup";
import ConditionalNavigation from "./components/conditionalNavigation";
import DoctorDashboard from "./components/doctor-dashboard";
import PatientDashboard from "./components/patient-dashboard";
import PrivateRoute from "./components/PrivateRoute";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <AuthProvider>
      {" "}
      {/* Wrap your routes with AuthProvider */}
      <Router>
        <ConditionalNavigation />
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/doctor-dashboard"
            element={
              <PrivateRoute>
                < DoctorDashboard/>
              </PrivateRoute>
            }
          />
             <Route
            path="/patient-dashboard"
            element={
              <PrivateRoute>
                <PatientDashboard/>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
