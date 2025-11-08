import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useSelector } from "react-redux";
import { Typography } from "@mui/material";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import IconButton from "@mui/material/IconButton";
import dayjs from "dayjs";
import Cookies from "js-cookie";

export default function TransactionList({
  data,
  fetchTransactions,
  setEditTransaction,
  editTransaction,
}) {
  const token = Cookies.get("token");
  const user = useSelector((state) => state.auth.user);

  function categoryName(id) {
    if (!user) return "Loading...";
    const category = user.categories.find((c) => c._id === id);
    return category ? category.icon : "N/A";
  }

  async function remove(_id) {
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/transaction/${_id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (res.ok) fetchTransactions();
  }

  function formatDate(date) {
    return dayjs(date).format("DD.MM.YYYY");
  }

  return (
    <>
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          mt: 6,
          mb: 2,
          letterSpacing: 0.5,
          color: "#1e3c72",
        }}
      >
        Transaction Records
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="styled table">
          <TableHead
            sx={{
              background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
            }}
          >
            <TableRow>
              {["Amount (₹)", "Description", "Category", "Date", "Actions"].map(
                (head) => (
                  <TableCell
                    key={head}
                    align="center"
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    {head}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((month) =>
              month.transactions.map((row, i) => (
                <TableRow
                  key={row._id}
                  sx={{
                    backgroundColor: i % 2 === 0 ? "#f7faff" : "#edf3ff",
                    "&:hover": {
                      backgroundColor: "#dce7ff",
                      transition: "0.3s ease",
                    },
                  }}
                >
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    ₹{row.amount}
                  </TableCell>
                  <TableCell align="center">{row.description}</TableCell>
                  <TableCell align="center" sx={{ fontSize: 18 }}>
                    {categoryName(row.category_id)}
                  </TableCell>
                  <TableCell align="center">{formatDate(row.date)}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => setEditTransaction(row)}
                      disabled={editTransaction.amount !== undefined}
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
                      disabled={editTransaction.amount !== undefined}
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
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
