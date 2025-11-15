// src/components/ContentDisplay.jsx
import React, { useState, useMemo } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  Pagination,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
} from "@mui/icons-material";

const ContentDisplay = ({ items, database, handleEdit, handleDelete }) => {
  // 🔍 State
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortOption, setSortOption] = useState("newest");

  const itemsPerPage = 9;

  // 🔎 Filter & Search Logic
  const filteredItems = useMemo(() => {
    let filtered = [...items];

    // Filter by category
    if (filterCategory !== "all") {
      filtered = filtered.filter(
        (item) => item.category?.toLowerCase() === filterCategory.toLowerCase()
      );
    }

    // Search text
    if (searchQuery.trim()) {
      const lower = searchQuery.toLowerCase();
      filtered = filtered.filter((item) => {
        const fields = [
          item.category,
          item.writername,
          item.shayarname,
          item.title,
          item.joke,
          item.story,
          item.shayri,
          item.tag,
          item.postedBy,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return fields.includes(lower);
      });
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortOption === "az") {
        return (a.category || "").localeCompare(b.category || "");
      }
      if (sortOption === "za") {
        return (b.category || "").localeCompare(a.category || "");
      }
      if (sortOption === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      // default = newest
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return filtered;
  }, [items, searchQuery, filterCategory, sortOption]);

  // 📄 Pagination Logic
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // 🏷️ Unique categories for filter dropdown
  const uniqueCategories = Array.from(
    new Set(items.map((item) => item.category).filter(Boolean))
  );

  return (
    <Box>
      {/* 🔍 Search + Filter + Sort Bar */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", sm: "center" }}
        sx={{ mb: 3, mt: 1, width: "100%" }}
      >
        {/* 🔍 Search */}
        <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
          <SearchIcon color="action" sx={{ mr: 1 }} />
          <TextField
            variant="outlined"
            size="small"
            placeholder={`Search ${database}...`}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            fullWidth
          />
        </Box>

        {/* 🧮 Filter */}
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>
            <FilterIcon sx={{ mr: 1 }} fontSize="small" />
            Category
          </InputLabel>
          <Select
            value={filterCategory}
            label="Category"
            onChange={(e) => {
              setFilterCategory(e.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {uniqueCategories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* 🔃 Sort */}
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>
            <SortIcon sx={{ mr: 1 }} fontSize="small" />
            Sort
          </InputLabel>
          <Select
            value={sortOption}
            label="Sort"
            onChange={(e) => setSortOption(e.target.value)}
          >
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="oldest">Oldest First</MenuItem>
            <MenuItem value="az">A → Z</MenuItem>
            <MenuItem value="za">Z → A</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* 🗂️ Cards Grid */}
      <Grid container spacing={3}>
        {paginatedItems.length === 0 ? (
          <Grid item xs={12}>
            <Typography align="center" color="text.secondary">
              No results found.
            </Typography>
          </Grid>
        ) : (
          paginatedItems.map((item) => {
            const id = item.id || item.shayriId || item.jokeId || item.storyId;

            return (
              <Grid item xs={12} sm={6} md={4} key={id}>
                <Card
                  sx={(theme) => ({
                    height: "100%",
                    borderRadius: 3,
                    boxShadow: 3,
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    transition: "0.3s",
                    "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
                  })}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "100%",
                    }}
                  >
                    <Typography variant="h6" color="text.primary" gutterBottom>
                      {item.category}
                    </Typography>

                    {/* --- JOKES --- */}
                    {database === "jokes" && (
                      <>
                        {item.writername && (
                          <Typography fontWeight="bold">{item.writername}</Typography>
                        )}
                        <Typography style={{ whiteSpace: "pre-line" }}>
                          {item.joke}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          🕒 {item.postedBy}
                        </Typography>
                      </>
                    )}

                    {/* --- STORIES --- */}
                    {database === "stories" && (
                      <>
                        <Typography fontWeight="bold">{item.title}</Typography>
                        <Typography>By {item.writername}</Typography>
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            style={{
                              width: "100%",
                              margin: "10px 0",
                              borderRadius: 8,
                            }}
                          />
                        )}
                        <Typography style={{ whiteSpace: "pre-line" }}>
                          {item.story}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          🕒 {item.postedBy}
                        </Typography>
                      </>
                    )}

                    {/* --- SHAYARI --- */}
                    {database === "shayri" && (
                      <>
                        <Typography fontWeight="bold">
                          {item.shayarname || "Unknown"}
                        </Typography>
                        {item.tag && (
                          <Typography variant="body2" color="text.secondary">
                            #{item.tag}
                          </Typography>
                        )}
                        <Typography
                          style={{
                            whiteSpace: "pre-line",
                            marginTop: 6,
                            fontStyle: "italic",
                          }}
                        >
                          {item.shayri}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          🕒 {item.postedBy}
                        </Typography>
                      </>
                    )}

                    {/* Buttons */}
                    <Box>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEdit(item)}
                        fullWidth
                        sx={{ mt: 2 }}
                      >
                        <EditIcon sx={{ mr: 1 }} /> Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDelete(item)}
                        fullWidth
                        sx={{ mt: 1 }}
                      >
                        <DeleteIcon sx={{ mr: 1 }} /> Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>

      {/* 📄 Pagination */}
      {totalPages > 1 && (
        <Stack alignItems="center" sx={{ mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
            shape="rounded"
          />
        </Stack>
      )}
    </Box>
  );
};

export default ContentDisplay;
