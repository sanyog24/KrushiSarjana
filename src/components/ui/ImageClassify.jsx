import React, { useState } from "react";
import { Button, Typography, Box, CircularProgress } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import UploadIcon from "@mui/icons-material/Upload";

const ImageClassifier = () => {
  const [image, setImage] = useState(null); // State to store the image file
  const [result, setResult] = useState(null); // State to store the classification result
  const [loading, setLoading] = useState(false); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors

  // Handle image capture from camera
  const handleCapture = (event) => {
    const file = event.target.files[0]; // Get the captured image file
    if (file) {
      setImage(file); // Set the image in state
      classifyImage(file); // Send the image for classification
    }
  };

  // Handle image upload from device
  const handleUpload = (event) => {
    const file = event.target.files[0]; // Get the uploaded image file
    if (file) {
      setImage(file); // Set the image in state
      classifyImage(file); // Send the image for classification
    }
  };

  // Send image to the API for classification
  const classifyImage = async (file) => {
    setLoading(true); // Set loading to true
    setError(null); // Reset any previous errors
    setResult(null); // Reset any previous results

    const formData = new FormData(); // Create a FormData object
    formData.append("file", file); // Append the image file to the FormData

    try {
      // Send the image to the API
      const response = await fetch("https://evoprox-kisan-ai.hf.space/detect-crop/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to classify image"); // Handle API errors
      }

      const data = await response.json(); // Parse the response JSON
      setResult(data); // Set the classification result
    } catch (err) {
      setError(err.message); // Set the error message
    } finally {
      setLoading(false); // Set loading to false
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
      }}
    >
      <Typography variant="h5" gutterBottom>
        Classify Commodity
      </Typography>

      {/* Capture Image Button */}
      <Button
        variant="contained"
        component="label"
        startIcon={<CameraAltIcon />}
      >
        Capture Image
        <input
          type="file"
          accept="image/*"
          capture="environment" // Opens the camera
          hidden
          onChange={handleCapture} // Triggered when an image is captured
        />
      </Button>

      {/* Upload Image Button */}
      <Button variant="contained" component="label" startIcon={<UploadIcon />}>
        Upload Image
        <input
          type="file"
          accept="image/*" // Allows only image files
          hidden
          onChange={handleUpload} // Triggered when an image is uploaded
        />
      </Button>

      {/* Display Image Preview */}
      {image && (
        <Box sx={{ mt: 2 }}>
          <img
            src={URL.createObjectURL(image)} // Create a URL for the image
            alt="Captured"
            style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }}
          />
        </Box>
      )}

      {/* Display Loading or Result */}
      {loading && <CircularProgress sx={{ mt: 2 }} />}
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          Error: {error}
        </Typography>
      )}
      {result && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">
            Detected Crop: {result.detected_crop}
          </Typography>
          <Typography variant="h6">
            Confidence: {(result.confidence * 100).toFixed(2)}%
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ImageClassifier;