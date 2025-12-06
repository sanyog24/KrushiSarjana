import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.js";
import axios from "axios";

const ProductEntry = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    ownerName: "",
    equipmentName: "",
    pricePerHour: "",
    inStock: true,
    imageUrl: "",// Store image URL
    myCoin:0 
  });

  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state for form submission

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]); // Store selected image file
  };

  // Upload image to Cloudinary
  const uploadImage = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "krushi"); // Replace with Cloudinary preset

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dlil6t6m4/image/upload",
        formData
      );
      return response.data.secure_url; // Return uploaded image URL
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      const imageUrl = await uploadImage(); // Upload and get image URL

      const newProduct = {
        ...formData,
        imageUrl: imageUrl || "", // Store image URL in Firestore
      };

      const docRef = await addDoc(collection(db, "products"), newProduct);
      setProducts([...products, { id: docRef.id, ...newProduct }]);

      // Reset form
      setFormData({
        ownerName: "",
        equipmentName: "",
        pricePerHour: "",
        inStock: true,
        imageUrl: "",
      });
      setImageFile(null);
    } catch (error) {
      console.error("Error adding product:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Remove product
  const handleRemove = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id)); // Delete document from Firestore
      setProducts(products.filter((product) => product.id !== id)); // Update state
      alert("Equipment removed successfully!");
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-green-800">
          Rent the Equipments
        </h2>

        {/* Add Product Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-green-200">
          <h3 className="text-xl font-semibold mb-4 text-green-700">
            Add New Equipment
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-green-700">
                Owner Name
              </label>
              <input
                type="text"
                name="ownerName"
                placeholder="Enter owner name"
                value={formData.ownerName}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-green-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-green-700">
                Equipment Name
              </label>
              <input
                type="text"
                name="equipmentName"
                placeholder="Enter equipment name"
                value={formData.equipmentName}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-green-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-green-700">
                Price Per Hour
              </label>
              <input
                type="number"
                name="pricePerHour"
                placeholder="Enter price per hour"
                value={formData.pricePerHour}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-green-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 border-green-300 rounded focus:ring-green-500"
              />
              <label className="ml-2 text-sm text-green-700">In Stock</label>
            </div>

            <div>
              <label className="block text-sm font-medium text-green-700">
                Equipment Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-green-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              {isLoading ? "Adding..." : "Add Equipment"}
            </button>
          </form>
        </div>

        {/* Product List */}
        <h3 className="text-2xl font-bold mb-6 text-green-800">Your Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-green-200"
            >
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
                <button
                  onClick={() => handleRemove(product.id)}
                  className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Remove Equipment
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductEntry;