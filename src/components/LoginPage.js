import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const LoginPage = () => {
  const [tab, setTab] = useState("user");
  const [adminDetails, setAdminDetails] = useState({ userid: "", password: "" });
  const [showPopup, setShowPopup] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [registrationDetails, setRegistrationDetails] = useState({
    userid: "",
    phone: "",
    password: "",
    rePassword: "",
  });
  const [registrationError, setRegistrationError] = useState("");
  
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (tab === "admin") {
      try {
        const response = await axios.post("http://localhost:5000/api/admin/login", adminDetails);
        if (response.data.success) {
          navigate(`/${adminDetails.userid}/window`);
        } else {
          setShowPopup(true);
        }
      } catch (error) {
        console.error("Error during login:", error);
      }
    } else if (tab === "user") {
      // Navigate to the /:phoneno route directly on login
      navigate(`/${adminDetails.userid}/home`); // Here assuming `adminDetails.userid` as phone number for demonstration
    }
  };

  const handleRegister = async () => {
    setRegistrationError(""); // Reset error message before trying to register
    try {
      const response = await axios.post("http://localhost:5000/api/admin/register", registrationDetails);
      if (response.data.success) {
        navigate("/add-theater");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setRegistrationError(error.response.data.error);
      } else {
        console.error("Error during registration:", error);
      }
    }
  };

  return (
    <div className="container d-flex justify-content-end mt-5 mr-5">
      <div className="w-50">
        {!showRegisterForm ? (
          <>
            <h2 className="text-center">Login</h2>
            <ul className="nav nav-tabs mb-3">
              <li className="nav-item">
                <button
                  className={`nav-link ${tab === "user" ? "active" : ""}`}
                  onClick={() => setTab("user")}
                >
                  User
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${tab === "admin" ? "active" : ""}`}
                  onClick={() => setTab("admin")}
                >
                  Admin
                </button>
              </li>
            </ul>

            {tab === "admin" && (
              <div className="form-group">
                <label>User ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={adminDetails.userid}
                  onChange={(e) => setAdminDetails({ ...adminDetails, userid: e.target.value })}
                />
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={adminDetails.password}
                  onChange={(e) => setAdminDetails({ ...adminDetails, password: e.target.value })}
                />
                <button className="btn btn-primary mt-3" onClick={handleLogin}>
                  Login
                </button>
              </div>
            )}

            {tab === "user" && (
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={adminDetails.userid} // Use the same state for phone number
                  onChange={(e) => setAdminDetails({ ...adminDetails, userid: e.target.value })} // Assuming userid as phone number
                />
                <button className="btn btn-primary mt-3" onClick={handleLogin}>
                  Login
                </button>
              </div>
            )}

            {showPopup && (
              <div className="alert alert-danger mt-3" role="alert">
                You are not a registered user.
                <button className="btn btn-link" onClick={() => setShowRegisterForm(true)}>
                  Register Now
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="form-group mt-3">
            <h3>Register</h3>
            <label>User ID</label>
            <input
              type="text"
              className="form-control"
              value={registrationDetails.userid}
              onChange={(e) => setRegistrationDetails({ ...registrationDetails, userid: e.target.value })}
            />
            {registrationError && <small className="text-danger">{registrationError}</small>}
            <label>Phone Number</label>
            <input
              type="text"
              className="form-control"
              value={registrationDetails.phone}
              onChange={(e) => setRegistrationDetails({ ...registrationDetails, phone: e.target.value })}
            />
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={registrationDetails.password}
              onChange={(e) => setRegistrationDetails({ ...registrationDetails, password: e.target.value })}
            />
            <label>Re-enter Password</label>
            <input
              type="password"
              className="form-control"
              value={registrationDetails.rePassword}
              onChange={(e) => setRegistrationDetails({ ...registrationDetails, rePassword: e.target.value })}
            />
            <button className="btn btn-success mt-3" onClick={handleRegister}>
              Register
            </button>
            <button className="btn btn-link mt-3" onClick={() => setShowRegisterForm(false)}>
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
