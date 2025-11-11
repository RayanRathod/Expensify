import React, { useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Tooltip,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { setUser } from "../store/auth";
import CategoryForm from "../components/CategoryForm";

export default function Category() {
  const token = Cookies.get("token");
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [editCategory, setEditCategory] = useState({});

  const handleEdit = (category) => {
    setEditCategory(category);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Do you really want to delete this category?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/category/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const updatedUser = {
          ...user,
          categories: user.categories.filter((cat) => cat._id !== id),
        };
        dispatch(setUser({ user: updatedUser }));
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 6,
        mb: 6,
        px: { xs: 2, sm: 3 },
      }}
    >
      {/* Category Form */}
      <CategoryForm editCategory={editCategory} setEditCategory={setEditCategory} />

      {/* Title */}
      <Typography
        variant="h5"
        align="center"
        sx={{
          mt: 8,
          mb: 3,
          fontWeight: 700,
          letterSpacing: 0.6,
          color: "#1e3c72",
          textTransform: "uppercase",
        }}
      >
        Manage Your Categories
      </Typography>

      {/* Table Section */}
      <Box
        sx={{
          overflowX: "auto", // Enables horizontal scroll on small screens
          borderRadius: 3,
          boxShadow: "0px 8px 24px rgba(0,0,0,0.12)",
        }}
      >
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            minWidth: 400,
          }}
        >
          <Table aria-label="categories table">
            <TableHead
              sx={{
                background: "linear-gradient(135deg, #1e3c72, #2a5298)",
              }}
            >
              <TableRow>
                {["Label", "Icon", "Actions"].map((header) => (
                  <TableCell
                    key={header}
                    align="center"
                    sx={{
                      color: "#fff",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 0.7,
                      fontSize: "0.95rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {user?.categories?.length > 0 ? (
                user.categories.map((row, index) => (
                  <TableRow
                    key={row._id}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#f8faff" : "#eef4ff",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#dce9ff",
                        transform: "scale(1.01)",
                      },
                    }}
                  >
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 500,
                        fontSize: "1rem",
                      }}
                    >
                      {row.label}
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{
                        fontSize: "1.6rem",
                      }}
                    >
                      {row.icon}
                    </TableCell>

                    <TableCell align="center">
                      <Tooltip title="Edit Category">
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(row)}
                          disabled={editCategory.label !== undefined}
                          sx={{
                            transition: "0.3s",
                            "&:hover": { transform: "scale(1.15)", color: "#0288d1" },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete Category">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(row._id)}
                          disabled={editCategory.label !== undefined}
                          sx={{
                            transition: "0.3s",
                            "&:hover": { transform: "scale(1.15)", color: "#d32f2f" },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4, color: "#666" }}>
                    No categories found. Add one above 👆
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}
