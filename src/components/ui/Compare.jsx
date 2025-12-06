import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { getAllProductsByName } from "../../api/product.js";
import { getFarmerById } from "../../api/farmer.js";
import AddToCart from "./AddToCart.jsx";

function Compare({ name, onClose }) {
  const [farmerProducts, setFarmerProducts] = useState([]);
  const [sellerDetails, setSellerDetails] = useState({});
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProductsAndFarmers = async () => {
      try {
        const products = await getAllProductsByName(name);
        setFarmerProducts(products);

        if (!products || products.length === 0) return;

        const uniqueSellerIds = [
          ...new Set(products.map((product) => product.seller).filter(Boolean)),
        ];

        const farmerDataPromises = uniqueSellerIds.map(async (sellerId) => {
          try {
            const farmerData = await getFarmerById(sellerId);
            return { [sellerId]: farmerData.farmer || null };
          } catch (error) {
            return { [sellerId]: null };
          }
        });

        const farmersDataArray = await Promise.all(farmerDataPromises);
        setSellerDetails(Object.assign({}, ...farmersDataArray));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProductsAndFarmers();
  }, [name]);

  const handleAddToCart = (product) => {
    setSelectedProduct(product);
    setShowCartPopup(true);
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 border-2 border-black relative">
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
            onClick={onClose}
          >
            <FaTimes size={20} />
          </button>

          <h3 className="text-2xl font-semibold text-center mb-4">
            Compare Prices
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Farmer</th>
                  <th className="p-2">Price (₹)</th>
                  <th className="p-2">Location</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {farmerProducts.length > 0 ? (
                  farmerProducts.map((product, index) => {
                    const farmer = sellerDetails[product.seller] || {};
                    return (
                      <tr key={index} className="border-b">
                        <td className="p-2">{farmer.name || "Unknown"}</td>
                        <td className="p-2">₹{product.price}</td>
                        <td className="p-2">{farmer.contact?.address?.city || "Unknown"}</td>
                        <td className="p-2">{product.description}</td>
                        <td className="p-2">
                          <button
                            className="bg-blue-600 text-white py-1 px-3 rounded-lg"
                            onClick={() => handleAddToCart(product)}
                          >
                            Add to Cart
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center p-4 text-gray-500">
                      No similar products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showCartPopup && selectedProduct && (
          <AddToCart
            id={selectedProduct._id}
            name={selectedProduct.name}
            price={selectedProduct.price}
            image={selectedProduct.image}
            category={selectedProduct.category}
            description={selectedProduct.description}
            sellerId={selectedProduct.seller}
            sellerName={sellerDetails[selectedProduct.seller]?.name || "Unknown"}
            sellerRole={selectedProduct.sellerType}
            onClose={() => setShowCartPopup(false)}
          />
        )}
      </div>
    </>
  );
}

export default Compare;
