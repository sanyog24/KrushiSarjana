import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Upload } from "lucide-react";
import { addProduct } from "../api/product"; // API function for MongoDB
import axios from "axios"; // For blockchain API calls
import ImageClassifier from "../components/ui/ImageClassify";

const categories = {
  Farmer: ["Vegetables", "Fruits", "Grains", "Cereals"],
  Retailer: ["Seeds", "Pesticides", "Equipments"],
};

export default function UploadProduct() {
  const { register, handleSubmit, watch, reset, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const sellerType = watch("sellerType", "Farmer");
  const [imagePreview, setImagePreview] = useState(null);

  // Blockchain state
  const [chain, setChain] = useState([]);

  // Fetch blockchain on component mount
  useEffect(() => {
    fetchBlockchain();
  }, []);

  const fetchBlockchain = async () => {
    try {
      const response = await axios.get("http://localhost:5003/chain");
      setChain(response.data.slice(1)); // Remove genesis block
    } catch (error) {
      console.error("Error fetching blockchain:", error);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Step 1: Upload to MongoDB
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key !== "image") {
          formData.append(key, data[key]);
        }
      });

      if (data.image && data.image[0]) {
        formData.append("productImage", data.image[0]);
      }

      // Debugging: Log FormData contents
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const mongoResult = await addProduct(formData);
      toast.success(mongoResult.message || "Product uploaded to MongoDB successfully!");

      // Step 2: Submit to Blockchain
      const blockchainData = {
        name: data.name,
        sellerType: data.sellerType,
        category: data.category,
        price: data.price,
        stock: data.stock,
        unit: data.unit,
        description: data.description,
        image: imagePreview || "https://via.placeholder.com/150", // Use image preview or placeholder
      };

      const blockchainResponse = await axios.post("http://localhost:5003/add-product", blockchainData);
      toast.success(blockchainResponse.data.message || "Product added to blockchain successfully!");

      // Step 3: Reset form and fetch updated blockchain
      reset();
      setImagePreview(null);
      fetchBlockchain(); // Fetch updated blockchain
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error(error.message || "Failed to upload product");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected File:", file); // Debugging
      setImagePreview(URL.createObjectURL(file));
      setValue("image", event.target.files);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto my-10 p-8 bg-white shadow-xl rounded-3xl border border-gray-200"
    >
      <h2 className="text-4xl font-bold text-gray-800 text-center mb-10">
        Upload Product
      </h2>
   
<form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="grid grid-cols-2 gap-6">
<div className="space-y-6">

  <ImageClassifier/>
  <div>
    <label className="block text-gray-600 font-medium">Product Name</label>
    <input
      {...register("name", { required: true })}
      className="w-full px-4 py-3 mt-2 border rounded-xl focus:ring focus:ring-indigo-300"
      placeholder="Enter product name"
    />
  </div>
  <div>
    <label className="block text-gray-600 font-medium">Seller Type</label>
    <select
      {...register("sellerType")}
      className="w-full px-4 py-3 mt-2 border rounded-xl focus:ring focus:ring-indigo-300"
    >
      <option value="Farmer">Farmer</option>
      <option value="Retailer">Retailer</option>
    </select>
  </div>
  <div>
    <label className="block text-gray-600 font-medium">Category</label>
    <select
      {...register("category", { required: true })}
      className="w-full px-4 py-3 mt-2 border rounded-xl focus:ring focus:ring-indigo-300"
    >
      {categories[sellerType]?.map((cat) => (
        <option key={cat} value={cat}>{cat}</option>
      ))}
    </select>
  </div>
</div>

<div className="space-y-6">
  <div>
    <label className="block text-gray-600 font-medium">Price</label>
    <input
      type="number"
      {...register("price", { required: true })}
      className="w-full px-4 py-3 mt-2 border rounded-xl focus:ring focus:ring-indigo-300"
      placeholder="Enter price"
    />
  </div>
  <div>
    <label className="block text-gray-600 font-medium">Stock</label>
    <input
      type="number"
      {...register("stock", { required: true })}
      className="w-full px-4 py-3 mt-2 border rounded-xl focus:ring focus:ring-indigo-300"
      placeholder="Enter stock quantity"
    />
  </div>
  <div>
    <label className="block text-gray-600 font-medium">Unit</label>
    <select
      {...register("unit", { required: true })}
      className="w-full px-4 py-3 mt-2 border rounded-xl focus:ring focus:ring-indigo-300"
    >
      {["Kg", "Litre", "Grams", "Piece", "Dozen", "Quintals"].map((unit) => (
        <option key={unit} value={unit}>{unit}</option>
      ))}
    </select>
  </div>
</div>

<div className="col-span-2">
  <label className="block text-gray-600 font-medium">Description</label>
  <textarea
    {...register("description")}
    className="w-full px-4 py-3 mt-2 border rounded-xl focus:ring focus:ring-indigo-300"
    placeholder="Enter product description"
  ></textarea>
</div>
<div className="col-span-2">
  <label className="block text-gray-600 font-medium">Product Image</label>
  <div
    className="w-full px-6 py-10 border-2 border-dashed border-indigo-400 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50"
    onClick={() => fileInputRef.current?.click()}
  >
    {imagePreview ? (
      <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-md" />
    ) : (
      <Upload className="w-12 h-12 text-indigo-500" />
    )}
    <p className="text-gray-500 mt-2">Click to upload</p>
  </div>
  <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
</div>

<motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={loading} className="col-span-2 w-full py-4 text-white bg-indigo-600 rounded-xl">
  {loading ? "Uploading..." : "Upload Product"}
</motion.button>
</form>

     
    </motion.div>
  );
}