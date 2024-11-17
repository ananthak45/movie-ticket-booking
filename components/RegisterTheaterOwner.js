import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function RegisterTheaterOwner() {
    const navigate = useNavigate();
    const [isNewAdmin, setIsNewAdmin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [usernameAvailable, setUsernameAvailable] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [registrationComplete, setRegistrationComplete] = useState(false);

    const checkUsername = async () => {
        if (username.trim() === "") return;
        try {
            const response = await axios.post("http://localhost:5000/check-username", { username });
            setUsernameAvailable(response.data.available);
        } catch (error) {
            console.error("Error checking username availability:", error);
            setMessage("Error checking username availability.");
        }
    };

    const handleRegister = async () => {
        if (username.trim() === "" || password.trim() === "" || confirmPassword.trim() === "") {
            setMessage("Please fill all fields.");
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        await checkUsername();

        if (usernameAvailable) {
            try {
                await axios.post("http://localhost:5000/register", { username, password });
                localStorage.setItem("username", username);
                setRegistrationComplete(true);
                setMessage("Registration successful!");
                navigate("/add-theater");
            } catch (error) {
                console.error("Error during registration:", error);
                setMessage("Error during registration.");
            }
        } else {
            setMessage("Username is not available.");
        }
    };

    const handleOldAdminLogin = async () => {
        if (username.trim() === "" || password.trim() === "") {
            setMessage("Please fill all fields.");
            return;
        }
    
        try {
            const loginResponse = await axios.post("http://localhost:5000/adminlogin", { username, password });
            if (loginResponse.data.success) {
                // Fetch the theater name associated with the username
                const theaterResponse = await axios.post("http://localhost:5000/get-theater-name", { username });
                if (theaterResponse.data.success) {
                    const theaterName = theaterResponse.data.theaterName;
                    navigate(`/${theaterName}/movies`);
                } else {
                    setMessage("Theater name not found for this username.");
                }
            } else {
                setMessage("Invalid username or password.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            setMessage("Error during login.");
        }
    };
    

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div>
                <h3 className="text-primary mb-4">Theater Owner</h3>
                <ul className="nav nav-tabs mb-4">
                    <li className="nav-item">
                        <a
                            className={`nav-link ${isNewAdmin ? "active" : ""}`}
                            onClick={() => setIsNewAdmin(true)}
                            style={{ cursor: "pointer" }}
                        >
                            New Admin
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            className={`nav-link ${!isNewAdmin ? "active" : ""}`}
                            onClick={() => setIsNewAdmin(false)}
                            style={{ cursor: "pointer" }}
                        >
                            Old Admin
                        </a>
                    </li>
                </ul>

                {message && <div className="alert alert-info">{message}</div>}

                {isNewAdmin ? (
                    <div>
                        <div className="mb-3">
                            <label className="form-label">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onBlur={checkUsername}
                            />
                            {usernameAvailable === false && (
                                <small className="text-danger">Username is not available.</small>
                            )}
                        </div>
                        <div className="mb-3 position-relative">
                            <label className="form-label">Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="mb-3 position-relative">
                            <label className="form-label">Re-enter Password</label>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <button className="btn btn-primary w-100" onClick={handleRegister} disabled={!username}>
                            Confirm
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="mb-3">
                            <label className="form-label">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="mb-3 position-relative">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button className="btn btn-primary w-100" onClick={handleOldAdminLogin}>
                            Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RegisterTheaterOwner;
