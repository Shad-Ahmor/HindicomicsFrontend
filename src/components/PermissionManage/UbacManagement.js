// UbacManagement.js
import React, { useMemo,useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
  MenuItem,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
  Stack,
  Tooltip,
  Divider,
  Avatar,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UbacRuleDialog from "./UbacRuleDialog";
import OpenInBrowserIcon from "@mui/icons-material/OpenInBrowser";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { useCallback } from "react";

const DEFAULT_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"];
const niceColors = ["#ff6b6b", "#6bc1ff", "#9b6bff", "#6bff9b", "#ffd36b", "#ff6bd6"];

const cardSx = {
  p: 2,
  borderRadius: 3,
  mb: 2,
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.85), rgba(245,246,255,0.7))",
  boxShadow:
    "0 10px 30px rgba(16,24,40,0.08), 0 6px 12px rgba(16,24,40,0.06) inset",
};

export default function UbacManagement() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ✅ Memoize headers to fix ESLint dependency warning
  const headers = useMemo(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]); // fetched user list
const [userNames, setUserNames] = useState({});

  const [openDialog, setOpenDialog] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null); // null => adding new
  const [formUserId, setFormUserId] = useState("");
  const [formPermissions, setFormPermissions] = useState([
    { base: "/api", url: "/", method: ["GET"], action: "view" },
  ]);

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Evaluate UI state
  const [evalUserId, setEvalUserId] = useState("");
  const [evalBase, setEvalBase] = useState("/api");
  const [evalUrl, setEvalUrl] = useState("/");
  const [evalMethod, setEvalMethod] = useState("GET");
  const [evalAction] = useState("");
  const [evalResult, setEvalResult] = useState(null);
  const [evalLoading, setEvalLoading] = useState(false);
  const [users, setUsers] = useState([]); // instead of const [users] = useState([])

// For base and url options
const baseOptions = useMemo(() => {
  const set = new Set();
  users.forEach(u =>
    u.permissions.forEach(p => {
      if (p.base) set.add(p.base);
    })
  );
  return Array.from(set);
}, [users]);

const urlOptions = useMemo(() => {
  const set = new Set();
  users.forEach(u =>
    u.permissions.forEach(p => {
      if (p.url) set.add(p.url);
    })
  );
  return Array.from(set);
}, [users]);


// ✅ Fetch UBAC rules
const fetchRules = useCallback(async () => {
  setLoading(true);
  try {
    const res = await axios.get("http://localhost:5000/ubac/rules", { headers });
    const data = res.data || {};
    const transformed = [];

    // 🧩 Handle case: data is array instead of object (invalid)
    if (Array.isArray(data)) {
      console.warn("⚠️ UBAC rules returned as array — converting...");
      data.forEach((item, index) => {
        transformed.push({
          userId: item.userId || String(index), // fallback index
          permissions: item.permissions
            ? item.permissions
            : [item], // flatten if single
        });
      });
    } 
    // 🧩 Handle case: data is proper object { uid: {permissions...}, ... }
    else {
      Object.entries(data).forEach(([key, value]) => {
        const userId = key;

        if (!value) return;

        // flat
        if (value.base || value.url || value.method || value.action) {
          transformed.push({
            userId,
            permissions: [
              {
                base: value.base || "",
                url: value.url || "",
                method: Array.isArray(value.method)
                  ? value.method
                  : value.method
                  ? [String(value.method)]
                  : ["GET"],
                action: value.action || "",
              },
            ],
          });
        }
        // nested
        else if (Array.isArray(value.permissions)) {
          transformed.push({
            userId,
            permissions: value.permissions.map((p) => ({
              base: p.base || "",
              url: p.url || "",
              method: Array.isArray(p.method)
                ? p.method
                : p.method
                ? [String(p.method)]
                : ["GET"],
              action: p.action || "",
            })),
          });
        }
      });
    }

    console.log("✅ UBAC transformed:", transformed);
    setUsers(transformed);
  } catch (err) {
    console.error("❌ Failed to fetch UBAC rules:", err);
  } finally {
    setLoading(false);
  }
}, [headers]);


const fetchAllUsers = useCallback(async () => {
  try {
    const res = await axios.post(
      "http://localhost:5000/users",
      { database: "main" },
      { headers }
    );
    const userList = res.data || [];

    // Build lookup map keyed by UID (the one used in UBAC DB)
    const userMap = {};
    userList.forEach((u) => {
      if (u.uid) userMap[u.uid] = u;
    });

    setAllUsers(userList);
    setUserNames(userMap);
  } catch (err) {
    console.error("Failed to fetch users:", err);
  }
}, [headers]);



useEffect(() => {
  fetchRules();
  fetchAllUsers();
}, [fetchRules, fetchAllUsers]);


  // Dialog open for add
  const handleOpenAdd = () => {
    setEditingUserId(null);
    setFormUserId("");
    setFormPermissions([{ base: "/api", url: "/", method: ["GET"], action: "view" }]);
    setOpenDialog(true);
  };

  // Dialog open for edit
const handleOpenEdit = (user) => {
  const userId = user.userId;
  const permissions = (user.permissions || []).map((p) => ({
    base: p.base || "",
    url: p.url || "",
    method: Array.isArray(p.method)
      ? p.method
      : p.method
      ? [String(p.method)]
      : ["GET"],
    action: p.action || "",
  }));
  setEditingUserId(userId);
  setFormUserId(userId);
  setFormPermissions(permissions);
  setOpenDialog(true);
};

  // Permission rows helpers
  const addPermissionRow = () => {
    setFormPermissions((prev) => [...prev, { base: "/api", url: "/", method: ["GET"], action: "" }]);
  };
  const updatePermissionRow = (index, key, value) => {
    setFormPermissions((prev) => prev.map((r, i) => (i === index ? { ...r, [key]: value } : r)));
  };
  const removePermissionRow = (index) => {
    setFormPermissions((prev) => prev.filter((_, i) => i !== index));
  };

  // Save (add or edit)
  const handleSave = async () => {
    if (!formUserId || !formPermissions.length) {
      setSnackbar({ open: true, message: "Provide userId and at least one permission", severity: "error" });
      return;
    }

    // Normalize methods: uppercase unique
    const payloadPermissions = formPermissions.map((p) => ({
      base: p.base || "",
      url: p.url || "",
      method: Array.from(new Set((p.method || []).map((m) => String(m).toUpperCase()))),
      action: p.action || "",
    }));

    try {
      if (editingUserId) {
        await axios.put("http://localhost:5000/ubac/edit-rule", { userId: formUserId, permissions: payloadPermissions }, { headers });
        setSnackbar({ open: true, message: "User permissions updated", severity: "success" });
      } else {
        await axios.post("http://localhost:5000/ubac/add-rule", { userId: formUserId, permissions: payloadPermissions }, { headers });
        setSnackbar({ open: true, message: "User permissions added", severity: "success" });
      }
      setOpenDialog(false);
      fetchRules();
    } catch (err) {
      console.error("Save error:", err);
      const msg = err?.response?.data?.message || "Save failed";
      setSnackbar({ open: true, message: msg, severity: "error" });
    }
  };

  // Delete
  const handleDelete = async (userId) => {
    if (!window.confirm(`Delete all permissions for ${userId}?`)) return;
    try {
      await axios.delete("http://localhost:5000/ubac/delete-rule", { headers, data: { userId } });
      setSnackbar({ open: true, message: "Deleted", severity: "success" });
      fetchRules();
    } catch (err) {
      console.error("Delete error:", err);
      setSnackbar({ open: true, message: "Delete failed", severity: "error" });
    }
  };

  // Evaluate
  const handleEvaluate = async () => {
    if (!evalUserId || !evalBase || !evalUrl || !evalMethod) {
      setSnackbar({ open: true, message: "Fill userId, base, url and method to evaluate", severity: "error" });
      return;
    }
    setEvalLoading(true);
    setEvalResult(null);
    try {
      const res = await axios.post("http://localhost:5000/ubac/evaluate", {
        userId: evalUserId,
        base: evalBase,
        url: evalUrl,
        method: evalMethod,
        action: evalAction || undefined,
      }, { headers });
      setEvalResult(res.data || { accessGranted: false });
    } catch (err) {
      console.error("Evaluate error:", err);
      setSnackbar({ open: true, message: "Evaluate failed", severity: "error" });
    } finally {
      setEvalLoading(false);
    }
  };


  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
    <Paper sx={{ ...cardSx }}>
  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 800 }}>
        🔐 User-Based Access Control (UBAC)
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Manage per-user API permissions — add, edit or remove granular permission sets.
      </Typography>
    </Box>

    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      <Button
        startIcon={<AddIcon />}
        onClick={handleOpenAdd}
        variant="contained"
        sx={{
          background: "linear-gradient(90deg,#8e24aa,#5e35b1)",
          boxShadow: "0 6px 18px rgba(94,53,177,0.24)",
          borderRadius: 3,
        }}
      >
        Add User Rule
      </Button>
      <Button
        onClick={fetchRules}
        startIcon={<OpenInBrowserIcon />}
        variant="outlined"
        sx={{ borderRadius: 3 }}
      >
        Refresh
      </Button>
    </Box>
  </Box>

  <Divider sx={{ mb: 2 }} />

  {/* ✅ Evaluate panel */}
  <Paper sx={{ p: 2, borderRadius: 2, mb: 3, background: "linear-gradient(135deg,#fff,#f7fbff)" }}>
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} md={3}>
        <FormControl fullWidth size="small">
          <InputLabel>User</InputLabel>
          <Select
            value={evalUserId}
            label="User"
            onChange={(e) => setEvalUserId(e.target.value)}
            renderValue={(selected) => {
              const u = allUsers.find((x) => x.uid === selected);
              return u ? `${u.name} (${u.role})` : selected;
            }}
          >
            {allUsers.map((u) => (
              <MenuItem key={u.uid} value={u.uid}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar src={u.imageUrl} alt={u.name} sx={{ width: 28, height: 28 }} />
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>{u.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {u.role}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={2}>
        <Autocomplete
          freeSolo
          options={baseOptions}
          value={evalBase}
          onChange={(e, v) => setEvalBase(v || "")}
          onInputChange={(e, v) => setEvalBase(v)}
          renderInput={(params) => <TextField {...params} label="Base" size="small" fullWidth />}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <Autocomplete
          freeSolo
          options={urlOptions}
          value={evalUrl}
          onChange={(e, v) => setEvalUrl(v || "")}
          onInputChange={(e, v) => setEvalUrl(v)}
          renderInput={(params) => <TextField {...params} label="URL" size="small" fullWidth />}
        />
      </Grid>

      <Grid item xs={12} md={2}>
        <FormControl fullWidth size="small">
          <InputLabel>Method</InputLabel>
          <Select value={evalMethod} label="Method" onChange={(e) => setEvalMethod(e.target.value)}>
            {DEFAULT_METHODS.map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={2} sx={{ textAlign: "right" }}>
        <Button
          startIcon={<SearchIcon />}
          variant="contained"
          onClick={handleEvaluate}
          disabled={evalLoading}
          sx={{ background: "linear-gradient(90deg,#1976d2,#42a5f5)" }}
        >
          {evalLoading ? <CircularProgress size={18} /> : "Evaluate"}
        </Button>
      </Grid>

      {evalResult && (
        <Grid item xs={12}>
          <Alert severity={evalResult.accessGranted ? "success" : "warning"}>
            {evalResult.accessGranted ? "Access Granted ✅" : "Access Denied ❌"}
          </Alert>
        </Grid>
      )}
    </Grid>
  </Paper>

  {/* ✅ List of Users */}
  {loading ? (
    <Box sx={{ py: 6, textAlign: "center" }}>
      <CircularProgress />
    </Box>
  ) : users.length === 0 ? (
    <Box sx={{ py: 6, textAlign: "center" }}>
      <Typography color="text.secondary">No user permissions configured yet.</Typography>
    </Box>
  ) : (
   <Grid container spacing={2}>
  {users.map((u, ui) => {
    // 🔹 Normalize UBAC permission structure
    let permArr = [];
    if (Array.isArray(u.permissions) && u.permissions.length > 0) {
      permArr = u.permissions;
    } else {
      const maybe = {};
      if (u.base || u.url || u.method || u.action) {
        maybe.base = u.base;
        maybe.url = u.url;
        maybe.method = Array.isArray(u.method)
          ? u.method
          : u.method
          ? [String(u.method)]
          : ["GET"];
        maybe.action = u.action || "view";
        permArr = [maybe];
      }
    }

    // 🔹 Find matching user details from allUsers list
    const foundUser = userNames[u.userId] || {};



    const displayName = foundUser.name || u.userId || "Unknown User";

    const avatar = foundUser.imageUrl;

    return (
      <Grid item xs={12} md={6} lg={4} key={u.userId || ui}>
        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(245,250,255,0.85))",
            boxShadow: "0 10px 25px rgba(16,24,40,0.06)",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            {/* 🔹 User Info + Actions */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {avatar && (
                  <Avatar src={avatar} alt={displayName} sx={{ width: 36, height: 36 }} />
                )}
                <Box>
  <Typography sx={{ fontWeight: 800 }}>
    {foundUser.name || `UID: ${u.userId}`}
  </Typography>
  <Typography variant="caption" color="text.secondary">
    {foundUser.role ? foundUser.role.toUpperCase() : "NO ROLE"}
  </Typography>
</Box>

              </Box>

              <Box>
                <Tooltip title="Edit">
                  <IconButton
                    onClick={() =>
                      handleOpenEdit({
                        userId: u.userId || u.id,
                        permissions: permArr,
                      })
                    }
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    onClick={() => handleDelete(u.userId || u.id)}
                    size="small"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* 🔹 Permissions Chips */}
            <Box sx={{ mt: 2 }}>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {permArr.map((p, idx) => {
                    const label = `${p.base}${p.url} • ${(Array.isArray(p.method)
                        ? p.method.join(",")
                        : p.method || "GET")} • ${p.action}`;
                    const color = niceColors[idx % niceColors.length];
                    return (
                        <Chip
                        key={idx}
                        label={label}
                        size="small"
                        sx={{
                            fontWeight: 600,
                            background: `linear-gradient(90deg, ${color}33, ${color}11)`,
                            border: `1px solid ${color}55`,
                            color,
                            borderRadius: "8px",
                        }}
                        />
                    );
                    })}

              </Stack>
            </Box>
          </Box>

          {/* 🔹 Bottom Buttons */}
          <Box sx={{ mt: 2, display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button
              size="small"
              onClick={() => {
                setEvalUserId(u.userId || u.id);
                setSnackbar({
                  open: true,
                  message: `${displayName} selected in evaluate panel`,
                  severity: "info",
                });
              }}
            >
              Select
            </Button>
          </Box>
        </Paper>
      </Grid>
    );
  })}
</Grid>

  )}
</Paper>

<UbacRuleDialog
  open={openDialog}
  onClose={() => setOpenDialog(false)}
  editingUserId={editingUserId}
  allUsers={allUsers}
  formUserId={formUserId}
  setFormUserId={setFormUserId}
  formPermissions={formPermissions}
  addPermissionRow={addPermissionRow}
  updatePermissionRow={updatePermissionRow}
  removePermissionRow={removePermissionRow}
  handleSave={handleSave}
/>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={3500} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}
