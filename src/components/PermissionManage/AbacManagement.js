import React, { useState, useEffect } from "react";
import {
Container,
Box,
Typography,
Table,
TableBody,
TableCell,
TableContainer,
TableHead,
TableRow,
Paper,
Button,
Dialog,
DialogTitle,
DialogContent,
DialogActions,
TextField,
CircularProgress,
Snackbar,
Alert,
IconButton,
Chip,
Tooltip,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import axios from "axios";
import AbacModal from "./AbacModal";

const AbacManagement = () => {
const [rules, setRules] = useState([]);
const [loading, setLoading] = useState(false);
const [openModal, setOpenModal] = useState(false);
const [editRule, setEditRule] = useState(null);
const [snackbar, setSnackbar] = useState({
open: false,
message: "",
severity: "success",
});
const [newRule, setNewRule] = useState({ attributes: {}, action: "" });
const token = localStorage.getItem("token");

const showSnackbar = (msg, severity = "success") => {
setSnackbar({ open: true, message: msg, severity });
};

const fetchRules = async () => {
setLoading(true);
try {
const res = await axios.get("http://localhost:5000/abac/rules", {
headers: { Authorization: `Bearer ${token}` },
});
setRules(
Object.entries(res.data).map(([id, data]) => ({
id,
...data,
}))
);
} catch (err) {
showSnackbar("Error loading ABAC rules", "error");
} finally {
setLoading(false);
}
};

useEffect(() => {
fetchRules();
}, []);

const handleAddRule = async () => {
try {
await axios.post("http://localhost:5000/abac/add-rule", newRule, {
headers: { Authorization: `Bearer ${token}` },
});
showSnackbar("Rule added successfully");
setOpenModal(false);
fetchRules();
} catch {
showSnackbar("Failed to add rule", "error");
}
};

const handleDelete = async (id) => {
try {
await axios.delete("http://localhost:5000/abac/delete-rule", {
headers: { Authorization: `Bearer ${token}` },
data: { id },
});
showSnackbar("Rule deleted");
fetchRules();
} catch {
showSnackbar("Failed to delete rule", "error");
}
};

const handleEdit = async () => {
try {
await axios.put("http://localhost:5000/abac/edit-rule", editRule, {
headers: { Authorization: `Bearer ${token}` },
});
showSnackbar("Rule updated");
setEditRule(null);
fetchRules();
} catch {
showSnackbar("Failed to edit rule", "error");
}
};

return (
<Container maxWidth="lg" sx={{ py: 5 }}>
{/* Header */}
<Box
sx={{
mb: 4,
textAlign: "center",
background: "linear-gradient(135deg, #e3f2fd, #ede7f6)",
borderRadius: 3,
p: 3,
boxShadow:
"0 6px 20px rgba(0,0,0,0.08), inset 2px 2px 6px rgba(255,255,255,0.8)",
}}
>
<Typography
variant="h5"
sx={{
fontWeight: 700,
fontFamily: "Poppins, sans-serif",
letterSpacing: 1,
background: "linear-gradient(90deg, #6a1b9a, #8e24aa, #2196f3)",
WebkitBackgroundClip: "text",
WebkitTextFillColor: "transparent",
}}
>
Attribute-Based Access Control (ABAC) </Typography>
<Typography variant="body2" sx={{ color: "#555" }}>
Manage attribute-driven access rules with an elegant dashboard. </Typography> </Box>

  {/* Table */}
  <Paper
    elevation={6}
    sx={{
      p: 2,
      borderRadius: 3,
      background: "linear-gradient(145deg, #fafafa, #ffffff)",
      boxShadow:
        "6px 6px 16px rgba(0,0,0,0.1), -6px -6px 16px rgba(255,255,255,0.8)",
    }}
  >
    {loading ? (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2, color: "#666" }}>
          Loading Rules...
        </Typography>
      </Box>
    ) : (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f1f3f6" }}>
              <TableCell sx={{ fontWeight: 600 }}>Attributes</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rules.length > 0 ? (
              rules.map((rule) => (
                <TableRow
                  key={rule.id}
                  hover
                  sx={{
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#f8f9fa",
                      transform: "scale(1.01)",
                    },
                  }}
                >
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        maxWidth: 450,
                      }}
                    >
                      {Object.entries(rule.attributes || {}).map(
                        ([key, value]) => (
                          <Chip
                            key={key}
                            label={`${key}: ${value}`}
                            sx={{
                              background: "#e3f2fd",
                              color: "#0d47a1",
                              fontWeight: 500,
                              borderRadius: "8px",
                            }}
                          />
                        )
                      )}
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={rule.action}
                      color="primary"
                      variant="outlined"
                      sx={{
                        fontWeight: 600,
                        borderRadius: 2,
                        textTransform: "capitalize",
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <Tooltip title="Edit Rule">
                      <IconButton
                        onClick={() => setEditRule(rule)}
                        sx={{
                          color: "#1976d2",
                          "&:hover": { transform: "scale(1.1)" },
                          transition: "0.2s",
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete Rule">
                      <IconButton
                        onClick={() => handleDelete(rule.id)}
                        sx={{
                          color: "#e53935",
                          "&:hover": { transform: "scale(1.1)" },
                          transition: "0.2s",
                        }}
                      >
                        <DeleteForeverIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                  <Typography color="text.secondary">
                    No rules found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    )}
  </Paper>

  {/* Add Button */}
  <Box sx={{ textAlign: "center", mt: 4 }}>
    <Button
      variant="contained"
      startIcon={<AddCircleOutlineIcon />}
      onClick={() => setOpenModal(true)}
      sx={{
        background: "linear-gradient(90deg, #8e24aa, #5e35b1)",
        color: "#fff",
        borderRadius: 3,
        px: 3,
        py: 1.2,
        boxShadow: "0 4px 15px rgba(142,36,170,0.4)",
        "&:hover": {
          background: "linear-gradient(90deg, #7b1fa2, #4527a0)",
          transform: "translateY(-2px)",
        },
        transition: "all 0.3s ease",
      }}
    >
      Add New Rule
    </Button>
  </Box>

{/* Add & Edit Modal (Unified ABAC Modal) */}
<AbacModal
  open={openModal || !!editRule}
  onClose={() => {
    setOpenModal(false);
    setEditRule(null);
  }}
  editRule={editRule}
  token={token}
  onSave={async (ruleData) => {
    try {
      if (editRule) {
        await axios.put("http://localhost:5000/abac/edit-rule", {
          id: editRule.id,
          ...ruleData,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showSnackbar("Rule updated successfully");
      } else {
        await axios.post("http://localhost:5000/abac/add-rule", ruleData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showSnackbar("Rule added successfully");
      }

      fetchRules();
      setOpenModal(false);
      setEditRule(null);
    } catch (err) {
      showSnackbar("Failed to save rule", "error");
      console.error(err);
    }
  }}
/>



  {/* Snackbar */}
  <Snackbar
    open={snackbar.open}
    autoHideDuration={3000}
    onClose={() => setSnackbar({ ...snackbar, open: false })}
  >
    <Alert
      severity={snackbar.severity}
      sx={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
    >
      {snackbar.message}
    </Alert>
  </Snackbar>
</Container>


);
};

export default AbacManagement;
