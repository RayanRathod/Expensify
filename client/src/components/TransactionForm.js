import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Autocomplete,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import Cookies from "js-cookie";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";

const InitialForm = {
  amount: 0,
  description: "",
  date: new Date(),
  category_id: "",
};

export default function TransactionForm({
  fetchTransactions,
  editTransaction,
  setEditTransaction,
}) {
  const user = useSelector((state) => state.auth.user);
  const categories = user?.categories || [];
  const token = Cookies.get("token");
  const [form, setForm] = useState(InitialForm);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (editTransaction.amount !== undefined) {
      setForm(editTransaction);
      setEditMode(true);
    } else {
      setForm(InitialForm);
      setEditMode(false);
    }
  }, [editTransaction]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleDate(newValue) {
    setForm({ ...form, date: newValue });
  }

  function handleSubmit(e) {
    e.preventDefault();
    editMode ? update() : create();
  }

  function handleCancel() {
    setForm(InitialForm);
    setEditMode(false);
    setEditTransaction({});
  }

  function reload(res) {
    if (res.ok) {
      setForm(InitialForm);
      setEditMode(false);
      setEditTransaction({});
      fetchTransactions();
    }
  }

  async function create() {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/transaction`, {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    reload(res);
  }

  async function update() {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/transaction/${editTransaction._id}`,
      {
        method: "PATCH",
        body: JSON.stringify(form),
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    reload(res);
  }

  function getCategoryNameById() {
    return (
      categories.find((category) => category._id === form.category_id) ?? ""
    );
  }

  return (
    <Card
      sx={{
        minWidth: 275,
        mt: 6,
        p: 3,
        borderRadius: 3,
        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
        color: "white",
      }}
    >
      <CardContent>
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            fontWeight: "bold",
            textAlign: "center",
            color: "#ffffff",
            letterSpacing: 0.5,
          }}
        >
          {editMode ? "Update Transaction" : "Add New Transaction"}
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 3,
          }}
        >
          <TextField
            type="number"
            label="Amount (₹)"
            name="amount"
            variant="outlined"
            size="small"
            value={form.amount}
            onChange={handleChange}
            sx={{
              width: 180,
              bgcolor: "white",
              borderRadius: 1,
            }}
          />
          <TextField
            type="text"
            label="Description"
            name="description"
            variant="outlined"
            size="small"
            value={form.description}
            onChange={handleChange}
            sx={{
              width: 250,
              bgcolor: "white",
              borderRadius: 1,
            }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Transaction Date"
              inputFormat="DD.MM.YYYY"
              value={form.date}
              onChange={handleDate}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  sx={{
                    width: 180,
                    bgcolor: "white",
                    borderRadius: 1,
                  }}
                />
              )}
            />
          </LocalizationProvider>
          <Autocomplete
            value={getCategoryNameById()}
            onChange={(event, newValue) => {
              const newCategoryId = newValue ? newValue._id : "";
              setForm({ ...form, category_id: newCategoryId });
            }}
            options={categories}
            getOptionLabel={(option) => option.name || ""}
            sx={{
              width: 200,
              bgcolor: "white",
              borderRadius: 1,
            }}
            renderInput={(params) => (
              <TextField {...params} size="small" label="Category" />
            )}
          />

          {editMode ? (
            <>
              <Button
                type="submit"
                variant="contained"
                startIcon={<EditIcon />}
                sx={{
                  backgroundColor: "#00e676",
                  "&:hover": { backgroundColor: "#00c853" },
                }}
              >
                Update
              </Button>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                sx={{
                  borderColor: "#ff1744",
                  color: "#ff1744",
                  "&:hover": {
                    borderColor: "#d50000",
                    backgroundColor: "rgba(255,23,68,0.1)",
                  },
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              type="submit"
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              sx={{
                backgroundColor: "#00b0ff",
                "&:hover": { backgroundColor: "#0091ea" },
              }}
            >
              Submit
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
