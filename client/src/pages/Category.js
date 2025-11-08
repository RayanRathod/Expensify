import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useSelector, useDispatch } from "react-redux";
import { Container, Typography } from "@mui/material";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import IconButton from "@mui/material/IconButton";
import Cookies from "js-cookie";
import { setUser } from "../store/auth";
import CategoryForm from "../components/CategoryForm";
import { useState } from "react";

export default function Category() {
  const token = Cookies.get("token");
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [editCategory, setEditCategory] = useState({});

  function setEdit(category) {
    setEditCategory(category);
  }

  async function remove(id) {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

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
  }

  return (
    <Container sx={{ mt: 6, mb: 6 }}>
      {/* Category Form */}
      <CategoryForm
        editCategory={editCategory}
        setEditCategory={setEditCategory}
      />

      {/* Table Title */}
      <Typography
        variant="h5"
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          letterSpacing: 0.6,
          mt: 8,
          mb: 2,
          color: "#1e3c72",
        }}
      >
        Your Categories
      </Typography>

      {/* Styled Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="styled table">
          <TableHead
            sx={{
              background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
            }}
          >
            <TableRow>
              {["Label", "Icon", "Actions"].map((header) => (
                <TableCell
                  key={header}
                  align="center"
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {user?.categories?.map((row, index) => (
              <TableRow
                key={row._id}
                sx={{
                  backgroundColor: index % 2 === 0 ? "#f5f8ff" : "#ebf2ff",
                  "&:hover": {
                    backgroundColor: "#dce7ff",
                    transition: "0.3s ease",
                  },
                }}
              >
                <TableCell
                  align="center"
                  component="th"
                  scope="row"
                  sx={{ fontWeight: 500 }}
                >
                  {row.label}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    fontSize: 22,
                  }}
                >
                  {row.icon}
                </TableCell>

                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => setEdit(row)}
                    disabled={editCategory.label !== undefined}
                    sx={{
                      transition: "0.3s",
                      "&:hover": {
                        transform: "scale(1.1)",
                        color: "#00b0ff",
                      },
                    }}
                  >
                    <EditSharpIcon />
                  </IconButton>

                  <IconButton
                    color="error"
                    onClick={() => remove(row._id)}
                    disabled={editCategory.label !== undefined}
                    sx={{
                      transition: "0.3s",
                      "&:hover": {
                        transform: "scale(1.1)",
                        color: "#ff1744",
                      },
                    }}
                  >
                    <DeleteSharpIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
