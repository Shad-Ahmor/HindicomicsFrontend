// src/components/ContentManager.jsx
import React, { useState, useEffect } from "react";
import { Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { decryptData } from "../Security/cryptoUtils";

import ContentEditor from "./ContentEditor";
import ContentDisplay from "./ContentDisplay";

const ContentManager = () => {
  const [items, setItems] = useState([]);
  const [database, setDatabase] = useState("jokes");
  const [token, setToken] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const fetchItems = async () => {
    if (!token) return;
    try {
      const res = await api.get(`/jokes?database=${database}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err.message);
      setItems([]);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = decryptData(localStorage.getItem("name")) || "Admin";
    if (!storedToken) {
      navigate("/login");
      return;
    }
    setToken(storedToken);
    setUserName(storedUser);
  }, [navigate]);

  useEffect(() => {
    if (token) fetchItems();
  }, [token, database]);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Content Manager
      </Typography>

      <FormControl sx={{ minWidth: 150, mb: 2 }}>
        <InputLabel>Database</InputLabel>
        <Select value={database} label="Database" onChange={(e) => setDatabase(e.target.value)}>
          <MenuItem value="jokes">Jokes</MenuItem>
          <MenuItem value="stories">Stories</MenuItem>
          <MenuItem value="shayri">Shayari</MenuItem>
        </Select>
      </FormControl>

      <ContentEditor
        database={database}
        items={items}
        setItems={setItems}
        token={token}
        userName={userName}
        fetchItems={fetchItems}
      />

      <ContentDisplay items={items} database={database} handleEdit={() => {}} handleDelete={() => {}} />
    </div>
  );
};

export default ContentManager;
