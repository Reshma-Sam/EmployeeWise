import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [email, setEmail] = useState("eve.holt@reqres.in");
  const [password, setPassword] = useState("cityslicka");
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState("danger");
  const navigate = useNavigate();
  const { login } = useAuth(); // Use login from context

  // Base URL from environment variable
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        login(response.data.token); // Set token in context

        // Show success alert
        setAlertType("success");
        setAlertMessage("Login successful!");

        // Redirect after 2 seconds
        setTimeout(() => {
          setAlertMessage(null);
          navigate("/users");
        }, 2000);
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (err) {
      // Show error alert
      setAlertType("danger");
      setAlertMessage("Invalid credentials");
    }
  };

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="card p-4 shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="mb-4 text-center">Login</h2>

        {/* Alert Component */}
        {alertMessage && (
          <div className={`alert alert-${alertType} alert-dismissible fade show`} role="alert">
            {alertMessage}
            <button
              type="button"
              className="btn-close"
              onClick={() => setAlertMessage(null)}
            />
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="Enter email"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="Enter password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
