import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PositionList = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchPositions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/rolemethod/get-positions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPositions(res.data || []);
    } catch (err) {
      console.error(err);
      setAlert({ open: true, message: "Failed to fetch positions", severity: "error" });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/rolemethod/delete-position`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { positionId: id },
      });
      setAlert({ open: true, message: "Position deleted", severity: "success" });
      fetchPositions();
    } catch (err) {
      console.error(err);
      setAlert({ open: true, message: "Failed to delete position", severity: "error" });
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Position Management
        </Typography>
       
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Role</TableCell>
                <TableCell>Designation</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Skills</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {positions.map((pos) => (
                <TableRow key={pos._id}>
                  <TableCell>{pos.role}</TableCell>
                  <TableCell>{pos.designation}</TableCell>
                  <TableCell>{pos.department}</TableCell>
                  <TableCell>{pos.level}</TableCell>
                  <TableCell>{pos.project}</TableCell>
                  <TableCell>{pos.skills?.join(", ")}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => navigate(`/edit-position/${pos._id}`)}>
                      Edit
                    </Button>
                    <Button
                      color="error"
                      size="small"
                      onClick={() => handleDelete(pos._id)}
                      sx={{ ml: 1 }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

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

export default PositionList;
