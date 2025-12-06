import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, CheckCircle, Calendar } from "lucide-react";

const AgricultureLandingPage = () => {
  const navigate = useNavigate();
  const [showGuide, setShowGuide] = useState(true); // State to control guide visibility
  const [currentStep, setCurrentStep] = useState(0); // State to track the current step of the guide

  // Array of image URLs for the guide
  const guideImages = [
    "/languageSelec.jpg",
    "/multilingual.jpg",
    "/languagechange.jpg",
    "/voiceAssistant.jpg"
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
    setShowGuide(false); // Hide the guide
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-green-50 via-green-100 to-emerald-100 overflow-hidden">
      {/* UI Guide Popup */}
      {showGuide && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-md p-8 max-w-lg w-full text-center shadow-xl">
            <img
              src={guideImages[currentStep]}
              alt={`Guide Step ${currentStep + 1}`}
              className="w-full h-auto rounded-lg mb-6"
            />
            <div className="flex justify-center gap-4">
              <button
                onClick={closeGuide}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                {currentStep === guideImages.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="leaf leaf1"></div>
        <div className="leaf leaf2"></div>
        <div className="leaf leaf3"></div>
        <div className="leaf leaf4"></div>
        <div className="leaf leaf5"></div>
        <div className="leaf leaf6"></div>
        <div className="seed seed1"></div>
        <div className="seed seed2"></div>
        <div className="seed seed3"></div>
        <div className="seed seed4"></div>
        <div className="seed seed5"></div>
        <div className="seed seed6"></div>
      </div>

      {/* Main Content */}
      <div className="relative h-full flex items-center z-10">
        <div className="container mx-auto px-8">
          <div className="flex flex-col md:flex-row items-center">
            {/* Text Content */}
            <div className="w-full md:w-1/2 mb-12 md:mb-0">
              <h1 className="text-5xl md:text-6xl font-bold text-green-800 mb-4 leading-tight">
                Krishi
              </h1>
              <h1 className="text-5xl md:text-8xl font-bold text-yellow-400 mb-4 leading-tight">
                Sarjana
              </h1>
              <h2 className="text-2xl md:text-3xl font-medium text-green-700 my-6 ">
                Farm to Table, Digitally Enhanced
              </h2>
              <p className="text-lg text-gray-700 my-10 max-w-lg">
                Connecting farmers and consumers directly through technology,
                ensuring fair prices and fresher produce for everyone.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/login")}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium text-lg 
                         shadow-lg hover:shadow-green-200 hover:bg-green-700 
                         transform transition duration-300 hover:-translate-y-1"
                >
                  Login / Register 🚪
                </button>
                <button
                  onClick={() => navigate("/aboutpage")}
                  className="px-8 py-3 bg-white text-green-700 rounded-lg font-medium text-lg 
                         border-2 border-green-600 shadow-lg hover:shadow-green-200
                         transform transition duration-300 hover:-translate-y-1"
                >
                  About Us 🌱
                </button>
              </div>
            </div>

            {/* 3D CSS Plant Component */}
            <div className="w-full md:w-1/2 flex justify-center">
              <img src="/images/farmers.png" alt="farmers" width={500} height={500} />
            </div>
          </div>

          {/* PM-Kisan Quick Links Section */}
          <div className="bg-green-500 backdrop-blur-lg rounded-xl p-6 space-y-4 mt-8 shadow-xl">
            <h3 className="text-green-100 font-semibold text-xl flex items-center gap-2">
              <CheckCircle size={24} />
              PM-Kisan Quick Links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => window.open("https://pmkisan.gov.in/homenew.aspx", "_blank")}
                className="flex items-center justify-center space-x-3 bg-yellow-500 hover:bg-green-600 
                    transition-colors rounded-lg p-4 text-white shadow-lg hover:shadow-green-900/30"
              >
                <Users size={22} />
                <span className="text-lg text-black font-medium">Check Beneficiary Status</span>
              </button>
              <button
                onClick={() => window.open("https://pmkisan.gov.in/RegistrationFormNew.aspx", "_blank")}
                className="flex items-center justify-center space-x-3 bg-blue-300 hover:bg-green-600 
                    transition-colors rounded-lg p-4 text-white shadow-lg hover:shadow-green-900/30"
              >
                <Calendar size={22} />
                <span className="text-lg text-black font-medium">New Registration</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for the 3D effects and animations */}
      <style jsx>{`
        /* Floating Leaf Animation */
        .leaf {
          position: absolute;
          width: 60px;
          height: 60px;
          background-color: rgba(52, 211, 153, 0.4);
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          animation: float 15s linear infinite;
        }

        .leaf1 { top: 15%; left: 10%; animation-delay: 0s; }
        .leaf2 { top: 25%; right: 15%; width: 80px; height: 80px; animation-delay: -5s; animation-duration: 17s; }
        .leaf3 { bottom: 20%; right: 20%; width: 40px; height: 40px; animation-delay: -10s; animation-duration: 13s; }
        .leaf4 { top: 45%; left: 25%; width: 70px; height: 70px; animation-delay: -7s; animation-duration: 16s; }
        .leaf5 { top: 65%; right: 35%; width: 50px; height: 50px; animation-delay: -3s; animation-duration: 14s; }
        .leaf6 { bottom: 35%; left: 40%; width: 65px; height: 65px; animation-delay: -8s; animation-duration: 18s; }

        .seed {
          position: absolute;
          width: 15px;
          height: 15px;
          background-color: rgba(167, 139, 50, 0.5);
          border-radius: 50%;
          animation: float 10s linear infinite;
        }

        .seed1 { top: 40%; left: 20%; animation-delay: -2s; }
        .seed2 { top: 60%; left: 40%; animation-delay: -7s; animation-duration: 14s; }
        .seed3 { top: 30%; right: 30%; animation-delay: -3s; animation-duration: 16s; }
        .seed4 { top: 50%; right: 15%; animation-delay: -5s; animation-duration: 13s; }
        .seed5 { bottom: 40%; left: 30%; animation-delay: -4s; animation-duration: 15s; }
        .seed6 { top: 35%; right: 45%; animation-delay: -6s; animation-duration: 12s; }

        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.4;
          }
          25% {
            opacity: 0.7;
          }
          50% {
            transform: translateY(-100px) rotate(180deg);
            opacity: 0.9;
          }
          75% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(-200px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default AgricultureLandingPage;