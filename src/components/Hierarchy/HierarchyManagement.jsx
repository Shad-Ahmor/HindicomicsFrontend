import React, { useState, useEffect } from "react";
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
  MenuItem,
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
  Chip,
  Collapse,
  Pagination,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import BusinessIcon from "@mui/icons-material/Business";
import axios from "axios";

const API_BASE = "http://localhost:5000/hierarchy";

const TYPES = [
  "Company",
  "LegalEntity",
  "BusinessUnit",
  "Region",
  "Department",
  "SubDepartment",
  "Team",
  "SubTeam",
];

const TYPE_COLORS = {
  Company: "#4CAF50",
  LegalEntity: "#2196F3",
  BusinessUnit: "#9C27B0",
  Region: "#FF9800",
  Department: "#009688",
  SubDepartment: "#795548",
  Team: "#673AB7",
  SubTeam: "#E91E63",
};

const NEXT_TYPE = {
  Company: "LegalEntity",
  LegalEntity: "BusinessUnit",
  BusinessUnit: "Region",
  Region: "Department",
  Department: "SubDepartment",
  SubDepartment: "Team",
  Team: "SubTeam",
};

const HierarchyManagement = () => {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editNode, setEditNode] = useState(null);
  const [form, setForm] = useState({
    name: "",
    type: "",
    parentId: null,
    meta: {},
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [expanded, setExpanded] = useState({});
  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  const showSnackbar = (msg, sev = "success") =>
    setSnackbar({ open: true, message: msg, severity: sev });

  const fetchNodes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/`, { headers });
      setNodes(res.data || []);
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to fetch hierarchy", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNodes();
  }, []);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 🧭 Build tree recursively
  const buildTree = (parentId = null, level = 0) => {
    const children = nodes.filter((n) => (n.parentId || null) === parentId);
    if (!children.length) return null;

    return (
      <Box sx={{ ml: level > 0 ? 4 : 0 }}>
        {children.map((n) => {
          const hasChildren = nodes.some((x) => x.parentId === n.id);
          return (
            <Paper
              key={n.id}
              elevation={6}
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${TYPE_COLORS[n.type] || "#ccc"}22, #fff)`,
                borderLeft: `6px solid ${TYPE_COLORS[n.type] || "#ccc"}`,
                transition: "0.3s ease all",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {hasChildren && (
                    <IconButton
                      size="small"
                      onClick={() => toggleExpand(n.id)}
                      sx={{ color: TYPE_COLORS[n.type] || "#666" }}
                    >
                      {expanded[n.id] ? (
                        <ExpandLessIcon fontSize="small" />
                      ) : (
                        <ExpandMoreIcon fontSize="small" />
                      )}
                    </IconButton>
                  )}
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                      color: TYPE_COLORS[n.type] || "#333",
                    }}
                  >
                    {n.name}
                  </Typography>
                  <Chip
                    label={n.type}
                    size="small"
                    sx={{
                      backgroundColor: TYPE_COLORS[n.type] || "#90a4ae",
                      color: "#fff",
                      fontWeight: 500,
                    }}
                  />
                </Box>
                <Box>
                  <IconButton
                    size="small"
                    sx={{
                      color: "#4CAF50",
                      "&:hover": { background: "#E8F5E9" },
                    }}
                    onClick={() => onAddChild(n)}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{
                      color: "#1976d2",
                      "&:hover": { background: "#E3F2FD" },
                    }}
                    onClick={() => onEdit(n)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{
                      color: "#d32f2f",
                      "&:hover": { background: "#FFEBEE" },
                    }}
                    onClick={() => onDelete(n)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              {/* Recursive children */}
              <Collapse in={expanded[n.id] || level === 0} timeout="auto">
                {buildTree(n.id, level + 1)}
              </Collapse>
            </Paper>
          );
        })}
      </Box>
    );
  };

  // 🧭 Pagination for top-level Companies
  const rootCompanies = nodes.filter((n) => n.parentId === null);
  const totalPages = Math.ceil(rootCompanies.length / ITEMS_PER_PAGE);
  const paginatedCompanies = rootCompanies.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const onAddRoot = () => {
    setEditNode(null);
    setForm({ name: "", type: "Company", parentId: null, meta: {} });
    setOpenModal(true);
  };

  const onAddChild = (parent) => {
    setEditNode(null);
    setForm({
      name: "",
      type: NEXT_TYPE[parent.type] || "",
      parentId: parent.id,
      meta: {},
    });
    setOpenModal(true);
  };

  const onEdit = (node) => {
    setEditNode(node);
    setForm({
      name: node.name || "",
      type: node.type || "",
      parentId: node.parentId || null,
      meta: node.meta || {},
    });
    setOpenModal(true);
  };

  const onDelete = async (node) => {
    if (!window.confirm(`Delete "${node.name}"?`)) return;
    try {
      await axios.delete(`${API_BASE}/`, {
        headers,
        data: { id: node.id },
      });
      showSnackbar("Deleted");
      fetchNodes();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Delete failed";
      showSnackbar(msg, "error");
    }
  };

  const handleSubmit = async () => {
    try {
      if (!form.name || !form.type) {
        showSnackbar("Name and type required", "error");
        return;
      }

      if (editNode) {
        await axios.put(
          `${API_BASE}/`,
          { id: editNode.id, ...form },
          { headers }
        );
        showSnackbar("Updated");
      } else {
        await axios.post(`${API_BASE}/`, form, { headers });
        showSnackbar("Added");
      }
      setOpenModal(false);
      setEditNode(null);
      fetchNodes();
    } catch (err) {
      console.error(err);
      showSnackbar("Save failed", "error");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        sx={{
          p: 3,
          borderRadius: 4,
          background: "linear-gradient(135deg, #f9f9fb 0%, #eef3ff 100%)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(90deg, #1976d2, #42a5f5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            <BusinessIcon sx={{ mr: 1, color: "#1976d2" }} />
            Organisation Hierarchy
          </Typography>
          <Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAddRoot}
              sx={{
                mr: 1,
                borderRadius: 3,
                background: "linear-gradient(90deg, #1976d2, #42a5f5)",
              }}
            >
              Add Company
            </Button>
            <Button variant="outlined" onClick={fetchNodes} sx={{ borderRadius: 3 }}>
              Refresh
            </Button>
          </Box>
        </Box>

        {/* Data */}
        {loading ? (
          <Box sx={{ textAlign: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : paginatedCompanies.length > 0 ? (
          <>
           {paginatedCompanies.map((root) => (
  <Paper
    key={root.id}
    elevation={6}
    sx={{
      p: 2,
      mb: 3,
      borderRadius: 3,
      background: `linear-gradient(135deg, ${TYPE_COLORS[root.type] || "#ccc"}22, #fff)`,
      borderLeft: `6px solid ${TYPE_COLORS[root.type] || "#ccc"}`,
    }}
  >
    {/* Company Header */}
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: TYPE_COLORS[root.type] || "#333" }}>
          {root.name}
        </Typography>
        <Chip
          label={root.type}
          size="small"
          sx={{
            backgroundColor: TYPE_COLORS[root.type] || "#90a4ae",
            color: "#fff",
            fontWeight: 500,
          }}
        />
      </Box>
      <Box>
        <IconButton
          size="small"
          sx={{ color: "#4CAF50", "&:hover": { background: "#E8F5E9" } }}
          onClick={() => onAddChild(root)}
        >
          <AddIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          sx={{ color: "#1976d2", "&:hover": { background: "#E3F2FD" } }}
          onClick={() => onEdit(root)}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          sx={{ color: "#d32f2f", "&:hover": { background: "#FFEBEE" } }}
          onClick={() => onDelete(root)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>

    {/* Show children under this company */}
    <Box sx={{ mt: 2, ml: 4 }}>
      {buildTree(root.id)}
    </Box>
  </Paper>
))}

            {/* Pagination */}
            <Divider sx={{ my: 3 }} />
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, v) => setPage(v)}
                color="primary"
                shape="rounded"
                size="large"
              />
            </Box>
          </>
        ) : (
          <Typography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
            No hierarchy data available.
          </Typography>
        )}
      </Paper>

      {/* 🌟 Modal - Modernized */}
     <Dialog
  open={openModal}
  onClose={() => setOpenModal(false)}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: 4,
      backdropFilter: "blur(10px)",
      background:
        "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(245,247,255,0.9))",
      boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
    },
  }}
>
  <DialogTitle
    sx={{
      background: "linear-gradient(90deg, #1976d2, #42a5f5)",
      color: "white",
      fontWeight: 600,
      textAlign: "center",
      py: 2,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    }}
  >
    {editNode ? `Edit "${editNode.name}"` : "Add New Node"}
  </DialogTitle>

  <DialogContent sx={{ py: 3,mt:4 }}>
    {/* Name */}
    <TextField
      label="Name"
      fullWidth
      variant="outlined"
      value={form.name}
      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
      sx={{
        mb: 2,
        "& .MuiOutlinedInput-root": {
          borderRadius: 3,
          background: "#fff",
        },
      }}
    />

    {/* Type */}
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel>Type</InputLabel>
      <Select
        value={form.type}
        onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
        sx={{ borderRadius: 3, background: "#fff" }}
      >
        {TYPES.map((t) => (
          <MenuItem key={t} value={t}>
            {t}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    {/* Parent */}
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel>Parent</InputLabel>
      <Select
        value={form.parentId || ""}
        onChange={(e) =>
          setForm((p) => ({
            ...p,
            parentId: e.target.value || null,
          }))
        }
        sx={{ borderRadius: 3, background: "#fff" }}
      >
        <MenuItem value="">(root)</MenuItem>
        {nodes.map((n) => (
          <MenuItem key={n.id} value={n.id}>
            {`${n.name} (${n.type})`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    {/* Meta */}
    <TextField
      label="Meta (JSON optional)"
      fullWidth
      multiline
      minRows={2}
      value={JSON.stringify(form.meta || {})}
      onChange={(e) => {
        try {
          const parsed = JSON.parse(e.target.value);
          setForm((p) => ({ ...p, meta: parsed }));
        } catch {
          // ignore parse error
        }
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 3,
          background: "#fff",
        },
      }}
      helperText="Optional JSON metadata"
    />
  </DialogContent>

  <DialogActions
    sx={{
      p: 2,
      justifyContent: "center",
      background: "#f5f7fa",
      borderTop: "1px solid #e0e0e0",
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
    }}
  >
    <Button
      onClick={() => {
        setOpenModal(false);
        setEditNode(null);
      }}
      sx={{
        borderRadius: 3,
        px: 3,
        py: 1,
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
        borderRadius: 3,
        background: "linear-gradient(90deg, #1976d2, #42a5f5)",
        fontWeight: 600,
      }}
    >
      {editNode ? "Update" : "Add"}
    </Button>
  </DialogActions>
</Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default HierarchyManagement;
