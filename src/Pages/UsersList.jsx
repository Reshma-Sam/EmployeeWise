import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const UsersList = ({ users, setUsers }) => {
  // Base URL from environment variable
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Alert State
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState("success");

  // Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  // Handle Pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Delete user
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      setAlertType("success");
      setAlertMessage("User deleted successfully!");
    } catch (error) {
      setAlertType("danger");
      setAlertMessage("Error deleting user");
      console.error("Error deleting user", error);
    }

    // Clear alert after 3 seconds
    setTimeout(() => {
      setAlertMessage(null);
    }, 3000);
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <h2 className="mb-4">Users List</h2>

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

        {users.length === 0 ? (
          <p>Loading users...</p>
        ) : (
          <>
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Avatar</th>
                  <th>Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <img
                        src={user.avatar}
                        alt={user.first_name}
                        className="rounded-circle"
                        style={{ width: "50px", height: "50px" }}
                      />
                    </td>
                    <td className="align-middle">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="align-middle">
                      <div className="d-flex gap-2">
                        <Link
                          to={`/edit-user/${user.id}`}
                          className="btn btn-primary btn-sm"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="btn btn-danger btn-sm px-2 py-1"
                          style={{ fontSize: "12px" }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <nav>
              <ul className="pagination justify-content-center">
                {Array.from({ length: totalPages }, (_, index) => (
                  <li
                    key={index}
                    className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                  >
                    <button
                      onClick={() => handlePageChange(index + 1)}
                      className="page-link"
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </>
        )}
      </div>
    </div>
  );
};

export default UsersList;
