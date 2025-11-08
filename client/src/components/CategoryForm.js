import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Autocomplete,
  IconButton,
} from "@mui/material";
import { Category, AttachMoney, ShoppingCart, TrendingUp } from "@mui/icons-material";
import Cookies from "js-cookie";
import { setUser } from "../store/auth";

const initialCategory = {
  label: "",
  icon: "",
};

const iconOptions = [
  { label: "Car", icon: <Category /> },
  { label: "Shopping", icon: <ShoppingCart /> },
  { label: "Bills", icon: <AttachMoney /> },
  { label: "Growth", icon: <TrendingUp /> },
];

export default function CategoryForm({ editCategory, setEditCategory }) {
  const user = useSelector((state) => state.auth.user);
  const token = Cookies.get("token");
  const dispatch = useDispatch();
  const [form, setForm] = useState(initialCategory);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (editCategory?._id) {
      setForm(editCategory);
      setIsEditing(true);
    } else {
      setForm(initialCategory);
      setIsEditing(false);
    }
  }, [editCategory]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setForm(initialCategory);
    setEditCategory({});
    setIsEditing(false);
  };

  const reload = (res, updatedUser) => {
    if (res.ok) {
      setForm(initialCategory);
      setEditCategory({});
      setIsEditing(false);
      dispatch(setUser({ user: updatedUser }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    isEditing ? updateCategory() : addCategory();
  };

  const addCategory = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/category`, {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const updatedUser = {
      ...user,
      categories: [...user.categories, { ...form }],
    };
    reload(res, updatedUser);
  };

  const updateCategory = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/category/${editCategory._id}`,
      {
        method: "PATCH",
        body: JSON.stringify(form),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const updatedUser = {
      ...user,
      categories: user.categories.map((cat) =>
        cat._id === editCategory._id ? form : cat
      ),
    };
    reload(res, updatedUser);
  };

  return (
    <Card
      sx={{
        minWidth: 320,
        mt: 10,
        mx: "auto",
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
        color: "#fff",
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            textAlign: "center",
            fontWeight: 600,
            letterSpacing: 0.5,
          }}
        >
          {isEditing ? "Edit Expense Category" : "Add Expense Category"}
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TextField
            label="Category Name"
            name="label"
            value={form.label}
            onChange={handleChange}
            variant="outlined"
            size="small"
            sx={{
              bgcolor: "white",
              borderRadius: 1,
              width: "220px",
            }}
          />

          <Autocomplete
            options={iconOptions}
            getOptionLabel={(option) => option.label}
            onChange={(e, newValue) =>
              setForm({ ...form, icon: newValue?.label || "" })
            }
            renderOption={(props, option) => (
              <Box component="li" {...props} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton size="small" color="primary">
                  {option.icon}
                </IconButton>
                {option.label}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Icon"
                size="small"
                sx={{ bgcolor: "white", borderRadius: 1, width: "220px" }}
              />
            )}
          />

          {isEditing ? (
            <>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: "#00e676",
                  "&:hover": { bgcolor: "#00c853" },
                }}
              >
                Update
              </Button>
              <Button
                variant="outlined"
                sx={{
                  color: "#fff",
                  borderColor: "#fff",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                }}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: "#00e5ff",
                "&:hover": { bgcolor: "#00b8d4" },
              }}
            >
              Add
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
