import React, { useState, useEffect } from "react";
import api from './api';

import { DataGrid } from "@mui/x-data-grid";
import { Button, Grid,Container, Box, Typography, TextField, Dialog, DialogActions, DialogContent, DialogTitle , FormControlLabel, Checkbox, MenuItem, Select, InputLabel, FormControl} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // import the css for the datepicker
import { encryptData, decryptData } from './Security/cryptoUtils.js';  // Import the library functions
import ComicsBulkUpload from "./ComicsBulkUpload";

const Comics = ({role,userId}) => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false); // State to control form dialog visibility
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDatabase, setSelectedDatabase] = useState("Comics"); // Default database
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const [databases, setDatabases] = useState([
    "Comics", 
    "Education", 
    "Religious", // Add the databases you want to show in the dropdown
  ]);
  
  const [newComic, setNewComic] = useState({
    name: "",
    Date: "",  // Initialize as an empty string or null
    Discription: "",
    Premium: false,
    Tag: "",
    category: "",
    filename: "",
    fileurl: "",
    imageurl: "",
    imgurl: "",
    nov: 0,
    database: "", // New field for database
  });
  
  const [categories, setCategories] = useState([  "Btech",
    "HindiBooks",
    "HindiComics",
    "HindiDubbed",
    "HinduBooks",
    "IslamicBooks"]); // Sample categories


  const fetchComics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found.');
        navigate('/');  // Redirect to login if no token exists
        return;
      }      const rolelocal = localStorage.getItem('role') ;
      const userlocal=localStorage.getItem("uid");


      const response = await api.post("https://hindicomicsbackend.onrender.comcomics", {
        database: selectedDatabase,
        role: rolelocal,
        userId: userlocal
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Only token in the Authorization header
        },
      });
 

      const comicsData = response.data;

      if (comicsData) {
        const formattedComics = Object.keys(comicsData).map((id) => ({
          id,
          ...comicsData[id],
        }));
        setComics(formattedComics);
      } else {
        setComics([]);
      }
    } catch (error) {
      console.error("Error fetching comics", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchComics();
  }, [selectedDatabase]);

  const handleDatabaseChange = (e) => {
    setSelectedDatabase(e.target.value); // Update the selected database
  };
  
  const handleDelete = async (comicId, filename) => {
    try {
      // Ensure that the filename is provided, as it's critical for the delete operation
      if (!filename) {
        console.error("Comic filename is missing, cannot delete comic");
        return;
      }
  
      // Token for Authorization
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found.');
        navigate('/');  // Redirect to login if no token exists
        return;
      }  
      // Perform the DELETE request with the selectedDatabase and filename in the URL
      const response = await api.delete(
        `https://hindicomicsbackend.onrender.comcomics/${selectedDatabase}/${filename}`, // Use the selectedDatabase and filename in the URL
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      // If the delete operation is successful, re-fetch the comics and update the state
      if (response.status === 200) {
        fetchComics(); // Re-fetch the comics after deletion
      }
    } catch (error) {
      console.error("Error deleting comic", error);
    }
  };
  
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const filteredComics = comics.filter((comic) => {
    return (
      comic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comic.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comic.Discription.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  

  const handleCreateComic = async () => {
    try {
      // Format the date
      const formattedDate = newComic.Date ? new Date(newComic.Date).toISOString().split('T')[0] : ""; // Format date to YYYY-MM-DD
  
      // Ensure that nov is a number
      const novValue = Number(newComic.nov) || 0; // Convert to number, default to 0 if it's NaN
  
      // Prepare the comic data to be sent in the request
      const newComicData = {
        name: newComic.name || "",
        Date: formattedDate,  // Use the formatted date here
        Discription: newComic.Discription || "",
        Premium: newComic.Premium || false,
        Tag: newComic.Tag || "",
        category: newComic.category || "",
        filename: newComic.filename || "",
        fileurl: newComic.fileurl || "",
        imageurl: newComic.imageurl || "",
        imgurl: newComic.imgurl || "",
        nov: novValue,  // Ensure nov is a number
      };
  
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found.');
        navigate('/');  // Redirect to login if no token exists
        return;
      }  
      // Make the POST request to create a new comic
      const response = await api.post(
        `https://hindicomicsbackend.onrender.comcomics/${selectedDatabase}`,
        newComicData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (response.status === 201) {
        // Re-fetch comics or perform any other necessary actions
        fetchComics();
        setOpenForm(false);  // Close the form
        setNewComic({});  // Reset the new comic data
      }
    } catch (error) {
      console.error('Error creating comic', error);
    }
  };
  
  
  const handleEdit = (id) => {
    const comicToEdit = comics.find((comic) => comic.id === id); // Find the comic by id
    if (comicToEdit) {
      setNewComic({
        id: comicToEdit.id,  // Make sure the ID is included
        name: comicToEdit.name || "",
        Date: comicToEdit.Date || "",
        Discription: comicToEdit.Discription || "",
        Premium: comicToEdit.Premium || false,
        Tag: comicToEdit.Tag || "",
        category: comicToEdit.category || "",
        filename: comicToEdit.filename || "",
        fileurl: comicToEdit.fileurl || "",
        imageurl: comicToEdit.imageurl || "",
        imgurl: comicToEdit.imgurl || "",
        nov: comicToEdit.nov || 0,
        database: comicToEdit.database || "", // Keep the database field
      });
      setIsEditing(true); // Set the form to edit mode
      setOpenForm(true); // Open the form for editing
    }
  };
  
  const handleUpdateComic = async () => {
    try {
      if (!newComic.filename) {
        console.error("Comic filename is missing, cannot update comic");
        return;
      }
  
      // Format the date
      const formattedDate = newComic.Date ? new Date(newComic.Date).toISOString().split('T')[0] : ""; // Format date to YYYY-MM-DD
  
      // Ensure that nov is a number
      const novValue = Number(newComic.nov) || 0; // Convert to number, default to 0 if it's NaN
  
      // Prepare the updated comic data
      const updatedComicData = {
        name: newComic.name || "",
        Date: formattedDate,  // Use the formatted date here
        Discription: newComic.Discription || "",
        Premium: newComic.Premium || false,
        Tag: newComic.Tag || "",
        category: newComic.category || "",
        filename: newComic.filename || "",
        fileurl: newComic.fileurl || "",
        imageurl: newComic.imageurl || "",
        imgurl: newComic.imgurl || "",
        nov: novValue,  // Ensure nov is a number
        database: selectedDatabase, // Include the selected database
      };
  
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found.');
        navigate('/');  // Redirect to login if no token exists
        return;
      }  
      // Perform the PUT request with database and filename in the URL
      const response = await api.put(
        `https://hindicomicsbackend.onrender.comcomics/${selectedDatabase}/${newComic.filename}`, // Use filename instead of id
        updatedComicData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (response.status === 200) {
        fetchComics(); // Re-fetch comics after update
        setOpenForm(false); // Close the form after submission
        setIsEditing(false); // Reset edit mode
        setNewComic({
          name: "",
          Date: null,
          Discription: "",
          Premium: false,
          Tag: "",
          category: "",
          filename: "",
          fileurl: "",
          imageurl: "",
          imgurl: "",
          nov: 0,
          database: "",
        });
      }
    } catch (error) {
      console.error("Error updating comic", error);
    }
  };
  
  
  
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewComic((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const columns = [
    { field: "name", headerName: "Name", width: 200 },    
    { field: "filename", headerName: "Filename", width: 200 },
    { field: "Date", headerName: "Date", width: 150 },
    { field: "Discription", headerName: "Description", width: 250 },
    { field: "Premium", headerName: "Premium", width: 150 },
    { field: "Tag", headerName: "Tag", width: 200 },
    { field: "category", headerName: "Category", width: 200 },
    { field: "fileurl", headerName: "File URL", width: 250 },
    { field: "imageurl", headerName: "Image URL", width: 250 },
    { field: "imgurl", headerName: "Image URL (Img)", width: 250 },
    { field: "nov", headerName: "Views", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => {
        return (
          <Box>
            <Button onClick={() => handleEdit(params.id)} variant="outlined" color="primary">
              Edit
            </Button>
            <Button
                      onClick={() => handleDelete(params.row.id, params.row.filename)} // Pass both comicId and filename
                      variant="outlined"
                      color="secondary"
                      sx={{ ml: 1 }}
                    >
                      Delete
                    </Button>

          </Box>
        );
      },
    },
  ];

  return (
    <Container>

    

<Grid container spacing={2} alignItems="center"       sx={{ mb: 3 }} >
        <Grid item>
          {/* Add New Comic button */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenForm(true)}
          >
            Add New Comic
          </Button>
        </Grid>

        <Grid item>
          {/* ComicsBulkUpload component in a row */}
          <ComicsBulkUpload
      
      />
              </Grid>
      </Grid>

      {/* Search bar */}
      <TextField
        label="Search Comics"
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Database</InputLabel>
        <Select
          label="Database"
          value={selectedDatabase}
          onChange={handleDatabaseChange}
        >
          {databases.map((database, index) => (
            <MenuItem key={index} value={database}>
              {database}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <div style={{ height: 400, width: "100%" }}>
      <DataGrid rows={filteredComics} columns={columns} pageSize={5} loading={loading} />
      </div>

      {/* Add Comic Form Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
      <DialogTitle>{isEditing ? "Edit Comic" : "Add New Comic"}</DialogTitle>
      <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={newComic.name}
            onChange={handleFormChange}
            fullWidth
            sx={{ mb: 2 }}
          />
      {/* Wrapped DatePicker with Material-UI TextField */}
      <DatePicker
  selected={newComic.Date ? new Date(newComic.Date) : null} // If newComic.Date is a valid value, convert it to Date
  onChange={(date) => setNewComic({ ...newComic, Date: date ? date : null })}  // Ensure Date is null or a valid Date
  dateFormat="yyyy-MM-dd"
  placeholderText="Select a date"
  showMonthDropdown
  showYearDropdown
  dropdownMode="select"
  renderInput={(props) => (
    <TextField
      {...props}
      fullWidth
      sx={{ mb: 2 }}
      label="Date"
      variant="outlined"
    />
  )}
/>



          <TextField
            label="Description"
            name="Discription"
            value={newComic.Discription}
            onChange={handleFormChange}
            fullWidth
            sx={{ mb: 2, mt:2 }}
          />
          <TextField
            label="Tag"
            name="Tag"
            value={newComic.Tag}
            onChange={handleFormChange}
            fullWidth
            sx={{ mb: 2 }}
          />
           <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              name="category"
              value={newComic.category}
              onChange={handleFormChange}
              disabled={isEditing} // Disable when editing

            >
              {categories.map((category, index) => (
                <MenuItem key={index} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
  <InputLabel>Database</InputLabel>
  <Select
    label="Database"
    name="database"
    value={selectedDatabase} // Bind selected database
    onChange={handleDatabaseChange} // Update selected database
    disabled={isEditing} // Disable when editing

  >
    {databases.map((database, index) => (
      <MenuItem key={index} value={database}>
        {database}
      </MenuItem>
    ))}
  </Select>
</FormControl>

          <TextField
            label="Filename"
            name="filename"
            value={newComic.filename}
            onChange={handleFormChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="File URL"
            name="fileurl"
            value={newComic.fileurl}
            onChange={handleFormChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Image URL"
            name="imageurl"
            value={newComic.imageurl}
            onChange={handleFormChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Image URL (Img)"
            name="imgurl"
            value={newComic.imgurl}
            onChange={handleFormChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Views (nov)"
            name="nov"
            type="number"
            value={newComic.nov}
            onChange={handleFormChange}
            fullWidth
            sx={{ mb: 2 }}
          />
        <FormControlLabel
            control={
              <Checkbox
                name="Premium"
                checked={newComic.Premium}
                onChange={handleFormChange}
              />
            }
            label="Premium"
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={isEditing ? handleUpdateComic : handleCreateComic} color="primary">
            {isEditing ? "Update Comic" : "Add Comic"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit comic */}


    </Container>
  );
};

export default Comics;
