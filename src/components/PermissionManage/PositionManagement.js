import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import PositionList from "./PositionList";
import PositionForm from "./PositionForm";

const PositionManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingPosition, setEditingPosition] = useState(null);

  const handleAdd = () => {
    setEditingPosition(null);
    setShowForm(true);
  };

  const handleEdit = (position) => {
    setEditingPosition(position);
    setShowForm(true);
  };

  const handleBack = () => {
    setShowForm(false);
    setEditingPosition(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      {!showForm ? (
        <>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <h2>Positions</h2>
            <Button variant="contained" onClick={handleAdd}>
              Add Position
            </Button>
          </Box>
          <PositionList onEdit={handleEdit} />
        </>
      ) : (
        <PositionForm editingPosition={editingPosition} onBack={handleBack} />
      )}
    </Box>
  );
};

export default PositionManagement;
