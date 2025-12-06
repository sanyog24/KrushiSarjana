import React, { useState } from "react";

const UIGuide = () => {
  // State to track the current step of the guide
  const [currentStep, setCurrentStep] = useState(0);

  // Array of image URLs for the guide
  const guideImages = [
    "https://via.placeholder.com/300x200?text=Feature+1",
    "https://via.placeholder.com/300x200?text=Feature+2",
    "https://via.placeholder.com/300x200?text=Feature+3",
  ];

  // Function to handle the "Next" button click
  const handleNext = () => {
    if (currentStep < guideImages.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // If it's the last step, close the guide
      closeGuide();
    }
  };

  // Function to handle the "Skip" button click
  const closeGuide = () => {
    console.log("Guide skipped or completed");
    // You can add logic to hide the guide or navigate to the main app
  };

  return (
    <div style={styles.container}>
      <div style={styles.guideContainer}>
        <img
          src={guideImages[currentStep]}
          alt={`Feature ${currentStep + 1}`}
          style={styles.image}
        />
        <div style={styles.buttonContainer}>
          <button onClick={closeGuide} style={styles.button}>
            Skip
          </button>
          <button onClick={handleNext} style={styles.button}>
            {currentStep === guideImages.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Styles for the UI guide
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f0f0",
  },
  guideContainer: {
    textAlign: "center",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  image: {
    width: "300px",
    height: "200px",
    borderRadius: "10px",
  },
  buttonContainer: {
    marginTop: "20px",
  },
  button: {
    margin: "0 10px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#007bff",
    color: "#fff",
  },
};

export default UIGuide;