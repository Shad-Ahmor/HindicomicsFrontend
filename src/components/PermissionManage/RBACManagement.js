import React, { useState, useEffect } from "react";
import {
  Container, Typography, Card, Box, Button, FormControl, InputLabel, Select,
  MenuItem, Snackbar, Alert, CircularProgress, Chip, Dialog, DialogTitle,
  DialogContent, TextField, DialogActions, IconButton, Pagination
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import RBACForm from "./RBACForm";
import RBACTable from "./RBACTable";

const ITEMS_PER_PAGE = 5;

const RBACManagement = () => {
  const [mode, setMode] = useState("role"); // 🔹 "role" | "designation"
  const [roles, setRoles] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [modules, setModules] = useState([]);
  const [methods, setMethods] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newPermission, setNewPermission] = useState({ module: "", method: [], url: "", role: [] });
  const [oldPermission, setOldPermission] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [entityType, setEntityType] = useState("role");
  const [roleDialog, setRoleDialog] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [roleEdit, setRoleEdit] = useState(null);

  const [desigDialog, setDesigDialog] = useState(false);
  const [desigName, setDesigName] = useState("");
  const [desigEdit, setDesigEdit] = useState(null);

  const [rolePage, setRolePage] = useState(1);
  const [desigPage, setDesigPage] = useState(1);

  const BASE_URL = "http://localhost:5000/rolemethod";
  const token = localStorage.getItem("token");

  const showSnackbar = (msg, severity = "success") =>
    setSnackbar({ open: true, message: msg, severity });

  // ---------------- FETCH INITIAL ----------------
  useEffect(() => {
    fetchInitialData();
  }, [token]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [roleRes, moduleRes, methodRes, desigRes] = await Promise.all([
        axios.get(`${BASE_URL}/get-roles`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${BASE_URL}/get-modules`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${BASE_URL}/get-methods`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${BASE_URL}/get-designation`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setRoles(roleRes.data || []);
      setModules(Object.keys(moduleRes.data || {}).map(k => ({ name: k })));
      setMethods(Object.keys(methodRes.data || {}).map(k => ({ name: k })));
      setDesignations(desigRes.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      showSnackbar("Failed to fetch data", "error");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- CHANGE MODE ----------------
  const handleModeChange = (e) => {
    setMode(e.target.value);
    setSelectedEntity("");
    setPermissions([]);
  };

  // ---------------- LOAD PERMISSIONS ----------------
const handleEntityChange = async (e) => {
  const entity = e.target.value;
  setSelectedEntity(entity);
  if (!entity) return;
  setLoading(true);
  try {
    const endpoint = `${BASE_URL}/permissions?mode=${mode}&entity=${entity}`;
    const res = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Loaded permissions for", entity, ":", res.data.permissions);
    setPermissions(res.data || []);
  } catch (err) {
    console.error("Permission fetch error:", err);
    showSnackbar("Error loading permissions", "error");
  } finally {
    setLoading(false);
  }
};


  // ---------------- CRUD HANDLERS (Role + Designation kept same as before) ----------------
  const handleOpenRoleDialog = (role = null) => {
    setRoleEdit(role);
    setRoleName(role || "");
    setRoleDialog(true);
  };

const handleSaveEntity = async (type) => {
  const isRole = type === "role";
  const name = isRole ? roleName.trim() : desigName.trim();
  const edit = isRole ? roleEdit : desigEdit;

  if (!name) {
    showSnackbar(`${isRole ? "Role" : "Designation"} name required`, "error");
    return;
  }

  try {
    const url = `${BASE_URL}/${edit ? "update" : "add"}-permissions/${type}`;
    const payload = edit
      ? { oldName: edit, newName: name }
      : { name };

    await axios[edit ? "put" : "post"](url, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    showSnackbar(`${isRole ? "Role" : "Designation"} ${edit ? "updated" : "added"}`);
    if (isRole) {
      setRoleDialog(false);
      setRoleName("");
      setRoleEdit(null);
    } else {
      setDesigDialog(false);
      setDesigName("");
      setDesigEdit(null);
    }
    fetchInitialData();
  } catch (err) {
    console.error("❌ handleSaveEntity:", err);
    showSnackbar(`Error saving ${isRole ? "role" : "designation"}`, "error");
  }
};



  const handleOpenDesigDialog = (desig = null) => {
    setDesigEdit(desig);
    setDesigName(desig || "");
    setDesigDialog(true);
  };


const handleDeletePermission = async (type, name) => {
  if (!window.confirm(`Delete ${type.toLowerCase()} "${name}"?`)) return;

  try {
    await axios.delete(`${BASE_URL}/delete-permissions/${type}/${name}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    showSnackbar(`${type} deleted successfully`);

    if (selectedEntity === name) setSelectedEntity("");
    fetchInitialData();
  } catch (err) {
    console.error(`❌ Error deleting ${type.toLowerCase()}:`, err);
    showSnackbar(`Error deleting ${type.toLowerCase()}`, "error");
  }
};


  // ---------------- PAGINATION ----------------
  const handleRolePageChange = (_, value) => setRolePage(value);
  const handleDesigPageChange = (_, value) => setDesigPage(value);

  const paginatedRoles = roles.slice((rolePage - 1) * ITEMS_PER_PAGE, rolePage * ITEMS_PER_PAGE);
  const paginatedDesigs = designations.slice((desigPage - 1) * ITEMS_PER_PAGE, desigPage * ITEMS_PER_PAGE);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Unified Access Control (Role / Designation)
      </Typography>

      {/* 🔹 Toggle Between Role-Based / Designation-Based */}
      <FormControl sx={{ mb: 3, width: 300 }}>
        <InputLabel>Select Access Type</InputLabel>
        <Select value={mode} label="Select Access Type" onChange={handleModeChange}>
          <MenuItem value="role">Role-Based Access</MenuItem>
          <MenuItem value="designation">Designation-Based Access</MenuItem>
        </Select>
      </FormControl>

      {/* 🔹 Side-by-side cards remain same */}
      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mb: 4 }}>
        {/* Roles */}
        <Card sx={{ flex: 1, minWidth: 280, p: 3, borderRadius: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">Manage Roles</Typography>
            <Button variant="contained" onClick={() => handleOpenRoleDialog()}>Add Role</Button>
          </Box>
          {paginatedRoles.map((r, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography>{r}</Typography>
                <Box>
                  <IconButton color="primary" onClick={() => handleOpenRoleDialog(r)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeletePermission("Role", r)}>
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
            ))}

          {roles.length > ITEMS_PER_PAGE && (
            <Pagination count={Math.ceil(roles.length / ITEMS_PER_PAGE)} page={rolePage} onChange={handleRolePageChange} sx={{ mt: 2, display: "flex", justifyContent: "center" }} />
          )}
        </Card>

        {/* Designations */}
        <Card sx={{ flex: 1, minWidth: 280, p: 3, borderRadius: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">Manage Designations</Typography>
            <Button variant="contained" onClick={() => handleOpenDesigDialog()}>Add Designation</Button>
          </Box>
          {paginatedDesigs.map((d, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography>{d}</Typography>
                <Box>
                  <IconButton color="primary" onClick={() => handleOpenDesigDialog(d)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeletePermission("Designation", d)}>
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
            ))}

          {designations.length > ITEMS_PER_PAGE && (
            <Pagination count={Math.ceil(designations.length / ITEMS_PER_PAGE)} page={desigPage} onChange={handleDesigPageChange} sx={{ mt: 2, display: "flex", justifyContent: "center" }} />
          )}
        </Card>
      </Box>

      {/* 🔹 Permissions Section (Dynamic based on mode) */}
      <Card sx={{ p: 4, mb: 4, borderRadius: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            Manage {mode === "role" ? "Role" : "Designation"} Permissions
          </Typography>
          <Button variant="contained" onClick={() => setOpenForm(true)}>Add Permission</Button>
        </Box>

        <FormControl fullWidth>
          <InputLabel>
            Select {mode === "role" ? "Role" : "Designation"}
          </InputLabel>
          <Select value={selectedEntity} onChange={handleEntityChange}>
            {(mode === "role" ? roles : designations).map((r, i) => (
              <MenuItem key={i} value={r}>{r}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Card>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}><CircularProgress /></Box>
      ) : (
        selectedEntity && (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>
              <Chip label={selectedEntity} color="primary" /> — Permissions Overview
            </Typography>
            <RBACTable
              permissions={permissions}
              onEdit={(p) => {
                setOldPermission(p);
                setNewPermission({
                  module: p.baseurl.replace("/", ""),
                  method: Array.isArray(p.method) ? p.method : [p.method],
                  url: p.url.replace("/", ""),
                  role: [selectedEntity],
                });
                setEditMode(true);
                setOpenForm(true);
              }}
              onDelete={async (p) => {
                try {
                  await axios.delete(`${BASE_URL}/deletePermission`, {
                    headers: { Authorization: `Bearer ${token}` },
                    data: { baseurl: p.baseurl, method: p.method, url: p.url, role: selectedEntity },
                  });
                  showSnackbar("Deleted successfully");
                  handleEntityChange({ target: { value: selectedEntity } });
                } catch {
                  showSnackbar("Error deleting", "error");
                }
              }}
            />
          </>
        )
      )}

      {/* 🔹 RBAC Form */}
   <RBACForm
  open={openForm}
  onClose={() => setOpenForm(false)}
  editMode={editMode}
  newPermission={newPermission}
  handleInputChange={(e) =>
    setNewPermission((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }))
  }
  handleSavePermission={async () => {
    // 🔸 Validate required fields
    if (
      !newPermission.role?.length ||
      !newPermission.module ||
      !newPermission.method?.length ||
      !newPermission.url
    ) {
      showSnackbar("All fields are required", "warning");
      return;
    }

    // 🔸 Define API endpoint dynamically
    const url = editMode
      ? `${BASE_URL}/edit-permissions/${entityType}`
      : `${BASE_URL}/save-permissions/${entityType}`;

    // 🔸 Construct payload properly
   const payload = editMode
  ? {
      baseurl: oldPermission.baseurl,
      method:
        Array.isArray(oldPermission.method) && oldPermission.method.length
          ? oldPermission.method[0]
          : oldPermission.method,
      url: oldPermission.url,
      newBaseurl: `/${newPermission.module}`,
      newMethod:
        Array.isArray(newPermission.method) && newPermission.method.length
          ? newPermission.method[0]
          : newPermission.method,
      newUrl: newPermission.url,
      role: newPermission.role,
      entityType, // ✅ whether it's role or designation
    }
  : {
      baseurl: `/${newPermission.module}`,
      url: newPermission.url,
      method:
        Array.isArray(newPermission.method) && newPermission.method.length
          ? newPermission.method[0]
          : newPermission.method,
      module: newPermission.module,
      entityType, // ✅ role/designation type
      role: newPermission.role,

    };

    try {
      await axios({
        method: editMode ? "put" : "post",
        url,
        data: payload,
        headers: { Authorization: `Bearer ${token}` },
      });

      showSnackbar(editMode ? "Permission updated" : "Permission added");
      setOpenForm(false);
      setEditMode(false);
      handleEntityChange({ target: { value: selectedEntity } });
    } catch (err) {
      console.error("❌ handleSavePermission error:", err);
      showSnackbar("Error saving permission", "error");
    }
  }}
  roles={roles}
  designations={designations}
  modules={modules}
  methods={methods}
  entityType={entityType} // ✅ dropdown value (role/designation)
  setEntityType={setEntityType} // ✅ updates dropdown
/>


      {/* 🔹 Dialogs */}
      <Dialog open={roleDialog} onClose={() => setRoleDialog(false)}>
        <DialogTitle>{roleEdit ? "Edit Role" : "Add Role"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Role Name"
            fullWidth
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoleDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => handleSaveEntity("role")}
          >
            {roleEdit ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog open={desigDialog} onClose={() => setDesigDialog(false)}>
        <DialogTitle>{desigEdit ? "Edit Designation" : "Add Designation"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Designation"
            fullWidth
            value={desigName}
            onChange={(e) => setDesigName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDesigDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => handleSaveEntity("designation")}
          >
            {desigEdit ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>


      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default RBACManagement;
