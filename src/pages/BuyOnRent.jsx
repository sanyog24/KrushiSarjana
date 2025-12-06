import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.js";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
    };

    fetchProducts();
  }, []);

  // Toggle In Stock status when returning product
  const handleReturnRequest = async (id) => {
    const productRef = doc(db, "products", id);
    await updateDoc(productRef, { inStock: true });

    // Update state
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, inStock: true } : product
      )
    );
  };

  // Mark product as Out of Stock when bought
  const handleBuyProduct = async (id, inStock) => {
    if (!inStock) return; // Prevent buying already out-of-stock items

    const productRef = doc(db, "products", id);
    await updateDoc(productRef, { inStock: false });

    // Update state
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, inStock: false } : product
      )
    );
  };

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-green-800">
          Available Equipment
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-green-200"
            >
              {/* Display Image if Available */}
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.equipmentName}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-4">
                <h3 className="text-xl font-semibold text-green-800">
                  {product.equipmentName}
                </h3>
                <p className="text-gray-600 mt-1">Owner: {product.ownerName}</p>
                <p className="text-gray-800 font-bold mt-2">
                ₹{product.pricePerHour} / hour
                </p>
                <p
                  className={`mt-2 text-sm font-semibold ${
                    product.inStock ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </p>

                {/* Buy Button - Only available when product is in stock */}
                {product.inStock && (
                  <button
                    className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    onClick={() => handleBuyProduct(product.id, product.inStock)}
                  >
                    Buy Product
                  </button>
                )}

                {/* Request Return Button - Only available when product is out of stock */}
                {!product.inStock && (
                  <button
                    className="mt-4 w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                    onClick={() => handleReturnRequest(product.id)}
                  >
                    Return Equipment
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;