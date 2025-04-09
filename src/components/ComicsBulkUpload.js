import React, { useState } from "react";
import { Button, MenuItem, Select, InputLabel, FormControl, Container, Box, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import Cookies from "js-cookie";
import api from './api';
import { useNavigate } from 'react-router-dom';
import { decryptData } from "./Security/cryptoUtils";

const ComicsBulkUpload = () => {
  const [jsonData, setJsonData] = useState(""); // State to hold the pasted JSON
  const [message, setMessage] = useState(""); // State for messages
  const rolelocal = decryptData(localStorage.getItem('role')); // Assuming `decryptData` function is used to decrypt the stored role
  const [selectedDatabase, setSelectedDatabase] = useState(rolelocal === "intern" ? "ComicsDemo" : "Comics"); // Default database
  const navigate = useNavigate();

  // Define the default database options based on user role
  const defaultDatabases = rolelocal === "intern" ? ["ComicsDemo", "EducationDemo", "ReligiousDemo"] : ["Comics", "Education", "Religious"];

  const handleDatabaseChange = (e) => {
    setSelectedDatabase(e.target.value); // Update the selected database
  };

  const handleJsonChange = (e) => {
    setJsonData(e.target.value); // Update the JSON text area value
  };

  const handleBulkUpload = async () => {
    if (!jsonData) {
      setMessage("Please paste valid JSON data.");
      return;
    }
  
    try {
      const parsedData = JSON.parse(jsonData); // Try parsing the pasted JSON data
  
      if (!Array.isArray(parsedData)) {
        setMessage("Invalid JSON format. Expected an array of comics.");
        return;
      }
  
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found.');
        navigate('/login');  // Redirect to login if no token exists
        return;
      }
  
      const response = await api.post(
        `/comics/upload/${selectedDatabase}`, 
        { comics: parsedData }, // Send the parsed JSON as part of the request body
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        }
      );
  
      if (response.status === 200) {
        setMessage("Bulk comics uploaded successfully.");
        setJsonData("");  // Clear the textarea after successful upload
      } else {
        setMessage("Error uploading comics.");
      }
    } catch (error) {
      console.error("Error uploading comics:", error);
      setMessage("Error uploading comics. Please check the format.");
    }
  };
  

  // Modal state
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true); // Open the modal
  };

  const handleClose = () => {
    setOpen(false); // Close the modal
  };

  return (
    <Container>
      {/* Button to open the modal */}
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Bulk Upload Comics
      </Button>

      {/* Modal/Dialog for Bulk Upload */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Bulk Upload Comics</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, color: "gray" }}>
            <strong>Expected JSON Format:</strong>
            <pre>
              {`[{
  "name": "Comic Name",
  "Date": "2025-02-02",
  "Discription": "Description of the comic",
  "Premium": true,
  "Tag": "Action",
  "category": "Adventure",
  "filename": "comic-1",
  "fileurl": "https://example.com/comic-1.pdf",
  "imageurl": "https://example.com/comic-1.jpg",
  "imgurl": "https://example.com/comic-1-small.jpg",
  "nov": 100
},
{
  "name": "Comic Name 2",
  "Date": "2025-02-03",
  "Discription": "Description of comic 2",
  "Premium": false,
  "Tag": "Drama",
  "category": "Fantasy",
  "filename": "comic-2",
  "fileurl": "https://example.com/comic-2.pdf",
  "imageurl": "https://example.com/comic-2.jpg",
  "imgurl": "https://example.com/comic-2-small.jpg",
  "nov": 200
}]`}
            </pre>
            <small>Each comic should be an object with the fields shown above. Ensure the entire JSON is wrapped in square brackets ([]) as an array of comics.</small>
          </Box>
          
          {/* Dropdown to select Database */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Choose Database</InputLabel>
            <Select
              label="Choose Database"
              value={selectedDatabase}
              onChange={handleDatabaseChange}
            >
              {/* Render the database options dynamically based on user role */}
              {defaultDatabases.map((database) => (
                <MenuItem key={database} value={database}>
                  {database}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* JSON Format Hint */}
          <textarea
            rows="10"
            placeholder="Paste JSON here"
            value={jsonData}
            onChange={handleJsonChange}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", marginBottom: "20px" }}
          />
          <Box sx={{ mt: 2, color: "red" }}>
            {message}
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleBulkUpload} variant="contained" color="primary">
            Upload Comics in Bulk
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ComicsBulkUpload;
