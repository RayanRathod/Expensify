import * as React from "react";
import Paper from "@mui/material/Paper";
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  BarSeries,
  Tooltip,
  Title,
} from "@devexpress/dx-react-chart-material-ui";
import {
  Animation,
  ArgumentScale,
  EventTracker,
} from "@devexpress/dx-react-chart";
import { scaleBand } from "@devexpress/dx-chart-core";
import dayjs from "dayjs";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

export default function TransactionChart({ data }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Mobile
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md")); // Tablet

  // Format data to month names
  const chartData = data.map((item) => ({
    ...item,
    month: dayjs().month(item._id - 1).format("MMMM"),
  }));

  // Adjust chart size dynamically
  const chartWidth = isSmallScreen ? 320 : isMediumScreen ? 500 : 700;
  const chartHeight = isSmallScreen ? 250 : isMediumScreen ? 320 : 400;

  return (
    <Paper
      elevation={6}
      sx={{
        p: { xs: 2, sm: 3 },
        mt: { xs: 3, sm: 4 },
        borderRadius: 3,
        background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
        color: "#fff",
        boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
        maxWidth: "95%",
        mx: "auto",
        overflowX: "auto",
      }}
    >
      <Chart
        data={chartData}
        width={chartWidth}
        height={chartHeight}
        style={{ minWidth: 300 }}
      >
        <ArgumentScale factory={scaleBand} />

        {/* X-Axis */}
        <ArgumentAxis
          showLine
          showTicks
          labelComponent={(props) => (
            <ArgumentAxis.Label
              {...props}
              style={{
                fill: "#fff",
                fontSize: isSmallScreen ? "0.7rem" : "0.85rem",
                fontWeight: 500,
              }}
            />
          )}
        />

        {/* Y-Axis */}
        <ValueAxis
          labelComponent={(props) => (
            <ValueAxis.Label
              {...props}
              style={{
                fill: "#fff",
                fontSize: isSmallScreen ? "0.7rem" : "0.85rem",
                fontWeight: 500,
              }}
            />
          )}
        />

        {/* Stylish Gradient Bar */}
        <BarSeries
          valueField="totalExpenses"
          argumentField="month"
          color="url(#barGradient)"
          barWidth={0.6}
        />

        <Animation />
        <EventTracker />
        <Tooltip
          contentComponent={({ text }) => (
            <div
              style={{
                background: "#fff",
                color: "#333",
                padding: "6px 10px",
                borderRadius: "6px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                fontSize: "0.8rem",
              }}
            >
              {text}
            </div>
          )}
        />

        {/* Chart Title */}
        <Title
          text="Monthly Expense Overview"
          textComponent={({ text }) => (
            <div
              style={{
                textAlign: "center",
                color: "#fff",
                fontSize: isSmallScreen ? "1rem" : "1.2rem",
                fontWeight: 600,
                marginBottom: "10px",
              }}
            >
              {text}
            </div>
          )}
        />
      </Chart>

      {/* Gradient for Bars */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00e5ff" />
            <stop offset="100%" stopColor="#6a11cb" />
          </linearGradient>
        </defs>
      </svg>
    </Paper>
  );
}
