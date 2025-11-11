import React, { useEffect, useState } from "react";
import { Container, Grid, Paper, Typography } from "@mui/material";
import Cookies from "js-cookie";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import TransactionChart from "../components/TransactionChart";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [editTransaction, setEditTransaction] = useState({});

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    const token = Cookies.get("token");
    const res = await fetch(`${process.env.REACT_APP_API_URL}/transaction`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const { data } = await res.json();
    setTransactions(data);
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        background:
          "linear-gradient(135deg, #1E3C72 0%, #2A5298 50%, #6A5ACD 100%)",
        borderRadius: 4,
        padding: 4,
        boxShadow: "0px 10px 25px rgba(0,0,0,0.3)",
        marginTop: 6,
        color: "white",
        minHeight: "100vh", // ✅ ensures full screen height
        pb: 6, // ✅ adds bottom padding to avoid cutoff
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      <Typography
        variant="h4"
        align="center"
        sx={{
          mb: 4,
          fontWeight: "bold",
          textShadow: "2px 2px 10px rgba(0,0,0,0.3)",
        }}
      >
        💰 Smart Expense Tracker Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Transaction Form */}
        <Grid item xs={12}>
          <Paper
            elevation={5}
            sx={{
              padding: 3,
              borderRadius: 3,
              backgroundColor: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              color: "white",
            }}
          >
            <TransactionForm
              fetchTransactions={fetchTransactions}
              editTransaction={editTransaction}
              setEditTransaction={setEditTransaction}
            />
          </Paper>
        </Grid>

        {/* Transaction List */}
        <Grid item xs={12} md={7}>
          <Paper
            elevation={5}
            sx={{
              padding: 3,
              borderRadius: 3,
              backgroundColor: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(8px)",
              height: "100%",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 600,
                color: "#E0E0E0",
              }}
            >
              📋 Recent Transactions
            </Typography>
            <TransactionList
              data={transactions}
              fetchTransactions={fetchTransactions}
              setEditTransaction={setEditTransaction}
              editTransaction={editTransaction}
            />
          </Paper>
        </Grid>

        {/* Transaction Chart */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={5}
            sx={{
              padding: 3,
              borderRadius: 3,
              backgroundColor: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(8px)",
              height: "100%",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 600,
                color: "#E0E0E0",
              }}
            >
              📊 Expense Overview
            </Typography>
            <TransactionChart data={transactions} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
