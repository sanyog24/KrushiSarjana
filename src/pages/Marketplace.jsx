import React, { useState, useEffect } from "react";
import ProductCard from "../components/ui/ProductCard";
import { FaBars, FaTimes, FaMicrophone, FaQuestionCircle, FaEye, FaVolumeUp , FaStop } from "react-icons/fa"; //Import Volume Icon
import { IoFilter, IoPersonCircle } from "react-icons/io5";
import { GiFarmTractor, GiPlantRoots, GiSprout } from "react-icons/gi";
import axios from "axios";
import { getAllProducts } from "../api/product.js";


const MarketPlace = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [comparisonData, setComparisonData] = useState(null);


    //for products 
    const [dbProducts, setDbProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [fetchError, setFetchError] = useState(null);

    // Voice Assistant States (Integrated)
    const [recommendedProducts, setRecommendedProducts] = useState(null);
    const [isVoiceAssistantProcessing, setIsVoiceAssistantProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isVoicePopupVisible, setIsVoicePopupVisible] = useState(false); // NEW STATE for popup visibility
    let pollingIntervalId = null;

    useEffect(() => {
        // Cleanup polling interval if component unmounts or when new recommendations are received
        return () => clearInterval(pollingIntervalId);
    }, [pollingIntervalId, recommendedProducts]); // Depend on recommendedProducts to clear on new results

    
    const sendProductDataToBackend = async (products) => {
        console.log("sendProductDataToBackend called", products); // Debug log 1
        try {
            console.log("Product data to send:", products); // Debug log 2 - Inspect data just before sending
            await axios.post('http://localhost:5002/receive_product_data', { products });
            console.log('Product data sent to backend');
        } catch (error) {
            console.error('Error sending product data to backend:', error);
        }
    };

    useEffect(() => {
            const fetchProductsFromDB = async () => {
                setLoading(true);
                setFetchError(null); // Reset error before fetching
                try {
                    const fetchedProducts = await getAllProducts(); // Use the api function
                    if (!Array.isArray(fetchedProducts)) {
                        throw new Error("Failed to load products");
                    }
        
                    // Filter products for Retailer categories (Seeds, Pesticides, Equipments)
                    const retailerProducts = fetchedProducts.filter(product => {
                        return product.sellerType === "Retailer";
                    });
                    setDbProducts(retailerProducts);
                    sendProductDataToBackend(retailerProducts);
                    } catch (error) {
                        console.error("Error fetching products:", error);
                        setFetchError("Failed to fetch products from database.");
                    } finally {
                        setLoading(false);
                    }
                };
        
                fetchProductsFromDB();
            }, []);

    const handleVoiceAssistant = async () => {
        setRecommendedProducts(null);
        setErrorMessage(null);
        setIsVoiceAssistantProcessing(true);
        setIsVoicePopupVisible(true); // Show popup when voice assistant starts
        try {
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

    const handleCompare = (data) => {
        setComparisonData(data);
    };

    // Handle category selection
    const handleCategoryClick = (category) => {
        setSelectedCategory(category === "All" ? null : category); // Reset to null for "All Products"
        setRecommendedProducts(null); // Clear recommendations when category is clicked
    };

    // Filter products based on selected category
    const filteredProducts = selectedCategory
        ? dbProducts.filter((product) => product.category === selectedCategory)
        : dbProducts;


const productsToDisplay = recommendedProducts ? recommendedProducts : filteredProducts;

    return (
        <div className="flex h-screen bg-[#f3f3f3] text-gray-900">
            {/* Sidebar */}
            <div
                className={`fixed md:relative z-50 md:w-1/4 h-screen bg-[#0d1b16] p-6 text-white flex flex-col transition-all duration-300
                ${isSidebarOpen ? "left-0 w-3/4 sm:w-2/4" : "-left-full"} md:left-0`}
            >
                {/* Close Button for Mobile */}
                <button
                    className="absolute top-4 right-4 text-white text-2xl md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                >
                    <FaTimes />
                </button>

                {/* Logo and Profile */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">KrishiSarjana</h2>
                    <div className="text-3xl text-gray-300">👤</div>
                </div>

                {/* Voice Assistant Button */}
                <button
                    onClick={handleVoiceAssistant}
                    className="flex items-center gap-3 w-full p-4 bg-[#1b3a28] rounded-lg hover:bg-[#21503a]"
                    disabled={isVoiceAssistantProcessing} // Disable button while processing
                >
                    <FaMicrophone className="text-blue-400 text-2xl" />
                    <span className="text-sm text-gray-300">{isVoiceAssistantProcessing ? "Processing..." : "Voice Assistant"}</span>
                </button>

                {/* Categories Section */}
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <div className="text-yellow-400">⚙️</div>
                        Categories
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            className="flex flex-col items-center p-4 bg-[#1b3a28] rounded-lg hover:bg-[#21503a]"
                            onClick={() => handleCategoryClick("All")}
                        >
                            <div className="text-blue-400 text-3xl">📦</div>
                            <span className="text-sm mt-2">All Products</span>
                        </button>
                        <button
                            className="flex flex-col items-center p-4 bg-[#1b3a28] rounded-lg hover:bg-[#21503a]"
                            onClick={() => handleCategoryClick("Seeds")}
                        >
                            <div className="text-green-400 text-3xl">🌱</div>
                            <span className="text-sm mt-2">Seeds</span>
                        </button>
                        <button
                            className="flex flex-col items-center p-4 bg-[#1b3a28] rounded-lg hover:bg-[#21503a]"
                            onClick={() => handleCategoryClick("Pesticides")}
                        >
                            <div className="text-orange-400 text-3xl">🌿</div>
                            <span className="text-sm mt-2">Pesticides</span>
                        </button>
                        <button
                            className="flex flex-col items-center p-4 bg-[#1b3a28] rounded-lg hover:bg-[#21503a]"
                            onClick={() => handleCategoryClick("Equipments")}
                        >
                            <div className="text-red-400 text-3xl">🚜</div>
                            <span className="text-sm mt-2">Equipments</span>
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-auto flex justify-between items-center text-gray-400">
                    <div className="text-xl">❓</div>
                    <FaMicrophone className=" text-xl" />
                </div>
            </div>

            {/* Sidebar Toggle Button */}
            <button
                className="fixed top-4 left-4 md:hidden text-2xl bg-[#112b1c] text-white p-2 rounded-lg"
                onClick={() => setIsSidebarOpen(true)}
            >
                <FaBars />
            </button>

            {/* Main Content */}
            <div className="w-full md:w-3/4 min-h-screen p-6 bg-[#f3f3f3] overflow-y-auto">
                {isVoiceAssistantProcessing && <p>Voice assistant is processing your request, please wait...</p>}
                {errorMessage && <p style={{ color: 'red' }}>Error: {errorMessage}</p>}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {productsToDisplay && productsToDisplay.length > 0 ? ( // Conditionally render product cards if productsToDisplay is not null and not empty
                        productsToDisplay.map((product) => (
                            <ProductCard
                                id={product._id}
                                name={product.name}
                                price={product.price}
                                category={product.category}
                                description={product.description}
                                image={product.image}
                                onCompare={handleCompare}
                            />
                        ))
                    ) : productsToDisplay === null && !isVoiceAssistantProcessing ? ( // Display initial products or message when no recommendations and not processing
                        filteredProducts.map((product) => (
                            <ProductCard
                                id={product._id}
                                name={product.name}
                                price={product.price}
                                category={product.category}
                                description={product.description}
                                image={product.image}
                                onCompare={handleCompare}
                            />
                        ))
                    ) : !isVoiceAssistantProcessing && !errorMessage && productsToDisplay?.length === 0 && ( // Display "no products found" only when not processing, no error and recommendations are empty
                        <p>No products found matching your preferences.</p>
                    )}
                </div>
            </div>

           {isVoicePopupVisible && (
            <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/50">
            <div className="bg-white p-8 rounded-xl shadow-lg w-96 border-2 border-gray-200 relative max-h-[60vh] overflow-y-auto flex flex-col items-center">
                <h3 className="text-xl font-semibold text-center mb-4 text-gray-800">Voice Assistant</h3>
    
                {/* Replace Icon with GIF */}
                <img
                    src="https://media.giphy.com/media/26gs9jTY1R02ueEnu/giphy.gif?cid=790b7611pox6rn0itn37vnsx4wdt6bnvmqhr5gd63dng3s2m&ep=v1_gifs_search&rid=giphy.gif&ct=g"  // Replace with the actual GIF URL!
                    alt="Voice Assistant Listening"
                    className="h-20 w-20 mb-6 rounded-full bg-red-100" // Keep similar styling, remove flex centering
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

            {/* Comparison Modal */}
            {comparisonData && (
                <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 border-2 border-black relative max-h-[60vh] overflow-y-auto">
                        <button
                            className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
                            onClick={() => setComparisonData(null)}
                        >
                            <FaTimes size={20} />
                        </button>
                        <h3 className="text-xl font-semibold text-center mb-4">Compare Prices</h3>
                        {comparisonData.map((product, index) => (
                            <div key={index} className="flex justify-between items-center p-2 border-b last:border-none">
                                <span className="font-semibold w-1/3">{product.store}</span>
                                <span className="text-lg font-bold w-1/3 text-center">₹{product.price}</span>
                                <span className="text-sm text-gray-600 w-1/3 text-right">{product.description}</span>
                                <button
                                    className="text-blue-500 hover:text-blue-700"
                                    onClick={() => setComparisonData(null)}
                                >
                                    <FaEye />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarketPlace;