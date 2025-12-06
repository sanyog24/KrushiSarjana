import React, { useState, useEffect } from "react";
import { Switch } from "../components/ui/Switch.jsx";
import PriceComparison from "../components/ui/PriceComparison.jsx";
import PricePrediction from "../components/ui/PricePrediction.jsx";
import ProfitPrediction from "../components/ui/ProfitPrediction.jsx";
import { FaBell, FaChartLine, FaShoppingCart, FaBars, FaTimes, FaMoneyBillWave, FaBookReader } from "react-icons/fa";
import { MdOutlineAnalytics, MdCategory, MdUpload } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "../api/api.js";
import { jwtDecode } from "jwt-decode";
import ChatButton from "../components/ui/ChatButton.jsx";
import Marquee from "react-fast-marquee";
import postHarvestQuiz from "../data/postHarvestQuiz.json"; // Import quiz data
import lessons from "../data/lesson.json"; // Import lesson data
import CropRecommendation from "../components/ui/Topproducts.jsx";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasCultivableLand, setHasCultivableLand] = useState(false);
  const [hasSpouseOrChildren, setHasSpouseOrChildren] = useState(false);
  const [hasGovJob, setHasGovJob] = useState(false);
  const [showFilterForm, setShowFilterForm] = useState(false);
  const [showPricePrediction, setShowPricePrediction] = useState(true);
  const [showProfitPrediction, setShowProfitPrediction] = useState(true);
  const [showPostHarvestPopup, setShowPostHarvestPopup] = useState(false);
  const [selectedCommodity, setSelectedCommodity] = useState("");
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode(token);
        if (!decoded.id) return console.error("User ID not found in token");

        const userData = await AuthAPI.getUserById(decoded.id);
        setUser(userData);
      } catch (error) {
        console.error(error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  // Handle eligibility form submission
  const handleFilterSubmit = (e) => {
    e.preventDefault();

    if (hasCultivableLand && hasSpouseOrChildren && !hasGovJob) {
      navigate("/Schemes");
    } else {
      alert("You are not eligible for government schemes.");
    }
  };

  // Handle commodity selection
  const handleCommodityChange = (e) => {
    const commodity = e.target.value;
    setSelectedCommodity(commodity);
    setQuizQuestions(postHarvestQuiz[commodity] || []);
    setUserAnswers([]);
    setQuizResult(null); // Reset quizResult when a new commodity is selected
  };

  // Handle answer selection
  const handleAnswerSelect = (questionIndex, selectedOption) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = selectedOption;
    setUserAnswers(newAnswers);
  };

  // Handle quiz submission
  const handleQuizSubmit = () => {
    let score = 0;
    quizQuestions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        score++;
      }
    });
    setQuizResult({ score, total: quizQuestions.length }); // Set quiz result
    setIsModalOpen(true); // Open the modal
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="flex h-screen bg-[#f3f3f3] text-gray-900">
      {/* Sidebar */}
      <div
        className={`fixed md:relative z-50 md:w-1/4 h-screen md:h-auto bg-[#112b1c] p-6 text-white flex flex-col transition-all duration-300 
        ${isSidebarOpen ? "left-0 w-3/4 sm:w-2/4" : "-left-full"} md:left-0 md:flex`}
      >
        {/* Close Button for Mobile */}
        <button
          className="absolute top-4 right-4 text-white text-2xl md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        >
          <FaTimes />
        </button>

        {/* Logo */}
        <div className="flex items-center justify-center md:justify-start mt-4 mb-6">
          {user ? (
            user.avatar ? (
              <img
                src={user.avatar}
                alt="User Avatar"
                className="w-12 h-12 rounded-full shadow-md"
              />
            ) : (
              <div className="w-12 h-12 flex items-center justify-center bg-gray-500 text-white rounded-full shadow-md text-lg">
                {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </div>
            )
          ) : (
            <div className="w-12 h-12 flex items-center justify-center bg-gray-500 text-white rounded-full shadow-md">
              Loading...
            </div>
          )}
          <span className="text-2xl font-bold ml-3">🌿 KrishiSarjana</span>
        </div>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-1 gap-4 mb-6">
          <button
            className="flex flex-col md:flex-row items-center md:justify-start md:gap-3 p-4 bg-[#1b3a28] rounded-lg hover:bg-[#21503a] transition-all"
            onClick={() => navigate("/marketplace")}
          >
            <MdCategory className="text-orange-400 text-2xl" />
            <span className="text-sm text-gray-300 mt-1 md:mt-0">Marketplace</span>
          </button>

          <button
            className="flex flex-col md:flex-row items-center md:justify-start md:gap-3 p-4 bg-[#1b3a28] rounded-lg hover:bg-[#21503a] transition-all"
            onClick={() => navigate("/MyFarmerPro")}
          >
            <MdUpload className="text-green-400 text-2xl" />
            <span className="text-sm text-gray-300 mt-1 md:mt-0">Upload Products</span>
          </button>

          <button
            className="flex flex-col md:flex-row items-center md:justify-start md:gap-3 p-4 bg-[#1b3a28] rounded-lg hover:bg-[#21503a] transition-all"
            onClick={() => navigate("/FarmerOrder")}
          >
            <FaShoppingCart className="text-red-400 text-2xl" />
            <span className="text-sm text-gray-300 mt-1 md:mt-0">Orders</span>
          </button>

          <button
            className="flex flex-col md:flex-row items-center md:justify-start md:gap-3 p-4 bg-[#1b3a28] rounded-lg hover:bg-[#21503a] transition-all"
            onClick={() => setShowPostHarvestPopup(true)}
          >
            <FaBookReader className="text-yellow-400 text-2xl" />
            <span className="text-sm text-gray-300 mt-1 md:mt-0">Learn Post Harvest Techniques</span>
          </button>
        </div>

        {/* Settings */}
        <div className="grid grid-cols-2 gap-4 mt-10">
          <button
            className="flex items-center gap-3 w-full p-3 bg-[#1b3a28] rounded-lg transition hover:bg-[#21503a]"
            onClick={() => navigate("/AlertPage")}
          >
            <FaBell className="text-lg" /> Alerts
          </button>

          <button
            className="flex items-center gap-3 w-full p-3 bg-[#1b3a28] rounded-lg transition hover:bg-[#21503a]"
            onClick={() => navigate("/putOnRent")}
          >
            <FaMoneyBillWave className="text-lg" /> Put on Rent
          </button>

          <button
            className="flex items-center gap-3 w-full p-3 bg-[#1b3a28] rounded-lg transition hover:bg-[#21503a]"
            onClick={() => navigate("/buyOnRent")}
          >
            <FaShoppingCart className="text-lg" /> Buy on Rent
          </button>

          <button
            className="flex items-center gap-3 w-full p-3 bg-[#1b3a28] rounded-lg transition hover:bg-[#21503a]"
            onClick={() => setShowFilterForm(true)}
          >
            <FaChartLine className="text-lg" /> Schemes
          </button>
        </div>

        {/* Switch Controls */}
        <div className="mt-12 space-y-4">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2 text-gray-300">
              <MdOutlineAnalytics /> Price Prediction
            </span>
            <Switch
              defaultChecked={showPricePrediction}
              onChange={(checked) => setShowPricePrediction(checked)}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2 text-gray-300">
              <FaChartLine /> Profit Prediction
            </span>
            <Switch
              defaultChecked={showProfitPrediction}
              onChange={(checked) => setShowProfitPrediction(checked)}
            />
          </div>
        </div>
      </div>

      {/* Sidebar Toggle Button (only for small devices) */}
      <button
        className="fixed top-4 left-4 md:hidden text-2xl bg-[#112b1c] text-white p-2 rounded-lg"
        onClick={() => setIsSidebarOpen(true)}
      >
        <FaBars />
      </button>

      {/* Main Content */}
      <div className="w-full md:w-3/4 h-screen p-6 overflow-auto">
        <Marquee>
          <span className="text-lg font-bold text-red-500"> 🔴 NEW GOVERNMENT SCHEMES  </span>
          <a href="https://agriinfra.dac.gov.in/Home" target="_blank" className="text-blue-500 underline ml-2">National Agriculture Infra Financing Facility </a>
        </Marquee>
        
          <div className="mt-6">
            <CropRecommendation/>
          </div>
          
        {/* Profit Prediction & Price Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {showProfitPrediction && <ProfitPrediction />}
          <PriceComparison />
        </div>
      </div>

      {/* Chat Button */}
      <ChatButton />

      {/* Filtering Form */}
      {showFilterForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
            <h2 className="text-xl font-bold mb-4">Eligibility Check</h2>
            <form onSubmit={handleFilterSubmit}>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="cultivableLand"
                    checked={hasCultivableLand}
                    onChange={(e) => setHasCultivableLand(e.target.checked)}
                  />
                  <label htmlFor="cultivableLand">Do you have cultivable land?</label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="spouseOrChildren"
                    checked={hasSpouseOrChildren}
                    onChange={(e) => setHasSpouseOrChildren(e.target.checked)}
                  />
                  <label htmlFor="spouseOrChildren">Do you have a spouse or children?</label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="govJob"
                    checked={hasGovJob}
                    onChange={(e) => setHasGovJob(e.target.checked)}
                  />
                  <label htmlFor="govJob">Do you have a government job?</label>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  onClick={() => setShowFilterForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#112b1c] text-white px-4 py-2 rounded-lg hover:bg-[#21503a]"
                >
                  Check Eligibility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Harvest Techniques Popup */}
      {showPostHarvestPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 max-h-[90vh] overflow-y-auto relative">
            {/* Close Button */}
            <button
              onClick={() => {
                setShowPostHarvestPopup(false);
                setSelectedCommodity("");
                setQuizQuestions([]);
                setUserAnswers([]);
                setQuizResult(null);
              }}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-xl font-bold mb-4">Learn Post Harvest Techniques</h2>

            {/* Commodity Dropdown */}
            <select
              value={selectedCommodity}
              onChange={handleCommodityChange}
              className="w-full p-2 border rounded-lg mb-6"
            >
              <option value="">Select a commodity</option>
              <option value="onion">Onion</option>
              <option value="tomato">Tomato</option>
              <option value="potato">Potato</option>
              <option value="carrot">Carrot</option>
              <option value="apple">Apple</option>
              <option value="banana">Banana</option>
              <option value="cabbage">Cabbage</option>
              <option value="garlic">Garlic</option>
              <option value="lettuce">Lettuce</option>
              <option value="mango">Mango</option>
            </select>

            {selectedCommodity && (
              <div className="space-y-4">
                {quizQuestions.map((question, index) => (
                  <div key={index} className="border p-4 rounded-lg">
                    <p className="font-semibold">{question.question}</p>
                    <div className="space-y-2 mt-2">
                      {question.options.map((option, optionIndex) => (
                        <label key={optionIndex} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={option}
                            onChange={() => handleAnswerSelect(index, option)}
                            checked={userAnswers[index] === option}
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Submit Button */}
            {selectedCommodity && (
              <button
                onClick={handleQuizSubmit}
                className="w-full bg-[#112b1c] text-white py-2 mt-6 rounded-lg hover:bg-[#21503a]"
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal for Quiz Result */}
      {isModalOpen && quizResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-md">
            <h2 className="text-lg font-bold">Quiz Result</h2>
            <p className="mt-2">
              Your Score: {quizResult.score}/{quizResult.total}
            </p>
            {quizResult.score < quizQuestions.length && (
              <div className="mt-4 p-4 bg-yellow-100 rounded-lg">
                <h3 className="font-semibold">{lessons[selectedCommodity].title}</h3>
                <ul className="list-disc list-inside">
                  {lessons[selectedCommodity].content.map((line, index) => (
                    <li key={index}>{line}</li>
                  ))}
                </ul>
              </div>
            )}
            <button
              onClick={closeModal}
              className="mt-4 w-full bg-[#112b1c] text-white py-2 rounded-lg hover:bg-[#21503a]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;