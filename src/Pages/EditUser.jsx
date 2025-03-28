import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const EditUser = ({ onUserUpdate }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({ id: "", first_name: "", last_name: "", email: "", avatar: "" });

  // Base URL from environment variable
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Alert state
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState("success");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/users/${id}`);
        setUser({
          id: res.data.data.id,
          avatar: res.data.data.avatar,
          first_name: res.data.data.first_name,
          last_name: res.data.data.last_name,
          email: res.data.data.email,
        });
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUser();
  }, [id, BASE_URL]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${BASE_URL}/users/${id}`, user);
      onUserUpdate(response.data);

      // Show success alert
      setAlertType("success");
      setAlertMessage("User updated successfully!");

      // Automatically hide alert after 3 seconds
      setTimeout(() => {
        setAlertMessage(null);
        navigate("/users");
      }, 3000);
    } catch (error) {
      console.error("Error updating user", error);
      setAlertType("danger");
      setAlertMessage("Error updating user");
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-lg">
        <h2 className="mb-4">Edit User</h2>

        {/* Styled Alert */}
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

        {user.avatar && (
          <img
            src={user.avatar}
            alt={user.first_name}
            className="rounded-circle mb-3"
            style={{ width: "100px", height: "100px" }}
          />
        )}

        <form onSubmit={handleUpdate}>
          <div className="mb-3">
            <label className="form-label">First Name</label>
            <input
              type="text"
              name="first_name"
              value={user.first_name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={user.last_name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Update</button>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
