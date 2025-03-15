import React, { useState, useEffect } from "react";
import api from './api';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from "@mui/x-data-grid";
import { Button, Container, Box, TextField, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Checkbox, MenuItem, Select, InputLabel, FormControl } from "@mui/material";

const Users = ({ role, userId }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newUser, setNewUser] = useState({
    points: "",
    uid: "",
    email: "",
    role: "user",
    userId: "",
    active: true,
    locked: false,
    attempts: 0,
    securityQuestions: [],
    ssoEnabled: false
  });
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {

      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found.');
        navigate('/');  // Redirect to login if no token exists
        return;
      }
            const rolelocal = localStorage.getItem('role') ;
      const userlocal=localStorage.getItem("uid");
      console.log("Token:", token);  // Log to verify the token
  
      if (!token) {
        throw new Error("Token is missing");
      }
  
      const response = await api.post("https://hindicomicsbackend.onrender.comusers", {
        database: 'users',
      }, {
        headers: {
          Authorization: `Bearer ${token}`,  // Ensure the correct format
        },
      });
  
      const usersData = response.data;
      if (usersData) {
        const formattedUsers = usersData.map((user) => ({
          id: user.uid,
          ...user,
          securityQuestion1: user.securityQuestions && user.securityQuestions[0] 
            ? `${user.securityQuestions[0].question}, ${user.securityQuestions[0].answer}` 
            : "",
          securityQuestion2: user.securityQuestions && user.securityQuestions[1] 
            ? `${user.securityQuestions[1].question}, ${user.securityQuestions[1].answer}` 
            : "",
          securityQuestion3: user.securityQuestions && user.securityQuestions[2] 
            ? `${user.securityQuestions[2].question}, ${user.securityQuestions[2].answer}` 
            : "",
        }));
        setUsers(formattedUsers);
        setFilteredUsers(formattedUsers);
      } else {
        setUsers([]);
        setFilteredUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users", error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.uid.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found.');
        navigate('/');  // Redirect to login if no token exists
        return;
      }
           
      await api.delete(`https://hindicomicsbackend.onrender.comusers/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers(); // Re-fetch users after deletion
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  const handleEditUser = (user) => {
    setNewUser({
      email: user.email,
      role: user.role,
      points: user.points,
      uid: user.uid,
      active: user.active,
      locked: user.locked,
      attempts: user.attempts,
      ssoEnabled: user.ssoEnabled,
    });
    setIsEditing(true);
    setOpenForm(true);
  };

  const handleUpdateUser = async () => {
    try {
      if (!newUser.uid) {
        console.error("User ID is missing, cannot update user");
        return;
      }
  
      const updatedUserData = {
        email: newUser.email || "", // Ensure email is not undefined
        role: newUser.role || "user", // Default to "user" if no role is provided
        points: newUser.points || 0, // Default to 0 if no points are provided
        uid: newUser.uid,
        active: newUser.active || true,
        locked: newUser.locked || false,
        attempts: newUser.attempts || 0,
        ssoEnabled: newUser.ssoEnabled || false,
      };
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found.');
        navigate('/');  // Redirect to login if no token exists
        return;
      }
            const response = await api.put(`https://hindicomicsbackend.onrender.comusers/${newUser.uid}`, updatedUserData, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.status === 200) {
        fetchUsers();
        setOpenForm(false);
        setIsEditing(false);
        setNewUser({
          email: "",
          role: "user",
          points: "",
          uid: "",
          active: true,
          locked: false,
          attempts: 0,
          ssoEnabled: false,
        });
      }
    } catch (error) {
      console.error("Error updating user", error);
    }
  };
  

  const columns = [
    { field: "email", headerName: "Email", width: 250 },
    { field: "role", headerName: "Role", width: 150 },
    { field: "points", headerName: "Points", width: 150 },
    { field: "uid", headerName: "User Id", width: 250 },
    { field: "securityQuestion1", headerName: "Security Question 1", width: 250 },
    { field: "securityQuestion2", headerName: "Security Question 2", width: 250 },
    { field: "securityQuestion3", headerName: "Security Question 3", width: 250 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <Box>
          <Button onClick={() => handleEditUser(params.row)} variant="outlined" color="primary" sx={{ ml: 1 }}>
            Edit
          </Button>
          <Button onClick={() => handleDelete(params.id)} variant="outlined" color="secondary" sx={{ ml: 1 }}>
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Container>
      {/* Search Bar */}
      <TextField
        label="Search Users"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        margin="normal"
      />

      <div style={{ height: 400, width: "100%" }}>
        <DataGrid rows={filteredUsers} columns={columns} pageSize={5} loading={loading} />
      </div>

      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <DialogTitle>{isEditing ? "Edit User" : "Add New User"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Email"
            fullWidth
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            margin="dense"
          />
          <TextField
            label="Points"
            fullWidth
            value={newUser.points}
            onChange={(e) => setNewUser({ ...newUser, points: e.target.value })}
            margin="dense"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Role</InputLabel>
            <Select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="User Id"
            fullWidth
            value={newUser.uid}
            onChange={(e) => setNewUser({ ...newUser, uid: e.target.value })}
            margin="dense"
          />

          {/* Additional fields for locked, attempts, etc. */}
          <FormControlLabel
            control={
              <Checkbox
                checked={newUser.locked}
                onChange={(e) => setNewUser({ ...newUser, locked: e.target.checked })}
              />
            }
            label="Locked"
          />
          <TextField
            label="Attempts"
            fullWidth
            type="number"
            value={newUser.attempts}
            onChange={(e) => setNewUser({ ...newUser, attempts: e.target.value })}
            margin="dense"
          />
   
      

          <FormControlLabel
            control={
              <Checkbox
                checked={newUser.ssoEnabled}
                onChange={(e) => setNewUser({ ...newUser, ssoEnabled: e.target.checked })}
              />
            }
            label="SSO Enabled"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)} color="primary">Cancel</Button>
          <Button onClick={handleUpdateUser} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Users;
