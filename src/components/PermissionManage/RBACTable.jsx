import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  Typography,
  IconButton,
  Tooltip,
  Box,
  Chip,
  TablePagination,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const RBACTable = ({ permissions = [], onEdit, onDelete }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // ✅ Normalize permissions: handle nested arrays like ['role', 'admin', [ {...}, {...} ]]
  const safePermissions = Array.isArray(permissions)
    ? permissions
    : Object.values(permissions || {});

  const flattenedPermissions = Array.isArray(safePermissions[2])
    ? safePermissions[2]
    : safePermissions;

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = flattenedPermissions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const methodColors = {
    GET: "#2e7d32",
    POST: "#1565c0",
    PUT: "#ef6c00",
    DELETE: "#c62828",
    PATCH: "#6a1b9a",
  };

  return (
    <Paper
      elevation={6}
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
        background: "linear-gradient(180deg, #ffffff, #f4f7ff)",
        transition: "all 0.3s ease-in-out",
        "&:hover": { boxShadow: "0 8px 20px rgba(0,0,0,0.15)" },
      }}
    >
      <TableContainer>
        <Table>
          <TableHead
            sx={{
              background: "linear-gradient(90deg, #1976d2, #42a5f5)",
              "& th": {
                color: "white",
                fontWeight: 600,
                letterSpacing: 0.4,
                textTransform: "uppercase",
                py: 1.5,
              },
            }}
          >
            <TableRow>
              <TableCell>Method</TableCell>
              <TableCell>Module</TableCell>
              <TableCell>Endpoint</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.length ? (
              paginatedData.map((p, i) => {
                const method = Array.isArray(p.method)
                  ? p.method[0]
                  : p.method || "UNKNOWN";
                const color =
                  methodColors[method?.toUpperCase()] || "#455a64";

                return (
                  <TableRow
                    key={i}
                    hover
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(66,165,245,0.08)",
                        transition: "background 0.3s ease",
                      },
                    }}
                  >
                    <TableCell>
                      <Chip
                        label={method}
                        sx={{
                          color: "white",
                          fontWeight: 600,
                          backgroundColor: color,
                          fontSize: "0.75rem",
                          letterSpacing: 0.3,
                        }}
                      />
                    </TableCell>

                    <TableCell sx={{ fontWeight: 500, color: "#1e293b" }}>
                      {p.baseurl || "-"}
                    </TableCell>
                    <TableCell sx={{ color: "#334155" }}>
                      {p.url || "-"}
                    </TableCell>

                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 1.5,
                        }}
                      >
                        <Tooltip title="Edit Permission" arrow>
                          <IconButton
                            onClick={() => onEdit(p)}
                            sx={{
                              color: "#1976d2",
                              backgroundColor: "rgba(25,118,210,0.08)",
                              "&:hover": {
                                backgroundColor: "rgba(25,118,210,0.15)",
                                transform: "scale(1.1)",
                              },
                              transition: "all 0.2s ease-in-out",
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete Permission" arrow>
                          <IconButton
                            onClick={() => onDelete(p)}
                            sx={{
                              color: "#c62828",
                              backgroundColor: "rgba(198,40,40,0.08)",
                              "&:hover": {
                                backgroundColor: "rgba(198,40,40,0.15)",
                                transform: "scale(1.1)",
                              },
                              transition: "all 0.2s ease-in-out",
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography
                    color="text.secondary"
                    sx={{
                      py: 3,
                      fontStyle: "italic",
                      letterSpacing: 0.4,
                    }}
                  >
                    No permissions found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={flattenedPermissions.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "#f9fafe",
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          "& .MuiTablePagination-actions button": {
            color: "#1976d2",
          },
        }}
      />
    </Paper>
  );
};

export default RBACTable;
