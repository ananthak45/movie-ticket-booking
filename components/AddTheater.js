import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddTheater.css";

function AddTheater() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [theaterName, setTheaterName] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [instagram, setInstagram] = useState("");
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Check if the user is registered
            const userResponse = await fetch("http://localhost:5000/check-username", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username }),
            });
            const userResult = await userResponse.json();

            if (!userResult.available) {
                // User is registered, proceed to add theater
                await axios.post("http://localhost:5000/add-theater", { 
                    username, 
                    password, 
                    theaterName, 
                    ownerName, 
                    address, 
                    phone, 
                    email, 
                    instagram 
                });
                setMessage("Theater added successfully!");
                
                // Clear form fields after successful submission
                setUsername("");
                setPassword("");
                setTheaterName("");
                setOwnerName("");
                setAddress("");
                setPhone("");
                setEmail("");
                setInstagram("");

                navigate("/add-theater"); 
            } else {
                // User is not registered, show popup
                setShowPopup(true);
            }
        } catch (error) {
            setMessage("Error adding theater.");
            console.error("Error:", error);
        }
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    return (
        <div className="form-container mt-5">
            <button className="btn btn-secondary go-back-btn" onClick={() => window.location.href = "/login"}>
                Go Back
            </button>
            <h3 className="text-center">Add a New Theater</h3>
            {message && <div className="alert alert-info">{message}</div>}
            <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                    <div className="col">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="theaterName" className="form-label">Theater Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="theaterName"
                        value={theaterName}
                        onChange={(e) => setTheaterName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="ownerName" className="form-label">Owner Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="ownerName"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="address" className="form-label">Address</label>
                    <input
                        type="text"
                        className="form-control"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone</label>
                    <input
                        type="text"
                        className="form-control"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="instagram" className="form-label">Instagram</label>
                    <input
                        type="text"
                        className="form-control"
                        id="instagram"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Add Theater</button>
            </form>

            {showPopup && (
                <div className="popup-overlay" onClick={handleClosePopup}>
                    <div className="popup">
                        <h4>User not registered</h4>
                        <p>Please register the user before adding a theater.</p>
                        <button className="btn btn-secondary" onClick={() => window.location.href = "/register"}>
                            Register Now
                        </button>
                        <button className="btn btn-danger" onClick={handleClosePopup}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddTheater;
