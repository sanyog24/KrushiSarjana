import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaMicrophone, FaVolumeUp, FaStop } from "react-icons/fa";

const VoiceAssistantButton = () => {
    const [recommendedProducts, setRecommendedProducts] = useState(null);
    const [isVoiceAssistantProcessing, setIsVoiceAssistantProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isVoicePopupVisible, setIsVoicePopupVisible] = useState(false);
    let pollingIntervalId = null;

    useEffect(() => {
        // Cleanup polling interval if component unmounts or when new recommendations are received
        return () => clearInterval(pollingIntervalId);
    }, [pollingIntervalId, recommendedProducts]); // Depend on recommendedProducts to clear on new results

    const handleVoiceAssistant = async () => {
        setRecommendedProducts(null);
        setErrorMessage(null);
        setIsVoiceAssistantProcessing(true);
        setIsVoicePopupVisible(true); // Show popup when voice assistant starts
        try {
            // Fetch all products from backend
            const productsResponse = await axios.get("http://localhost:5000/api/products/all-products");
            const allProducts = productsResponse.data.products || [];
            console.log("Fetched Products:", allProducts);

            // Map products to the format expected by the backend
            const formattedProducts = allProducts.map((product) => ({
                name: product.name,
                category: product.category?.toLowerCase() || "",
                price: parseFloat(product.price) || 0,
                image: product.image || "",
            }));

            // Send product data to backend
            await axios.post("http://localhost:5002/receive_product_data", {
                products: formattedProducts,
            });
            console.log("Product data sent to backend");

            // Now start the voice assistant
            const response = await axios.get("http://localhost:5002/voice"); // Call /voice to START assistant
            console.log("Voice Assistant Initial Response:", response.data);

            if (response.data.message === "Voice assistant started.") {
                // Start polling to check for recommendations from /recommendations route
                startPollingForRecommendations();
            } else if (response.data.message === "Voice assistant is already active.") {
                startPollingForRecommendations(); // Still start polling to get results if already active
            }
        } catch (err) {
            console.error("Failed to start voice assistant:", err);
            setErrorMessage("Failed to start voice assistant. Please try again.");
            setIsVoiceAssistantProcessing(false);
            setIsVoicePopupVisible(false); // Hide popup on error
        }
    };

    const handleStopVoiceAssistant = async () => { // NEW FUNCTION
        setIsVoiceAssistantProcessing(false); // Immediately set processing to false
        setIsVoicePopupVisible(false); // Immediately hide the popup
        clearInterval(pollingIntervalId); // Stop polling
        try {
            await axios.get("http://localhost:5002/stop_voice_assistant"); // Call backend stop endpoint
            console.log("Voice assistant stopped by user.");
        } catch (error) {
            console.error("Error stopping voice assistant:", error);
            setErrorMessage("Error stopping voice assistant.");
        }
    };

    const startPollingForRecommendations = () => {
        pollingIntervalId = setInterval(async () => {
            try {
                const response = await axios.get("http://localhost:5002/recommendations");
                console.log("Polling Recommendations Response:", response.data);

                if (response.data.recommendations) {
                    setRecommendedProducts(response.data.recommendations);
                    setIsVoiceAssistantProcessing(false);
                    setIsVoicePopupVisible(false);
                    clearInterval(pollingIntervalId);
                } else if (response.data.error) {
                    setErrorMessage(response.data.error);
                    setIsVoiceAssistantProcessing(false);
                    setIsVoicePopupVisible(false);
                    clearInterval(pollingIntervalId);
                } else if (response.data.message === "Voice assistant exited.") {
                    setIsVoiceAssistantProcessing(false);
                    setIsVoicePopupVisible(false);
                    clearInterval(pollingIntervalId);
                } else if (response.data.message === "Voice assistant stopped by user.") { // NEW CONDITION
                    setIsVoiceAssistantProcessing(false);
                    setIsVoicePopupVisible(false);
                    clearInterval(pollingIntervalId);
                }
                else if (response.data.message !== "Voice assistant is still processing.") {
                    setIsVoiceAssistantProcessing(false);
                    setIsVoicePopupVisible(false);
                    clearInterval(pollingIntervalId);
                }
            } catch (err) {
                console.error("Error during polling for recommendations:", err);
                setErrorMessage("Error checking for recommendations.");
                setIsVoiceAssistantProcessing(false);
                setIsVoicePopupVisible(false);
                clearInterval(pollingIntervalId);
            }
        }, 2000);
    };

    return (
        <>
            {/* Voice Assistant Button */}
            <button
                onClick={handleVoiceAssistant}
                className="flex items-center gap-3 w-full p-4 bg-[#1b3a28] rounded-lg hover:bg-[#21503a]"
                disabled={isVoiceAssistantProcessing} // Disable button while processing
            >
                <FaMicrophone className="text-blue-400 text-2xl" />
                <span className="text-sm text-gray-300">{isVoiceAssistantProcessing ? "Processing..." : "Voice Assistant"}</span>
            </button>

            {/* Voice Assistant Popup */}
            {isVoicePopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/50">
                    <div className="bg-white p-8 rounded-xl shadow-lg w-96 border-2 border-gray-200 relative max-h-[60vh] overflow-y-auto flex flex-col items-center">
                        <h3 className="text-xl font-semibold text-center mb-4 text-gray-800">Voice Assistant</h3>

                        {/* GIF Image */}
                        <img
                            src="https://media.giphy.com/media/RzqhECDimSgLK/giphy.gif?cid=790b7611py148mhgc9ui6d4wi1z194heekvvj6oy9bevcgsj&ep=v1_gifs_search&rid=giphy.gif&ct=g"
                            alt="Voice Assistant Listening"
                            className="h-20 w-20 mb-6 rounded-full bg-red-100"
                        />

                        <p className="mb-6 text-lg text-gray-700 italic">Listening for your request...</p>
                        <button
                            onClick={handleStopVoiceAssistant}
                            className="bg-red-300 hover:bg-red-400 text-gray-800 font-semibold py-2 px-6 rounded-md shadow-md transition-colors duration-200"
                        >
                            <FaStop className="inline-block mr-2" /> Stop
                        </button>
                    </div>
                </div>
            )}

            {/* Error Message Display (Optional - you can handle error in MarketPlace if preferred) */}
            {errorMessage && <p style={{ color: 'red' }}>Error: {errorMessage}</p>}
            {recommendedProducts && recommendedProducts.length > 0 && (
                <div>
                    <h3>Recommended Products:</h3>
                    <ul>
                        {recommendedProducts.map((product, index) => (
                            <li key={index}>{product.name} - Price: {product.price}</li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default VoiceAssistantButton;