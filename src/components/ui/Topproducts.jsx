import React, { useState } from "react";
import { Button, Typography, Box, CircularProgress, List, ListItem, ListItemText, MenuItem, Select, FormControl, InputLabel } from "@mui/material";

const CropRecommendation = () => {
  const [district, setDistrict] = useState("");
  const [block, setBlock] = useState("");
  const [recommendedCrops, setRecommendedCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sample dropdown options
  const districts = [
    "NANDED",
    "DHULE",
    "AMRAVATI",
    "JALGAON",
    "Chhatrapati Sambhajinagar",
    "NASHIK",
    "SATARA",
    "PUNE",
    "SINDHUDURG",
    "NANDURBAR",
    "NAGPUR",
    "WASHIM",
    "RAIGAD",
    "AKOLA",
    "LATUR",
    "AHMEDNAGAR",
    "CHANDRAPUR",
    "WARDHA",
    "GADCHIROLI",
    "SANGLI",
    "HINGOLI",
    "PARBHANI",
    "DHARASHIV",
    "SOLAPUR",
    "RATNAGIRI",
    "BULDHANA",
    "KOLHAPUR",
    "THANE",
    "BEED",
    "BHANDARA",
    "JALNA",
    "YAVATMAL",
    "PALGHAR",
    "GONDIA"
  ];
  
  const blocks = ["Baramati", "Khed", "Junnar", "Ambegaon"];

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRecommendedCrops([]);

    try {
      // Construct the URL with query parameters
      const url = new URL("https://evoprox-kisan-ai.hf.space/predict/");
      url.searchParams.append("district", district);
      if (block) {
        url.searchParams.append("block", block);
      }

      console.log("API URL:", url.toString()); // Log the URL

      // Call the API with POST method
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("API Response Status:", response.status); // Log the response status

      if (!response.ok) {
        const errorData = await response.json(); // Parse the error response
        console.error("API Error Response:", errorData); // Log the error response
        throw new Error(errorData.message || "Failed to fetch crop recommendations");
      }

      const data = await response.json();
      console.log("API Success Response:", data); // Log the success response

      // Set the recommended crops
      setRecommendedCrops(data.recommended_crops);
    } catch (err) {
      console.error("Error:", err); // Log the error
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
      }}
    >
      <Typography variant="h6" gutterBottom>
        Get Crop Recommendations
      </Typography>

      {/* Input Form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
      >
        {/* District Dropdown */}
        <FormControl fullWidth>
          <InputLabel>District</InputLabel>
          <Select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            label="District"
            required
          >
            {districts.map((district) => (
              <MenuItem key={district} value={district}>
                {district}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Block Dropdown */}
        <FormControl fullWidth>
          <InputLabel>Block (Optional)</InputLabel>
          <Select
            value={block}
            onChange={(e) => setBlock(e.target.value)}
            label="Block (Optional)"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {blocks.map((block) => (
              <MenuItem key={block} value={block}>
                {block}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Get Recommendations"}
        </Button>
      </Box>

      {/* Display Recommended Crops */}
      {recommendedCrops.length > 0 && (
        <Box sx={{ mt: 2, width: "100%" }}>
          <Typography variant="h6" gutterBottom>
            Top 3 Recommended Crops:
          </Typography>
          <List>
            {recommendedCrops.map((crop, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`${index + 1}. ${crop.crop}`}
                  secondary={`Confidence: ${crop.confidence}%`}
                />
              </ListItem>
            ))}
          </List>
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

export default CropRecommendation;