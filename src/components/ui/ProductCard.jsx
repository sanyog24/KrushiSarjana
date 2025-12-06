import React, { useState } from "react";
import { FaShoppingCart, FaTimes, FaExchangeAlt, FaStar } from "react-icons/fa";
import AddToCart from "./AddToCart";

const ProductCard = ({id, name, price, category, description, image, onCompare, sellerId, sellerName, sellerRole }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [deliveryType, setDeliveryType] = useState("logistic");

  // Dummy retailer data for comparison with varied prices
  const [retailerProducts] = useState([
    { name: "Retailer A", price: price - Math.floor(Math.random() * 10), store: "Store A", description: "High-quality organic product." },
    { name: "Retailer B", price: price - Math.floor(Math.random() * 5), store: "Store B", description: "Eco-friendly and effective." },
    { name: "Retailer C", price: price + Math.floor(Math.random() * 7), store: "Store C", description: "Fast-acting and reliable." },
    { name: "Retailer D", price: price - Math.floor(Math.random() * 8), store: "Store D", description: "Trusted by professionals." },
  ]);

  const handleCompareClick = () => {
    setShowCompare(true);
  };

  const handleAddToCart = () => {
    setShowCartPopup(true);
  };

  const calculateSubtotal = () => {
    const basePrice = price * quantity;
    const deliveryCharge = deliveryType === "logistic" ? 50 : 0; // Delivery charge only for logistic
    return basePrice + deliveryCharge;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border hover:shadow-xl transition w-full flex flex-col items-center">
      <div className="w-24 h-24 bg-gray-300 rounded-full mb-4">
        {image && <img src={image} alt={name} className="w-full h-full rounded-full object-cover" />}
      </div>
      <h3 className="text-lg font-semibold text-center">{name}</h3>
      <p className="text-center text-xl font-bold">₹{price}</p>
      <button
        className="w-40 bg-[#112b1c] text-white py-2 px-4 mt-3 flex items-center justify-center gap-2 rounded-lg"
        onClick={() => setShowDetails(true)}
      >
        Purchase <FaShoppingCart />
      </button>

      {/* Purchase Details Pop-up */}
      {showDetails && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 border-2 border-black relative">
            <button className="absolute top-2 right-2 text-gray-600 hover:text-red-500" onClick={() => setShowDetails(false)}>
              <FaTimes size={20} />
            </button>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Image Section */}
              <div className="w-full md:w-1/3">
                <div className="w-48 h-48 bg-gray-300 rounded-lg mx-auto overflow-hidden">
                  {image && <img src={image} alt={name} className="w-full h-full object-cover" />}
                </div>
              </div>
              {/* Details Section */}
              <div className="w-full md:w-2/3">
                <h3 className="text-2xl font-semibold">{name}</h3>
                <p className="text-lg text-gray-700 font-semibold">₹{price}</p>
                <p className="text-sm text-gray-500 italic">{category}</p>
                <p className="text-gray-600 mt-3">{description}</p>
                <div className="mt-4">
                  <label className="block text-gray-700">Available Quantity:</label>
                  <p className="text-gray-700 font-semibold">50 units</p> {/* Dummy available quantity */}
                </div>
                <div className="mt-4">
                  <label className="block text-gray-700">Product Reviews:</label>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400" />
                    ))}
                    <span className="text-gray-600 ml-2">(25 reviews)</span> {/* Dummy reviews */}
                  </div>
                </div>
                <button
                  className="w-full bg-[#112b1c] text-white py-2 mt-5 flex items-center justify-center gap-2 rounded-lg"
                  onClick={handleAddToCart}
                >
                  Add To Cart <FaShoppingCart />
                </button>
                <button
                  className="w-full bg-gray-700 text-white py-2 mt-3 flex items-center justify-center gap-2 rounded-lg"
                  onClick={handleCompareClick}
                >
                  Compare <FaExchangeAlt />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compare Prices Pop-up */}
      {showCompare && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 border-2 border-black relative">
            <button className="absolute top-2 right-2 text-gray-600 hover:text-red-500" onClick={() => setShowCompare(false)}>
              <FaTimes size={20} />
            </button>
            <h3 className="text-2xl font-semibold text-center mb-4">Compare Prices</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="p-2">Store</th>
                    <th className="p-2">Price (₹)</th>
                    <th className="p-2">Description</th>
                    <th className="p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {retailerProducts.map((product, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{product.store}</td>
                      <td className="p-2">₹{product.price}</td>
                      <td className="p-2">{product.description}</td>
                      <td className="p-2">
                        <button
                          className="bg-blue-600 text-white py-1 px-3 rounded-lg"
                          onClick={() => {
                            setShowCompare(false);
                            setShowCartPopup(true);
                          }}
                        >
                          Add to Cart
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add to Cart Pop-up */}
      {showCartPopup && (
        // <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/50">
        //   <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 border-2 border-black relative">
        //     <button className="absolute top-2 right-2 text-gray-600 hover:text-red-500" onClick={() => setShowCartPopup(false)}>
        //       <FaTimes size={20} />
        //     </button>
        //     <div className="flex flex-col md:flex-row gap-6">
        //       <div className="w-full md:w-1/3">
        //         <div className="w-48 h-48 bg-gray-300 rounded-lg mx-auto overflow-hidden">
        //           {image && <img src={image} alt={name} className="w-full h-full object-cover" />}
        //         </div>
        //       </div>
        //       <div className="w-full md:w-2/3">
        //         <h3 className="text-2xl font-semibold">{name}</h3>
        //         <p className="text-lg text-gray-700 font-semibold">₹{price}</p>
        //         <p className="text-sm text-gray-500 italic">{category}</p>
        //         <p className="text-gray-600 mt-3">{description}</p>
        //         <div className="mt-4">
        //           <label className="block text-gray-700">Quantity:</label>
        //           <input
        //             type="number"
        //             value={quantity}
        //             onChange={(e) => setQuantity(Math.max(1, e.target.value))}
        //             className="w-20 p-2 border rounded-lg"
        //           />
        //         </div>
        //         <div className="mt-4">
        //           <label className="block text-gray-700">Delivery Type:</label>
        //           <select
        //             value={deliveryType}
        //             onChange={(e) => setDeliveryType(e.target.value)}
        //             className="w-full p-2 border rounded-lg"
        //           >
        //             <option value="logistic">Logistic Partner</option>
        //             <option value="self">Self Pickup</option>
        //           </select>
        //         </div>
        //         {deliveryType === "logistic" && (
        //           <>
                    
        //             <div className="mt-4">
        //               <p className="text-gray-700">Distance: <span className="font-semibold">5 km</span></p>
        //             </div>
        //           </>
        //         )}
        //         <div className="mt-6">
        //           <p className="text-xl font-bold">Subtotal: ₹{calculateSubtotal()}</p>
        //         </div>
        //         <button className="w-full bg-[#112b1c] text-white py-2 mt-5 flex items-center justify-center gap-2 rounded-lg">
        //           Pay Now
        //         </button>
        //       </div>
        //     </div>
        //   </div>
        // </div>
        <AddToCart
        id={id}
        name={name}
        price={price}
        image={image}
        category={category}
        description={description}
        sellerId={sellerId}
        sellerName={sellerName}
        sellerRole={sellerRole}
        onClose={() => setShowCartPopup(false)} />
      )}
    </div>
  );
};

export default ProductCard;