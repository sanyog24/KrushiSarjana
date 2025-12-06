import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RetailerProductCard from "./RetailerProductCard";


const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([
    { name: "Organic Fertilizer", price: "500", quantity: "5", unit: "Kg", category: "Pesticides", details: "Natural fertilizer for better yield." },
  ]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate()

  const handleAddProduct = (newProduct) => {
    setProducts([...products, newProduct]);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts(products.map((p) => (p.name === updatedProduct.name ? updatedProduct : p)));
    setIsEditing(false);
  };

  const handleDeleteProduct = (productName) => {
    const updatedProducts = products.filter((p) => p.name !== productName);
    setProducts(updatedProducts);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 h-screen bg-[#112b1c] text-white p-4">
        <h1 className="text-lg font-bold">KrishiSarjana</h1>
        <button
          className="w-full bg-white text-[#112b1c] py-2 mt-4 rounded-lg"
          onClick={() => {
            setEditingProduct(null);
            setIsEditing(false);
            setShowForm(true);
            navigate("/dashboard/upload-product")
          }}
        >
          + Add Product
        </button>
      </aside>

      {/* Product List */}
      <div className="flex-1 p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <RetailerProductCard key={index} product={product} onEdit={handleEditProduct} onDelete={handleDeleteProduct} />
          ))}
        </div>
      </div>

      {/* Product Form Popup */}
      {/* {showForm && (
        <AddProductForm
          onClose={() => setShowForm(false)}
          onAddProduct={handleAddProduct}
          existingProduct={editingProduct}
          isEditing={isEditing}
          onUpdateProduct={handleUpdateProduct}
        />
      )} */}
    </div>
  );
};

export default Dashboard;