import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaMicrophone, FaStop } from "react-icons/fa";

const VoiceAssistantButton = () => {
    const [recommendedProducts, setRecommendedProducts] = useState(null);
    const [isVoiceAssistantProcessing, setIsVoiceAssistantProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isVoicePopupVisible, setIsVoicePopupVisible] = useState(false);
    const [statusMessage, setStatusMessage] = useState("Click microphone to start");
    const [allProducts, setAllProducts] = useState([]);
    
    const recognitionRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);
    const conversationStateRef = useRef({ step: 'language', category: null, maxPrice: null, language: 'en-US' });

    useEffect(() => {
        // Check if browser supports Web Speech API
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            setErrorMessage("Voice recognition not supported in this browser. Please use Chrome.");
        }
        
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            synthRef.current.cancel();
        };
    }, []);

    const speak = (text, lang = 'en-US') => {
        return new Promise((resolve) => {
            synthRef.current.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            utterance.rate = 0.9;
            utterance.onend = resolve;
            synthRef.current.speak(utterance);
        });
    };

    const startListening = () => {
        return new Promise((resolve, reject) => {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognitionRef.current = recognition;
            
            recognition.lang = conversationStateRef.current.language;
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript.toLowerCase();
                resolve(transcript);
            };

            recognition.onerror = (event) => {
                reject(event.error);
            };

            recognition.onend = () => {
                recognitionRef.current = null;
            };

            recognition.start();
        });
    };

    const extractCategory = (text) => {
        const pesticides = ['pesticide', 'pesticides', 'insecticide', 'herbicide'];
        const seeds = ['seed', 'seeds', 'grain', 'grains'];
        const equipment = ['equipment', 'tool', 'tools', 'machine', 'machinery'];
        
        text = text.toLowerCase();
        if (pesticides.some(word => text.includes(word))) return 'pesticide';
        if (seeds.some(word => text.includes(word))) return 'seed';
        if (equipment.some(word => text.includes(word))) return 'equipment';
        return null;
    };

    const extractPrice = (text) => {
        const numbers = text.match(/\d+/g);
        if (numbers && numbers.length > 0) {
            return parseInt(numbers[0]);
        }
        return null;
    };

    const recommendProducts = (category, maxPrice) => {
        let filtered = allProducts.filter(p => {
            const productCategory = p.category?.toLowerCase() || '';
            const matchCategory = productCategory === category || 
                                 productCategory === category + 's' ||
                                 category === productCategory + 's' ||
                                 productCategory.startsWith(category);
            return matchCategory;
        });

        if (maxPrice) {
            filtered = filtered.filter(p => p.price <= maxPrice);
        }

        return filtered.slice(0, 5).map(p => ({
            name: p.name,
            price: p.price,
            image: p.image
        }));
    };

    const handleVoiceAssistant = async () => {
        setRecommendedProducts(null);
        setErrorMessage(null);
        setIsVoiceAssistantProcessing(true);
        setIsVoicePopupVisible(true);
        conversationStateRef.current = { step: 'language', category: null, maxPrice: null, language: 'en-US' };

        try {
            // Fetch products
            const response = await axios.get("https://krushisarjana-backend.vercel.app/api/products/all-products");
            const products = response.data.products || [];
            setAllProducts(products);

            // Start conversation
            await runVoiceConversation();
        } catch (err) {
            console.error("Error:", err);
            setErrorMessage("Failed to start voice assistant. " + (err.message || ""));
            setIsVoiceAssistantProcessing(false);
            setIsVoicePopupVisible(false);
        }
    };

    const runVoiceConversation = async () => {
        try {
            // Language selection
            setStatusMessage("Choose language: English, Hindi, or Marathi");
            await speak("Hello! Please choose a language: English, Hindi, or Marathi", 'en-US');
            
            const langInput = await startListening();
            let selectedLang = 'en-US';
            let langCode = 'en';
            
            if (langInput.includes('hindi')) {
                selectedLang = 'hi-IN';
                langCode = 'hi';
            } else if (langInput.includes('marathi')) {
                selectedLang = 'mr-IN';
                langCode = 'mr';
            }
            
            conversationStateRef.current.language = selectedLang;

            // Category selection
            const categoryPrompts = {
                'en': "What would you like? Seed, Pesticide, or Equipment?",
                'hi': "आपको क्या चाहिए? बीज, कीटनाशक, या उपकरण?",
                'mr': "तुम्हाला काय हवे आहे? बियाणे, कीटकनाशक, किंवा उपकरणे?"
            };
            
            setStatusMessage(categoryPrompts[langCode]);
            await speak(categoryPrompts[langCode], selectedLang);
            
            const categoryInput = await startListening();
            const category = extractCategory(categoryInput);
            
            if (!category) {
                throw new Error("Could not understand category. Please try again.");
            }
            
            conversationStateRef.current.category = category;

            // Price selection
            const pricePrompts = {
                'en': "What is your maximum price?",
                'hi': "आपकी अधिकतम कीमत क्या है?",
                'mr': "तुमची कमाल किंमत काय आहे?"
            };
            
            setStatusMessage(pricePrompts[langCode]);
            await speak(pricePrompts[langCode], selectedLang);
            
            const priceInput = await startListening();
            const maxPrice = extractPrice(priceInput);
            conversationStateRef.current.maxPrice = maxPrice;

            // Get recommendations
            const recommendations = recommendProducts(category, maxPrice);
            
            if (recommendations.length === 0) {
                const noResultsMsg = {
                    'en': "Sorry, no products found matching your criteria.",
                    'hi': "क्षमा करें, आपके मानदंडों से मेल खाने वाला कोई उत्पाद नहीं मिला।",
                    'mr': "माफ करा, तुमच्या निकषांशी जुळणारे कोणतेही उत्पाद आढळले नाही।"
                };
                await speak(noResultsMsg[langCode], selectedLang);
            } else {
                const successMsg = {
                    'en': `I found ${recommendations.length} products for you.`,
                    'hi': `मुझे आपके लिए ${recommendations.length} उत्पाद मिले।`,
                    'mr': `मला तुमच्यासाठी ${recommendations.length} उत्पादने सापडली.`
                };
                await speak(successMsg[langCode], selectedLang);
                setRecommendedProducts(recommendations);
            }

            setIsVoiceAssistantProcessing(false);
            setIsVoicePopupVisible(false);

        } catch (error) {
            console.error("Voice conversation error:", error);
            setErrorMessage(error.message || "An error occurred during voice interaction");
            setIsVoiceAssistantProcessing(false);
            setIsVoicePopupVisible(false);
        }
    };

    const handleStopVoiceAssistant = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        synthRef.current.cancel();
        setIsVoiceAssistantProcessing(false);
        setIsVoicePopupVisible(false);
        setStatusMessage("Voice assistant stopped");
    };

    return (
        <>
            {/* Voice Assistant Button */}
            <button
                onClick={handleVoiceAssistant}
                className="flex items-center gap-3 w-full p-4 bg-[#1b3a28] rounded-lg hover:bg-[#21503a]"
                disabled={isVoiceAssistantProcessing}
            >
                <FaMicrophone className="text-blue-400 text-2xl" />
                <span className="text-sm text-gray-300">
                    {isVoiceAssistantProcessing ? "Processing..." : "Voice Assistant"}
                </span>
            </button>

            {/* Voice Assistant Popup */}
            {isVoicePopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/50">
                    <div className="bg-white p-8 rounded-xl shadow-lg w-96 border-2 border-gray-200 relative max-h-[60vh] overflow-y-auto flex flex-col items-center">
                        <h3 className="text-xl font-semibold text-center mb-4 text-gray-800">Voice Assistant</h3>

                        <img
                            src="https://media.giphy.com/media/RzqhECDimSgLK/giphy.gif"
                            alt="Voice Assistant Listening"
                            className="h-20 w-20 mb-6 rounded-full bg-red-100"
                        />

                        <p className="mb-6 text-lg text-gray-700 italic text-center">{statusMessage}</p>
                        <button
                            onClick={handleStopVoiceAssistant}
                            className="bg-red-300 hover:bg-red-400 text-gray-800 font-semibold py-2 px-6 rounded-md shadow-md transition-colors duration-200"
                        >
                            <FaStop className="inline-block mr-2" /> Stop
                        </button>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {errorMessage && (
                <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {errorMessage}
                </div>
            )}

            {/* Recommended Products */}
            {recommendedProducts && recommendedProducts.length > 0 && (
                <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded">
                    <h3 className="font-semibold mb-2">Recommended Products:</h3>
                    <ul className="space-y-2">
                        {recommendedProducts.map((product, index) => (
                            <li key={index} className="flex items-center gap-2">
                                {product.image && (
                                    <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                                )}
                                <span>{product.name} - ₹{product.price}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default VoiceAssistantButton;