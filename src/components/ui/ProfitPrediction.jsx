import React, { useState } from "react";
import { Button, Typography, Box, TextField, CircularProgress } from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PricePrediction = () => {
  const [crop, setCrop] = useState("");
  const [district, setDistrict] = useState("");
  const [priceData, setPriceData] = useState(null); // State to store the price data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(null);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPriceData(null);
    setChartData(null);

    try {
      // Construct the URL with query parameters
      const url = new URL("https://evoprox-kisan-ai.hf.space/crop-price/");
      url.searchParams.append("crop_name", crop);
      if (district) {
        url.searchParams.append("district", district);
      }

      // Call the API
      const response = await fetch(url, {
        method: "GET", // Use GET instead of POST
      });

      if (!response.ok) {
        throw new Error("Failed to fetch price prediction");
      }

      const data = await response.json();

      // Set the price data
      setPriceData(data);

      // Generate chart data
      setChartData({
        labels: ["Min Price", "Max Price"],
        datasets: [
          {
            label: "Price (₹)",
            data: [data.min_price, data.max_price],
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
          },
        ],
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        p: 4,
        border: "1px solid #ccc",
        borderRadius: "8px",
        bgcolor:"white"
      }}
    >
      <Typography variant="h6" gutterBottom>
        Predict Crop Prices
      </Typography>

      {/* Input Form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
      >
        <TextField
          label="Crop Name"
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="District Name"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          fullWidth
        />
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Predict Price"}
        </Button>
      </Box>

      {/* Display Price Data */}
      {priceData && (
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="h6">
            Crop: {priceData.crop}
          </Typography>
          <Typography variant="h6">
            District: {priceData.district}
          </Typography>
          <Typography variant="h6">
          Min Price: ₹{priceData.min_price.toFixed(2)}
          </Typography>
          <Typography variant="h6">
           Max Price: ₹{priceData.max_price.toFixed(2)}
          </Typography>
        </Box>
      )}

      {/* Display Chart */}
      {chartData && (
        <Box sx={{ width: "100%", mt: 2 }}>
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: "Price Trend",
                },
              },
            }}
          />
        </Box>
      )}

      {/* Display Error */}
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          Error: {error}
        </Typography>
      )}
    </Box>
  );
};

export default PricePrediction;