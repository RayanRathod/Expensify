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
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker, MobileDatePicker } from "@mui/x-date-pickers";
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

  // Responsive setup
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Mobile

  useEffect(() => {
    if (editTransaction.amount !== undefined) {
      setForm(editTransaction);
      setEditMode(true);
    } else {
      setForm(InitialForm);
      setEditMode(false);
    }
  }, [editTransaction]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDate = (newValue) => {
    setForm({ ...form, date: newValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editMode ? update() : create();
  };

  const handleCancel = () => {
    setForm(InitialForm);
    setEditMode(false);
    setEditTransaction({});
  };

  const reload = (res) => {
    if (res.ok) {
      setForm(InitialForm);
      setEditMode(false);
      setEditTransaction({});
      fetchTransactions();
    }
  };

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

  const getCategoryNameById = () =>
    categories.find((category) => category._id === form.category_id) ?? "";

  return (
    <Card
      sx={{
        width: { xs: "90%", sm: "80%", md: "65%", lg: "55%" },
        mt: { xs: 4, md: 6 },
        mx: "auto",
        borderRadius: 3,
        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
        color: "white",
        p: { xs: 2, sm: 3 },
      }}
    >
      <CardContent>
        <Typography
          variant={isSmallScreen ? "h6" : "h5"}
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
            flexDirection: { xs: "column", sm: "row" },
            flexWrap: "wrap",
            justifyContent: "center",
            gap: { xs: 2, sm: 3 },
            alignItems: "center",
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
              width: { xs: "100%", sm: 180 },
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
              width: { xs: "100%", sm: 250 },
              bgcolor: "white",
              borderRadius: 1,
            }}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {isSmallScreen ? (
              <MobileDatePicker
                label="Transaction Date"
                inputFormat="DD.MM.YYYY"
                value={form.date}
                onChange={handleDate}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    sx={{
                      width: "100%",
                      bgcolor: "white",
                      borderRadius: 1,
                    }}
                  />
                )}
              />
            ) : (
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
                      width: { xs: "100%", sm: 180 },
                      bgcolor: "white",
                      borderRadius: 1,
                    }}
                  />
                )}
              />
            )}
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
              width: { xs: "100%", sm: 200 },
              bgcolor: "white",
              borderRadius: 1,
            }}
            renderInput={(params) => (
              <TextField {...params} size="small" label="Category" />
            )}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: 2,
              mt: { xs: 2, sm: 0 },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            {editMode ? (
              <>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<EditIcon />}
                  sx={{
                    backgroundColor: "#00e676",
                    "&:hover": { backgroundColor: "#00c853" },
                    width: { xs: "100%", sm: "auto" },
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
                    width: { xs: "100%", sm: "auto" },
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
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                Submit
              </Button>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
