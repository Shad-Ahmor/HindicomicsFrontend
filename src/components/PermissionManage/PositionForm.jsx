import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Button,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";

const PositionForm = ({ onBack, editingPosition }) => {
  const [form, setForm] = useState({
    role: "",
    designation: "",
    department: "",
    level: "",
    reporting: "",
    reportee: [],
    responsibilities: "",
    project: "",
    skills: [],
  });
  const [rolesOptions, setRolesOptions] = useState([]);
  const token = localStorage.getItem("token");
  const { id } = useParams(); // edit ke liye id
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const designations = [
    "Software Engineer",
    "Senior Developer",
    "UI/UX Designer",
    "Project Manager",
    "Intern",
  ];
  const departments = ["Engineering", "Product", "HR", "Design", "Finance"];
  const levels = ["Junior", "Mid", "Senior", "Lead"];
  const responsibilitiesList = [
    "Code Development",
    "Testing",
    "Design Creation",
    "Team Management",
    "Project Planning",
  ];
  const projects = ["Portal Redesign", "AI Assistant", "Mobile App"];
  const skillsList = ["ReactJS", "Node.js", "Python", "UI Design", "Project Management"];

  const restrictedNames = ["Business", "Department", "Teams", "Sub-Teams"];

  // 🔹 Fetch all roles
  const fetchRoles = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/rolemethod/get-roles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRolesOptions(res.data || []);
    } catch (err) {
      console.error("Error fetching roles", err);
    }
  }, [token]);

  // 🔹 Fetch existing position if editing
  const fetchExistingPosition = useCallback(async () => {
    if (!id && !editingPosition) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/rolemethod/get-position/${id || editingPosition?._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setForm(res.data);
    } catch (err) {
      console.error("Error fetching position", err);
    }
  }, [id, token, editingPosition]);

  useEffect(() => {
    fetchRoles();
    fetchExistingPosition();
  }, [fetchRoles, fetchExistingPosition]);

  // 🔹 Handle field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Validate restricted names
  const isRestrictedName = (name) => {
    if (!name) return false;
    const lower = name.toLowerCase();
    return restrictedNames.some(
      (restricted) => lower.includes(restricted.toLowerCase())
    );
  };

  // 🔹 Save handler
  const handleSave = async () => {
    try {
      if (
        isRestrictedName(form.role) ||
        isRestrictedName(form.designation) ||
        isRestrictedName(form.department)
      ) {
        setAlert({
          open: true,
          message:
            "Cannot create a position with name Business, Department, Teams, or Sub-Teams.",
          severity: "error",
        });
        return;
      }

      const url = id
        ? "http://localhost:5000/rolemethod/update-position"
        : "http://localhost:5000/rolemethod/add-position";

      await axios({
        method: id ? "put" : "post",
        url,
        data: form,
        headers: { Authorization: `Bearer ${token}` },
      });

      setAlert({
        open: true,
        message: id ? "Position updated successfully" : "Position added successfully",
        severity: "success",
      });

      setTimeout(() => {
        onBack(); // 👈 go back to list after success
      }, 1200);
    } catch (err) {
      console.error(err);
      setAlert({ open: true, message: "Error saving position", severity: "error" });
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        {id || editingPosition ? "Edit Position" : "Add New Position"}
      </Typography>

      <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 3 }}>
        <Grid container spacing={2}>
          {/* Role */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={form.role}
                onChange={handleChange}
                label="Role"
              >
                {rolesOptions.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Designation */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Designation</InputLabel>
              <Select
                name="designation"
                value={form.designation}
                onChange={handleChange}
                label="Designation"
              >
                {designations.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Department */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                name="department"
                value={form.department}
                onChange={handleChange}
                label="Department"
              >
                {departments.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Level */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Level</InputLabel>
              <Select
                name="level"
                value={form.level}
                onChange={handleChange}
                label="Level"
              >
                {levels.map((l) => (
                  <MenuItem key={l} value={l}>
                    {l}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Responsibilities */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Responsibilities</InputLabel>
              <Select
                name="responsibilities"
                value={form.responsibilities}
                onChange={handleChange}
                label="Responsibilities"
              >
                {responsibilitiesList.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Project */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Project</InputLabel>
              <Select
                name="project"
                value={form.project}
                onChange={handleChange}
                label="Project"
              >
                {projects.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Skills */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Skills</InputLabel>
              <Select
                multiple
                name="skills"
                value={form.skills}
                onChange={handleChange}
                input={<OutlinedInput label="Skills" />}
                renderValue={(selected) => selected.join(", ")}
              >
                {skillsList.map((skill) => (
                  <MenuItem key={skill} value={skill}>
                    <Checkbox checked={form.skills.includes(skill)} />
                    <ListItemText primary={skill} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Buttons */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button variant="contained" onClick={handleSave}>
                {id || editingPosition ? "Update Position" : "Add Position"}
              </Button>
              <Button variant="outlined" color="secondary" onClick={onBack}>
                Cancel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Snackbar for alerts */}
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert severity={alert.severity}>{alert.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default PositionForm;
