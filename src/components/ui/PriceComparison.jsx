import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Card } from "./Card.jsx";

// Image slider data with prices
const images = [
  { src: "/images/tomato.png", name: "Tomato", price: "₹56/kg" },
  { src: "/images/onion.png", name: "Onion", price: "₹43.23/kg" },
  { src: "/images/potato.png", name: "Potato", price: "₹32.68/kg" },
  { src: "/images/banana.png", name: "Banana", price: "30/dozen" },
  { src: "/images/apple.png", name: "Apple", price: "₹120.67/kg" },
  { src: "/images/mango.png", name: "Mango", price: "₹80/kg" },
  { src: "/images/wheat.png", name: "Wheat", price: "₹25/kg" },
  { src: "/images/rice.png", name: "Rice", price: "₹47.6/kg" },
  { src: "/images/moong.png", name: "Moong", price: "₹100/kg" },
  { src: "/images/carrot.png", name: "Carrot", price: "₹37.65/kg" },
];

const PriceComparison = () => {
  const [index, setIndex] = useState(0);

  const nextImage = () => setIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <Card className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-[#112b1c] mb-6">Price Comparison</h2>

      {/* Sliding Image Section */}
      <div className="relative bg-green-50 rounded-xl p-6 shadow-sm">
        <h3 className="text-gray-700 text-sm font-medium">Previous Day Price</h3>
        <span className="text-xs text-gray-500">
          {new Date(Date.now() - 86400000).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>

        {/* Image */}
        <div className="relative h-48 mt-4">
          <img
            src={images[index].src}
            alt={images[index].name}
            className="w-full h-full object-contain rounded-lg transform transition-transform duration-300 hover:scale-105"
          />

          {/* Slide Buttons */}
          <button
            onClick={prevImage}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-all"
          >
            <FaArrowLeft className="text-gray-700" />
          </button>
          <button
            onClick={nextImage}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-all"
          >
            <FaArrowRight className="text-gray-700" />
          </button>

          {/* Name Tag */}
          <div className="absolute top-3 right-3 bg-[#112b1c] text-white text-xs px-3 py-1 rounded-full shadow-md">
            {images[index].name}
          </div>

          {/* Price Tag */}
          <div className="absolute bottom-3 left-3 bg-[#112b1c] text-white text-xs px-3 py-1 rounded-full shadow-md">
            {images[index].price}
          </div>
        </div>
      </div>

      {/* Dots for Image Navigation */}
      <div className="flex justify-center mt-6 space-x-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === index ? "bg-[#112b1c]" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </Card>
  );
};

export default PriceComparison;