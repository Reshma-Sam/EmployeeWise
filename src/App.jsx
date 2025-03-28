import React, {useState,useEffect} from "react";
import { BrowserRouter as Router,Route, Routes, Navigate } from "react-router-dom";
import "./App.css"
import Login from "./Pages/Login";
import UsersList from "./Pages/UsersList";
import EditUser from "./Pages/EditUser";
import { AuthProvider ,useAuth} from "./context/AuthContext";
import axios from "axios";

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  const [users, setUsers] = useState([]);

  // Base URL from environment variable
  const BASE_URL = import.meta.env.VITE_BASE_URL;

    // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users`);
        setUsers(response.data.data);
        // console.log("Users fetched:", response.data.data);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    fetchUsers();
  }, []);

  // Handle user updates
  const handleUserUpdate = (updatedUser) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
    console.log("User updated locally:", updatedUser);
  };

  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <UsersList users={users || []} setUsers={setUsers} />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-user/:id"
          element={
            <PrivateRoute>
              <EditUser onUserUpdate={handleUserUpdate}/>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
  </AuthProvider>
  );
};

export default App;
