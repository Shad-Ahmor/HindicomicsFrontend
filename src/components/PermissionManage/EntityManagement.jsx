import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
  Autocomplete
} from '@mui/material';
import axios from 'axios';

const EntityManagement = () => {
  const [entities, setEntities] = useState(['Position']);
  const [selectedEntity, setSelectedEntity] = useState('Position');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [positions, setPositions] = useState([]); // store all positions
  const [selectedParent, setSelectedParent] = useState('');
  const token = localStorage.getItem('token');
  const BASE_URL = 'http://localhost:5000/rolemethod';
useEffect(() => {
  const fetchPositions = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/get-positions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPositions(res.data || []);
    } catch (err) {
      console.error('Error fetching positions:', err);
    }
  };
  fetchPositions();
}, [token]);

// ✅ Fetch all entities (positions + sub-entities)
const fetchEntities = useCallback(async () => {
  try {
    const res = await axios.get(`${BASE_URL}/get-positions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = res.data || [];
    const positionNames = data.map((pos) => pos._id);
    setEntities(Array.from(new Set(['Position', ...positionNames])));

    if (!['Position', ...positionNames].includes(selectedEntity)) {
      setSelectedEntity('Position');
    }
  } catch (err) {
    console.error('Error fetching positions:', err);
  }
}, [token, selectedEntity]);

// ✅ Fetch items based on selected entity
const fetchItems = useCallback(async () => {
  try {
    setLoading(true);
    const endpoint =
      selectedEntity === 'Position'
        ? `${BASE_URL}/get-positions`
        : `${BASE_URL}/get/${selectedEntity}`;
    const res = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setItems(Array.isArray(res.data) ? res.data : []);
  } catch (err) {
    console.error(err);
    setAlert({
      open: true,
      message: `Failed to fetch ${selectedEntity}s`,
      severity: 'error',
    });
    setItems([]);
  } finally {
    setLoading(false);
  }
}, [token, selectedEntity]);

  useEffect(() => {
    fetchEntities();
  }, [fetchEntities]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);
  // 🔹 Save (Add or Update)
  
const handleSave = async () => {
  if (!name.trim()) {
    setAlert({
      open: true,
      message: `${selectedEntity} name is required`,
      severity: 'error',
    });
    return;
  }

  // Require parent only for non-position entities
  if (!selectedParent && selectedEntity !== 'Position') {
    setAlert({
      open: true,
      message: 'Parent Position is required for non-Position entities',
      severity: 'error',
    });
    return;
  }

  try {
    const payload = {
      entity: selectedEntity,
      name: name.trim(),
      description: description.trim(),
      parent: selectedParent || null,
      modules: selectedModules,
      methods: [],
    };

    const endpoint =
      selectedEntity.toLowerCase() === 'position'
        ? `${BASE_URL}/update-position`
        : `${BASE_URL}/update-${selectedEntity}`;

    if (editingItem) {
      // 🔹 UPDATE MODE
      const updatePayload =
        selectedEntity.toLowerCase() === 'position'
    ? {
        oldName: editingItem.name || editingItem._id,
        newName: name.trim(),
        updates: { description: description.trim() },
        parent: selectedParent || null, // ✅ add this line
      }
          : {
              entity: selectedEntity,
              oldName: editingItem.name || editingItem._id,
              name: name.trim(),
              description: description.trim(),
              parent: selectedParent || null,
            };

      console.log('🟡 Updating entity:', updatePayload);

      await axios.put(endpoint, updatePayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAlert({
        open: true,
        message: `${selectedEntity} updated successfully`,
        severity: 'success',
      });
    } else {
      // 🔹 ADD MODE
      await axios.post(`${BASE_URL}/add-entity`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAlert({
        open: true,
        message: `${selectedEntity} added successfully`,
        severity: 'success',
      });
    }

    // 🔄 Reset form and reload
    setName('');
    setDescription('');
    setSelectedModules([]);
    setSelectedParent('');
    setEditingItem(null);
    fetchEntities();
    fetchItems();
  } catch (err) {
    console.error('❌ Error in handleSave:', err);

    const message =
      err.response?.data?.message ||
      (editingItem
        ? `Error updating ${selectedEntity}`
        : `Error adding ${selectedEntity}`);

    setAlert({
      open: true,
      message,
      severity: 'error',
    });
  }
};


// 🔹 Handle Edit
const handleEdit = (item) => {
  setEditingItem(item);
  setName(item.name || item._id || '');
  setDescription(item.description || '');
  if (selectedEntity === 'Role') setSelectedModules(item.modules || []);
  setSelectedParent(item.parent || '');
};

// 🔹 Handle Delete
const handleDelete = async (item) => {
  try {
    const deleteUrl =
      selectedEntity.toLowerCase() === 'position'
        ? `${BASE_URL}/delete-position`
        : `${BASE_URL}/delete-${selectedEntity}`;

    const body =
      selectedEntity.toLowerCase() === 'position'
        ? { positionId: item._id }
        : { entity: selectedEntity, name: item.name };

    await axios.delete(deleteUrl, {
      headers: { Authorization: `Bearer ${token}` },
      data: body,
    });

    setAlert({
      open: true,
      message: `${selectedEntity} deleted successfully`,
      severity: 'success',
    });
    fetchItems();
  } catch (err) {
    console.error('❌ Delete Error:', err);
    setAlert({
      open: true,
      message: err.response?.data?.message || `Failed to delete ${selectedEntity}`,
      severity: 'error',
    });
  }
};

  return (
    <Container sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
        Project & Entity Management
      </Typography>

      <Paper elevation={4} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Select Entity</InputLabel>
            <Select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              label="Select Entity"
            >
              {entities.map((e) => (
                <MenuItem key={e} value={e}>
                  {e}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

       <Autocomplete
  options={positions.map((p) => p._id)}

  getOptionLabel={(option) => option}
  value={selectedParent || ''}
  onChange={(e, newValue) => setSelectedParent(newValue)}
  renderInput={(params) => (
    <TextField
      {...params}
      label={
        selectedEntity === 'Position'
          ? 'Parent Position (optional)'
          : 'Parent Position'
      }
      variant="outlined"
      margin="normal"
      fullWidth
    />
  )}
/>



          <TextField
            label={`${selectedEntity} Name`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ flex: 1 }}
          />

          {selectedEntity === 'Position' && (
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ flex: 2 }}
            />
          )}

          <Button
            variant="contained"
            color={editingItem ? 'warning' : 'primary'}
            sx={{ height: 56, px: 4 }}
            onClick={handleSave}
          >
            {editingItem ? 'Update' : 'Add'}
          </Button>
        </Box>
      </Paper>

      <Divider sx={{ mb: 3 }} />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
          {items.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
              No {selectedEntity}s found.
            </Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>{selectedEntity} Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                  {selectedEntity === 'Role' && (
                    <TableCell sx={{ fontWeight: 'bold' }}>Modules</TableCell>
                  )}
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.name || item._id}</TableCell>
                    <TableCell>{item.description || '-'}</TableCell>
                    {selectedEntity === 'Role' && (
                      <TableCell>
                        {Array.isArray(item.modules) ? item.modules.join(', ') : '-'}
                      </TableCell>
                    )}
                    <TableCell align="center">
                      <Button size="small" onClick={() => handleEdit(item)}>
                        Edit
                      </Button>
                      <Button
                        color="error"
                        size="small"
                        onClick={() => handleDelete(item)}
                        sx={{ ml: 1 }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      )}

      {/* ✅ Snackbar for Alerts */}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={alert.severity}
          onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EntityManagement;
