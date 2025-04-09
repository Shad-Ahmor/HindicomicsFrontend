import React, { useState, useEffect } from 'react';
import api from './api';
import axios from 'axios'; // Axios to make API requests

import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit, Delete } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid'; // Import UUID package

const CouponPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({ code: '', expiredate: '', name: '', points: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCode, setSelectedCode] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [users, setUsers] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await fetchUsers(); // Fetch users first
      fetchCoupons(); // Then fetch coupons
    };
    fetchData();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found.');
        navigate('/login');  // Redirect to login if no token exists
        return;
      }      const response = await api.post('/users', { database: 'users' }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userMapping = response.data.reduce((acc, user) => {
        acc[user.id] = user.email;
        return acc;
      }, {});
      setUsers(userMapping);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found.');
        navigate('/login');  // Redirect to login if no token exists
        return;
      }
      const response = await api.get('/coupons', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const expandedCoupons = response.data.flatMap((coupon) =>
        coupon.usedBy.length > 0
          ? coupon.usedBy.map((uid) => ({
              ...coupon,
              id: `${coupon.code}-${uid}`,
              usedBy: users[uid] || uid,
              parentCode: coupon.code,
            }))
          : [{ ...coupon, id: coupon.code, usedBy: 'N/A', parentCode: null }]
      );
      setCoupons(expandedCoupons);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCoupon({ ...newCoupon, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('Token not found.');
        navigate('/login');  // Redirect to login if no token exists
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };
      let couponData = { ...newCoupon };
    
      // Generate a unique ID if not provided
      if (!couponData.id) {
        couponData.id = uuidv4();
      }
      
      if (isEditing) {
        await api.put(`/coupons/${selectedCode}`, couponData, { headers });
      } else {
        await api.post('/coupons/create', couponData, { headers });
      }
      await fetchCoupons();
      setNewCoupon({ code: '', expiredate: '', id: '', name: '', points: '' });
      setIsEditing(false);
      setOpenForm(false);
    } catch (error) {
      console.error('Error submitting coupon:', error);
    }
  };
  const handleEdit = (rowId) => {
    const coupon = coupons.find((c) => c.id === rowId);
    if (coupon) {
      setNewCoupon({
        code: coupon.code,
        expiredate: coupon.expiredate,
        name: coupon.name,
        points: coupon.points,
      });
      setIsEditing(true);
      setSelectedCode(coupon.code);
      setOpenForm(true);
    }
  };

  const handleDelete = async (rowId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found.');
        navigate('/login');  // Redirect to login if no token exists
        return;
      }
      await api.delete(`/coupons/${rowId.split('-')[0]}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchCoupons();
    } catch (error) {
      console.error('Error deleting coupon:', error);
    }
  };


  const columns = [
    { field: 'code', headerName: 'Code', width: 150 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'expiredate', headerName: 'Expiry Date', width: 200 },
    { field: 'points', headerName: 'Points', width: 120 },
    { field: 'usedBy', headerName: 'Used By (Email)', width: 250 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleEdit(params.row.id)}>
            <Edit />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleDelete(params.row.id)}>
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Container>
      <Grid container spacing={2} sx={{ mb: 3 }} alignItems="center">
        <Grid item>
          <Button variant="contained" color="primary" onClick={() => { setNewCoupon({ code: '', expiredate: '', name: '', points: '' }); setIsEditing(false); setOpenForm(true); }}>
            Add New Coupon
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Coupon List</Typography>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={coupons}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            treeData
            getTreeDataPath={(row) => row.parentCode ? [row.parentCode, row.usedBy] : [row.code]}
            groupingColDef={{ headerName: 'Coupon Group' }}
            getRowId={(row) => row.id}
          />
        </div>
      </Box>
      
      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <DialogTitle>{isEditing ? 'Edit Coupon' : 'Add New Coupon'}</DialogTitle>
        <DialogContent>
          <TextField label="Code" name="code" value={newCoupon.code} onChange={handleChange} fullWidth sx={{ mb: 2 }} disabled={isEditing} />
          <TextField label="Name" name="name" value={newCoupon.name} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
          <TextField label="Expiry Date" name="expiredate" value={newCoupon.expiredate} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
          <TextField label="Points" name="points" type="number" value={newCoupon.points} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)} color="secondary">Cancel</Button>
          <Button onClick={handleSubmit} color="primary">{isEditing ? 'Update' : 'Add'} Coupon</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CouponPage;
