// RBACForm.jsx
import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, FormControl, InputLabel, Select, MenuItem, Chip, Box, OutlinedInput
} from "@mui/material";

const RBACForm = ({
  open,
  onClose,
  editMode,
  newPermission,
  handleInputChange,
  handleSavePermission,
  roles,
  designations,
  modules,
  methods,
  entityType,
  setEntityType,
}) => {
  const entityOptions = [
    { label: "Role-Based", value: "role" },
    { label: "Designation-Based", value: "designation" },
  ];

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
          transition: "all 0.3s ease-in-out",
          "&:hover": { boxShadow: 12 },
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(90deg, #1976d2, #42a5f5)",
          color: "white",
          fontWeight: 600,
          textAlign: "center",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          py: 2,
          letterSpacing: 0.5,
        }}
      >
        {editMode ? "Edit Permission" : "Add New Permission"}
      </DialogTitle>

      <DialogContent
        sx={{
          mt: 3,
          pb: 1,
          px: 2,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* 🔹 Selection for Role or Designation */}
        <FormControl fullWidth>
          <InputLabel>Permission Type</InputLabel>
          <Select
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
            sx={{
              borderRadius: 2,
              backgroundColor: "white",
              "&:hover": { backgroundColor: "#f9fbff" },
            }}
          >
            {entityOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ transition: "0.3s" }}>
          <InputLabel>Module</InputLabel>
          <Select
            name="module"
            value={newPermission.module}
            onChange={handleInputChange}
            sx={{
              borderRadius: 2,
              backgroundColor: "white",
              transition: "0.2s",
              "&:hover": { backgroundColor: "#f9fbff" },
            }}
          >
            {modules.map((m) => (
              <MenuItem key={m.name} value={m.name}>
                {m.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ transition: "0.3s" }}>
        <InputLabel>Method</InputLabel>
        <Select
            name="method"
            value={newPermission.method}
            onChange={handleInputChange}
            sx={{
            borderRadius: 2,
            backgroundColor: "white",
            "&:hover": { backgroundColor: "#f9fbff" },
            }}
        >
            {methods.map((m) => (
            <MenuItem key={m.name} value={m.name}>
                {m.name}
            </MenuItem>
            ))}
        </Select>
        </FormControl>


        <TextField
          label="Endpoint (URL)"
          fullWidth
          sx={{
            mb: 1,
            borderRadius: 2,
            backgroundColor: "white",
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": { borderColor: "#42a5f5" },
              "&.Mui-focused fieldset": { borderColor: "#1976d2" },
            },
          }}
          name="url"
          value={newPermission.url}
          onChange={handleInputChange}
        />

        {/* 🔹 Conditionally show Role or Designation dropdown */}
        <FormControl fullWidth>
            <InputLabel>{entityType === "designation" ? "Designation" : "Role"}</InputLabel>
            <Select
                name="role"
                value={newPermission.role}
                onChange={handleInputChange}
                input={<OutlinedInput label={entityType === "designation" ? "Designation" : "Role"} />}
                sx={{
                borderRadius: 2,
                backgroundColor: "white",
                "&:hover": { backgroundColor: "#f9fbff" },
                }}
            >
                {(entityType === "designation" ? designations : roles).map((item) => (
                <MenuItem key={item} value={item}>
                    {item}
                </MenuItem>
                ))}
            </Select>
            </FormControl>

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
            "&:hover": { backgroundColor: "#d6d6d6", transform: "scale(1.03)" },
            transition: "all 0.2s ease-in-out",
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSavePermission}
          sx={{
            textTransform: "none",
            px: 3,
            py: 1,
            borderRadius: 2,
            background: "linear-gradient(90deg, #1976d2, #42a5f5)",
            fontWeight: 600,
            "&:hover": {
              background: "linear-gradient(90deg, #1565c0, #2196f3)",
              transform: "scale(1.03)",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          {editMode ? "Update Permission" : "Add Permission"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RBACForm;
