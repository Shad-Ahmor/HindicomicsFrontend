import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Box,
} from "@mui/material";
import axios from "axios";

const AbacModal = ({ open, onClose, editRule, onSave, token }) => {
  const [formData, setFormData] = useState({
    role: "",
    method: "",
    module: "",
    department: "",
    designation: "",
    position: "",
    team: "",
    action: "allow",
  });

  const [roles, setRoles] = useState([]);
  const [methods, setMethods] = useState([]);
  const [modules, setModules] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper: traverse org hierarchy to extract Departments & Teams
  function extractDepartmentsAndTeams(hierarchy) {
    const departments = [];
    const teams = [];

    function traverse(nodes) {
      nodes.forEach((node) => {
        if (node.type === "Department") {
          departments.push(node.name);
        } else if (node.type === "Team") {
          teams.push(node.name);
        }
        if (node.children && node.children.length > 0) {
          traverse(node.children);
        }
      });
    }

    traverse(hierarchy);
    return { departments, teams };
  }

  // Fetch all dropdown data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [rolesRes, methodsRes, modulesRes, orgRes, desigRes] =
          await Promise.all([
        axios.get("http://localhost:5000/rolemethod/get-roles", { headers }),
        axios.get("http://localhost:5000/rolemethod/get-methods", { headers }),
        axios.get("http://localhost:5000/rolemethod/get-modules", { headers }),
        axios.get("http://localhost:5000/rolemethod/organisation", { headers }),
        axios.get("http://localhost:5000/rolemethod/get/Designation", { headers })

          ]);

        const fetchedRoles = Array.isArray(rolesRes.data) ? rolesRes.data : [];
        const fetchedMethods = methodsRes.data ? Object.keys(methodsRes.data) : [];
        const fetchedModules = modulesRes.data ? Object.keys(modulesRes.data) : [];
        const fetchedDesignations = Array.isArray(desigRes.data)
          ? desigRes.data.map((d) => d.name || d._id || "")
          : [];

        const { departments, teams } = extractDepartmentsAndTeams(orgRes.data.data || []);

        setRoles(fetchedRoles);
        setMethods(fetchedMethods);
        setModules(fetchedModules);
        setDesignations(fetchedDesignations);
        setDepartments(departments);
        setTeams(teams);
      } catch (err) {
        console.error("❌ Error fetching dropdown data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (open) fetchData();
  }, [open, token]);

  // Fill form if editing
  useEffect(() => {
    if (editRule) {
      setFormData({
        role: editRule.attributes?.role || "",
        method: editRule.attributes?.method || "",
        module: editRule.attributes?.module || "",
        department: editRule.attributes?.department || "",
        designation: editRule.attributes?.designation || "",
        team: editRule.attributes?.team || "",
        position: editRule.attributes?.position || "",
        action: editRule.action || "allow",
      });
    } else {
      setFormData({
        role: "",
        method: "",
        module: "",
        department: "",
        designation: "",
        position: "",
        team: "",
        action: "allow",
      });
    }
  }, [editRule]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const payload = {
      attributes: {
        role: formData.role,
        method: formData.method,
        module: formData.module,
        department: formData.department,
        designation: formData.designation,
        position: formData.position,
        team: formData.team,
      },
      action: formData.action,
    };
    onSave(payload);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: 8,
          background: "linear-gradient(135deg, #f9f9fb 0%, #f1f4ff 100%)",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(90deg, #1976d2, #42a5f5)",
          color: "white",
          fontWeight: 600,
          letterSpacing: 0.5,
          textAlign: "center",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          py: 2,
        }}
      >
        {editRule ? "Edit ABAC Rule" : "Add New ABAC Rule"}
      </DialogTitle>

      <DialogContent sx={{ mt: 2, pb: 1 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Role */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Role</InputLabel>
              <Select name="role" value={formData.role} onChange={handleChange}>
                {roles.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Module */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Module</InputLabel>
              <Select name="module" value={formData.module} onChange={handleChange}>
                {modules.map((m) => (
                  <MenuItem key={m} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Method */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Method</InputLabel>
              <Select name="method" value={formData.method} onChange={handleChange}>
                {methods.map((m) => (
                  <MenuItem key={m} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Designation */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Designation</InputLabel>
              <Select
                name="designation"
                value={formData.designation}
                onChange={handleChange}
              >
                {designations.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Department */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Department</InputLabel>
              <Select
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                {departments.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Team */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Team</InputLabel>
              <Select name="team" value={formData.team} onChange={handleChange}>
                {teams.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Action */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Action</InputLabel>
              <Select name="action" value={formData.action} onChange={handleChange}>
                <MenuItem value="allow">Allow</MenuItem>
                <MenuItem value="deny">Deny</MenuItem>
              </Select>
            </FormControl>
          </>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          justifyContent: "center",
          gap: 2,
          backgroundColor: "#f5f7fa",
          borderTop: "1px solid #e0e0e0",
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            textTransform: "none",
            px: 3,
            py: 1,
            borderRadius: 2,
            color: "#555",
            backgroundColor: "#e0e0e0",
            "&:hover": { backgroundColor: "#d6d6d6" },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            textTransform: "none",
            px: 3,
            py: 1,
            borderRadius: 2,
            background: "linear-gradient(90deg, #1976d2, #42a5f5)",
            fontWeight: 600,
          }}
        >
          {editRule ? "Update Rule" : "Add Rule"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AbacModal;
