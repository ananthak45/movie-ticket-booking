import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Make sure to import useNavigate

const Login = () => {
    const navigate = useNavigate(); // Use navigate from react-router-dom
    const [isUser, setIsUser] = useState(true);
    const [emailOrMobile, setEmailOrMobile] = useState('');
    const [password, setPassword] = useState('');
    const [userId, setUserId] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isUser ? '/api/user/login' : '/api/admin/login';
        const credentials = isUser ? { emailOrMobile, password } : { userId, password };

        try {
            const response = await axios.post(endpoint, credentials);
            if (response.data.success) {
                // Redirect based on user type
                window.location.href = isUser ? '/user' : '/admin';
            } else {
                // If login fails for admin, redirect to add theater page
                if (!isUser) {
                    navigate('/add-theater');
                } else {
                    alert(response.data.message);
                }
            }
        } catch (error) {
            console.error("Login error", error);
            alert("An error occurred while logging in.");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="card p-4" style={{ width: '400px' }}>
                <h3 className="text-center mb-3">Login</h3>
                <ul className="nav nav-tabs mb-3">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${isUser ? 'active' : ''}`}
                            onClick={() => setIsUser(true)}
                            style={{ cursor: 'pointer', background: 'none', border: 'none' }}
                        >
                            User
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${!isUser ? 'active' : ''}`}
                            onClick={() => setIsUser(false)}
                            style={{ cursor: 'pointer', background: 'none', border: 'none' }}
                        >
                            Admin
                        </button>
                    </li>
                </ul>
                <form onSubmit={handleSubmit}>
                    {isUser ? (
                        <>
                            <div className="mb-3">
                                <label htmlFor="emailOrMobile" className="form-label">Email/Mobile No</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="emailOrMobile"
                                    value={emailOrMobile}
                                    onChange={(e) => setEmailOrMobile(e.target.value)}
                                    required
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="mb-3">
                                <label htmlFor="userId" className="form-label">User ID</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="userId"
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    required
                                />
                            </div>
                        </>
                    )}
                    <div className="mb-3">
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
                    <button type="submit" className="btn btn-primary">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
