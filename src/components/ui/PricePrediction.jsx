import React, { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

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
  const [commodity, setCommodity] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePredict = async () => {
    if (!commodity) {
      setError('Please select a commodity.');
      return;
    }

    setIsLoading(true);
    setError('');
    setPrediction(null);
    setChartData(null);

    try {
      const response = await axios.get(`http://localhost:5002/predict?commodity=${commodity}`);
      setPrediction(response.data);

      // Prepare chart data
      if (response.data.historical_data) {
        const labels = response.data.historical_data.map((item) => item.Date);
        const prices = response.data.historical_data.map((item) => item['Price (per unit)']);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Price (₹)',
              data: prices,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
              tension: 0.4, // Smooth line
            },
          ],
        });
      }
    } catch (err) {
      setError('Failed to fetch prediction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const commodities = [
    "Tomato",
    "Onion",
    "Potato",
    "Banana",
    "Apple",
    "Mango",
    "Wheat",
    "Rice",
    "Moong",
    "Carrot",
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-[#112b1c] mb-6">Price Prediction</h2>

      {/* Commodity Selection and Predict Button */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <select
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#112b1c] focus:border-transparent transition-all"
          >
            <option value="" disabled>Select Commodity</option>
            {commodities.map((item, index) => (
              <option key={index} value={item}>{item}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handlePredict}
          disabled={isLoading}
          className="p-3 bg-[#112b1c] text-white rounded-lg hover:bg-[#1b3a28] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Predicting...' : 'Predict Price'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Prediction Result */}
      {prediction && !prediction.error && (
        <div className="mb-6 p-6 bg-green-50 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-[#112b1c] mb-2">
            Predicted Price for {prediction.commodity}
          </h3>
          <p className="text-2xl font-bold text-green-700">
            ₹{prediction.predicted_price.toFixed(2)} per {prediction.unit}
          </p>
        </div>
      )}

      {/* Chart */}
      {chartData && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-[#112b1c] mb-4">
            Price Trends for {prediction.commodity}
          </h3>
          <div className="p-4 bg-gray-50 rounded-lg">
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: 'Price Trends Over Time',
                    font: { size: 16 },
                  },
                  legend: {
                    display: true,
                    position: 'top',
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Date',
                      font: { size: 14 },
                    },
                    grid: {
                      display: false,
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Price (₹)',
                      font: { size: 14 },
                    },
                    grid: {
                      color: 'rgba(0, 0, 0, 0.05)',
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PricePrediction;