import React, { useState, useEffect } from "react";
import ProductCard from "../components/ui/ProductCard";
import VoiceAssistantButton from "../components/ui/VoiceAssistantButton";
import { FaBars, FaTimes, FaEye } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";
import { getAllProducts } from "../api/product.js";


const MarketPlace = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [comparisonData, setComparisonData] = useState(null);
    const [voiceRecommendedProducts, setVoiceRecommendedProducts] = useState(null);

    //for products 
    const [dbProducts, setDbProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [fetchError, setFetchError] = useState(null);

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
                    } catch (error) {
                        console.error("Error fetching products:", error);
                        setFetchError("Failed to fetch products from database.");
                    } finally {
                        setLoading(false);
                    }
                };
        
                fetchProductsFromDB();
            }, []);    const handleCompare = (data) => {
        setComparisonData(data);
    };

    // Handle category selection
    const handleCategoryClick = (category) => {
        setSelectedCategory(category === "All" ? null : category); // Reset to null for "All Products"
        setVoiceRecommendedProducts(null); // Clear voice recommendations when category is clicked
    };

    // Callback for voice assistant recommendations
    const handleVoiceRecommendations = (recommendations) => {
        setVoiceRecommendedProducts(recommendations);
        setSelectedCategory(null); // Clear category filter when showing voice results
    };

    // Filter products based on selected category
    const filteredProducts = selectedCategory
        ? dbProducts.filter((product) => product.category === selectedCategory)
        : dbProducts;


const productsToDisplay = voiceRecommendedProducts || filteredProducts;    return (
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
                    <VoiceAssistantButton 
                        allProducts={dbProducts}
                        onRecommendations={handleVoiceRecommendations}
                    />
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
                    ) : productsToDisplay?.length === 0 && (
                        <p>No products found matching your preferences.</p>
                    )}
                </div>
            </div>

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