import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Paper,
  IconButton,
  Box,
  Typography,
  Divider,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";

const DEFAULT_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"];

export default function UbacRuleDialog({
  open,
  onClose,
  editingUserId,
  allUsers,
  formUserId,
  setFormUserId,
  formPermissions,
  addPermissionRow,
  updatePermissionRow,
  removePermissionRow,
  handleSave,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: "linear-gradient(145deg, #f9fbff, #ffffff)",
          boxShadow:
            "0 12px 40px rgba(0,0,0,0.1), inset 0 0 20px rgba(255,255,255,0.5)",
        },
      }}
    >
      {/* 🔹 Header */}
      <DialogTitle
        sx={{
          background: "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
          color: "white",
          py: 2.5,
          px: 4,
          fontWeight: 700,
          fontSize: "1.3rem",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          letterSpacing: 0.5,
        }}
      >
        {editingUserId
          ? `Edit Permissions — ${editingUserId}`
          : "➕ Add New User Permissions"}
      </DialogTitle>

      {/* 🔹 Body */}
      <DialogContent
        sx={{
          py: 5,
          px: 5,
          background:
            "linear-gradient(145deg, #ffffff 60%, #f3f6ff 100%)",
        }}
      >
        <Grid container spacing={4}>
          {/* User Picker */}
          <Grid item style={{marginTop:10}} xs={12} md={6}>
           
            <FormControl fullWidth variant="outlined" size="medium">
              <Select
                value={formUserId}
                onChange={(e) => setFormUserId(e.target.value)}
                sx={{
                  borderRadius: 2,
                  background: "#fff",
                  boxShadow: "0 3px 12px rgba(0,0,0,0.06)",
                  "& .MuiSelect-select": { py: 1.5 },
                }}
                displayEmpty
              >
                <MenuItem disabled value="">
                  <em>Select User...</em>
                </MenuItem>
                {allUsers.map((u) => (
                  <MenuItem key={u.id} value={u.id}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <img
                        src={u.imageUrl}
                        alt={u.name}
                        width={32}
                        height={32}
                        style={{
                          borderRadius: "50%",
                          objectFit: "cover",
                          boxShadow: "0 0 6px rgba(0,0,0,0.2)",
                        }}
                      />
                      <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                          {u.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {u.role} — {u.email}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Manual Input */}
          <Grid style={{marginTop:10}}  item xs={12} md={6}>
            
            <TextField
              fullWidth
              placeholder="Type userId manually"
              value={formUserId}
              onChange={(e) => setFormUserId(e.target.value)}
              sx={{
                background: "#fff",
                borderRadius: 2,
                boxShadow: "0 3px 12px rgba(0,0,0,0.06)",
                "& .MuiInputBase-input": { py: 1.5 },
              }}
            />
          </Grid>

          {/* Permissions Section */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#374151",
                }}
              >
                API Permissions
              </Typography>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addPermissionRow}
                sx={{
                  borderRadius: 3,
                  fontWeight: 600,
                  background:
                    "linear-gradient(90deg, #8e24aa, #5e35b1)",
                  boxShadow: "0 6px 18px rgba(94,53,177,0.24)",
                }}
              >
                Add Permission
              </Button>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {formPermissions.map((row, i) => (
                <Paper
                  key={i}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background:
                      "linear-gradient(145deg, #ffffff, #f0f3ff)",
                    boxShadow:
                      "0 8px 28px rgba(0,0,0,0.08), inset 0 0 8px rgba(255,255,255,0.6)",
                    transition: "0.3s",
                    "&:hover": {
                      boxShadow:
                        "0 10px 32px rgba(0,0,0,0.12), inset 0 0 12px rgba(255,255,255,0.7)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Base"
                        value={row.base}
                        fullWidth
                        size="small"
                        onChange={(e) =>
                          updatePermissionRow(i, "base", e.target.value)
                        }
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        label="URL"
                        value={row.url}
                        fullWidth
                        size="small"
                        onChange={(e) =>
                          updatePermissionRow(i, "url", e.target.value)
                        }
                      />
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Method</InputLabel>
                        <Select
                          multiple
                          value={row.method || []}
                          onChange={(e) =>
                            updatePermissionRow(i, "method", e.target.value)
                          }
                          renderValue={(selected) =>
                            Array.isArray(selected)
                              ? selected.join(", ")
                              : selected
                          }
                        >
                          {DEFAULT_METHODS.map((m) => (
                            <MenuItem key={m} value={m}>
                              {m}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={9} md={1.5}>
                      <TextField
                        label="Action"
                        value={row.action}
                        fullWidth
                        size="small"
                        onChange={(e) =>
                          updatePermissionRow(i, "action", e.target.value)
                        }
                      />
                    </Grid>

                    <Grid item xs={3} md={0.5} sx={{ textAlign: "right" }}>
                      <IconButton
                        color="error"
                        onClick={() => removePermissionRow(i)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      {/* 🔹 Footer */}
      <DialogActions
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #f9faff, #eef3ff)",
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          boxShadow: "inset 0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            borderRadius: 3,
            px: 3,
            fontWeight: 600,
            color: "#555",
            "&:hover": {
              background: "#f1f1f1",
            },
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          sx={{
            borderRadius: 3,
            px: 3,
            fontWeight: 700,
            background: "linear-gradient(90deg, #1976d2, #42a5f5)",
            boxShadow: "0 6px 14px rgba(25,118,210,0.3)",
            "&:hover": {
              background: "linear-gradient(90deg, #1565c0, #1e88e5)",
              boxShadow: "0 8px 18px rgba(25,118,210,0.4)",
            },
          }}
        >
          {editingUserId ? "Save Changes" : "Create Rule"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
