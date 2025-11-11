import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Cookies from "js-cookie";
import dayjs from "dayjs";

const TransactionList = ({
  data,
  fetchTransactions,
  setEditTransaction,
  editTransaction,
}) => {
  const token = Cookies.get("token");
  const user = useSelector((state) => state.auth.user);

  const getCategoryIcon = (id) => {
    if (!user) return "⌛";
    const category = user.categories.find((cat) => cat._id === id);
    return category ? category.icon : "❓";
  };

  const deleteTransaction = async (id) => {
    const confirmDelete = window.confirm(
      "Do you really want to delete this transaction?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/transaction/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) fetchTransactions();
    } catch (err) {
      console.error("Error deleting transaction:", err);
    }
  };

  const formatDate = (date) => dayjs(date).format("DD MMM, YYYY");

  return (
    <>
      <Typography
        variant="h5"
        align="center"
        sx={{
          mt: 6,
          mb: 3,
          fontWeight: 700,
          color: "#1e3c72",
          letterSpacing: 0.8,
          textTransform: "uppercase",
        }}
      >
        Your Transactions
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0px 8px 25px rgba(0,0,0,0.1)",
        }}
      >
        <Table aria-label="transaction table">
          <TableHead
            sx={{
              background: "linear-gradient(135deg, #1e3c72, #2a5298)",
            }}
          >
            <TableRow>
              {["Amount (₹)", "Description", "Category", "Date", "Actions"].map(
                (heading) => (
                  <TableCell
                    key={heading}
                    align="center"
                    sx={{
                      color: "#fff",
                      fontWeight: 700,
                      letterSpacing: 0.7,
                      fontSize: "0.95rem",
                    }}
                  >
                    {heading}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.flatMap((month) =>
              month.transactions.map((txn, index) => (
                <TableRow
                  key={txn._id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#f8faff" : "#eef4ff",
                    transition: "background-color 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#dce9ff",
                    },
                  }}
                >
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    ₹{txn.amount}
                  </TableCell>
                  <TableCell align="center">{txn.description}</TableCell>
                  <TableCell align="center" sx={{ fontSize: 20 }}>
                    {getCategoryIcon(txn.category_id)}
                  </TableCell>
                  <TableCell align="center">{formatDate(txn.date)}</TableCell>

                  <TableCell align="center">
                    <Tooltip title="Edit Transaction">
                      <IconButton
                        color="primary"
                        onClick={() => setEditTransaction(txn)}
                        disabled={editTransaction.amount !== undefined}
                        sx={{
                          transition: "transform 0.2s ease",
                          "&:hover": { transform: "scale(1.15)", color: "#0288d1" },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete Transaction">
                      <IconButton
                        color="error"
                        onClick={() => deleteTransaction(txn._id)}
                        disabled={editTransaction.amount !== undefined}
                        sx={{
                          transition: "transform 0.2s ease",
                          "&:hover": { transform: "scale(1.15)", color: "#d32f2f" },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TransactionList;
