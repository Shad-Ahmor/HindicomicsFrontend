// src/components/ContentEditor.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Stack,
  Tooltip,
  IconButton,
  Typography,
  TextField,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Autocomplete,
} from "@mui/material";
import {
  Add as AddIcon,
  FormatBold as FormatBoldIcon,
  SubdirectoryArrowLeft as SubdirectoryArrowLeftIcon,
} from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";
import api from "../api";
import { encryptData, decryptData } from "../Security/cryptoUtils";

import {
  shayariCategories,
  jokesCategories,
  storyCategories,
} from "./categories"; // we’ll move long lists into this file later for cleanliness

const ContentEditor = ({ database, items, setItems, token, userName, fetchItems }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [title, setTitle] = useState("");
  const [writername, setWritername] = useState("");
  const [shayarname, setShayarname] = useState("");
  const [tag, setTag] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [postedBy, setPostedBy] = useState(userName);
  const contentRef = useRef(null);

  const getCategoryList = () => {
    if (database === "shayri") return shayariCategories;
    if (database === "stories") return storyCategories;
    return jokesCategories;
  };

  const resetForm = () => {
    setTitle("");
    setWritername("");
    setImage("");
    setCategory("");
    setShayarname("");
    setTag("");
    setContent("");
    setPostedBy(userName);
    setSelectedId(null);
  };

  const handleBoldClick = () => {
    const textarea = contentRef.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd, value } = textarea;
    const selectedText = value.slice(selectionStart, selectionEnd);
    const newText =
      value.slice(0, selectionStart) + `**${selectedText || "bold"}**` + value.slice(selectionEnd);
    setContent(newText);
  };

  const handleNewLineClick = () => {
    const textarea = contentRef.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd, value } = textarea;
    const newText = value.slice(0, selectionStart) + "\\n" + value.slice(selectionEnd);
    setContent(newText);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    const newId = selectedId || uuidv4();
    let payload;

    if (database === "jokes") {
      payload = { jokeId: newId, category, writername, jokeText: content, postedBy };
    } else if (database === "stories") {
      payload = { storyId: newId, title, writername, image, story: content, postedBy };
    } else {
      payload = { shayriId: newId, category, shayarname, tag, shayri: content, postedBy };
    }

    try {
      if (selectedId) {
        await api.put(`/jokes/${database}/${newId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post(`/jokes/create/${database}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      fetchItems();
      resetForm();
      setOpenDialog(false);
    } catch (error) {
      console.error("Save error:", error.response?.data || error.message);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenDialog(true)}
        sx={{ mb: 2, width: 180 }}
      >
        <AddIcon sx={{ mr: 1 }} /> Add{" "}
        {database === "jokes" ? "Joke" : database === "stories" ? "Story" : "Shayari"}
      </Button>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedId ? "Edit" : "Create"}{" "}
          {database === "jokes" ? "Joke" : database === "stories" ? "Story" : "Shayari"}
        </DialogTitle>

        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Autocomplete
              freeSolo
              options={getCategoryList()}
              value={category}
              onChange={(e, val) => setCategory(val || "")}
              renderInput={(params) => <TextField {...params} label="Category" fullWidth />}
            />

            {database === "stories" && (
              <>
                <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
                <TextField label="Writer Name" value={writername} onChange={(e) => setWritername(e.target.value)} fullWidth />
                <TextField label="Image URL" value={image} onChange={(e) => setImage(e.target.value)} fullWidth />
              </>
            )}

            {database === "shayri" && (
              <>
                <TextField label="Shayar Name" value={shayarname} onChange={(e) => setShayarname(e.target.value)} fullWidth />
                <TextField label="Tag" value={tag} onChange={(e) => setTag(e.target.value)} fullWidth />
              </>
            )}

            {database === "jokes" && (
              <TextField label="Writer Name" value={writername} onChange={(e) => setWritername(e.target.value)} fullWidth />
            )}

            <Stack direction="row" spacing={1}>
              <Tooltip title="Bold">
                <IconButton onClick={handleBoldClick} size="small" color="primary">
                  <FormatBoldIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="New Line">
                <IconButton onClick={handleNewLineClick} size="small" color="primary">
                  <SubdirectoryArrowLeftIcon />
                </IconButton>
              </Tooltip>
            </Stack>

            <TextField
              label={database === "jokes" ? "Joke" : database === "stories" ? "Story" : "Shayari"}
              multiline
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              inputRef={contentRef}
              fullWidth
            />

            <Typography variant="subtitle1">Preview:</Typography>
            <Paper variant="outlined" sx={{ p: 2, whiteSpace: "pre-wrap", minHeight: 100 }}>
              <ReactMarkdown>{content.replace(/\\n/g, "\n")}</ReactMarkdown>
            </Paper>

            <TextField label="Posted By" value={postedBy} InputProps={{ readOnly: true }} fullWidth />

            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
              <Button variant="outlined" color="secondary" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" type="submit">
                Save
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContentEditor;
