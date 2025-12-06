"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { getRetailerProfile, editRetailerProfile } from "../api/retailer.js";

export default function RetailerProfile() {
  const { register, handleSubmit, setValue } = useForm();
  const [profileImage, setProfileImage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const DEFAULT_PROFILE_IMAGE = "/default-profile.png"; // Update with actual path

  // Fetch retailer profile on mount
  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        console.log("Fetching retailer profile... 🔄");
        const retailer = await getRetailerProfile(token);
        console.log("Retailer Data Extracted ✅:", retailer);

        if (!retailer || typeof retailer !== "object") {
          console.error("Invalid API response ❌", retailer);
          return;
        }

        // Populate form fields
        setValue("name", retailer.name || "");
        setValue("phone", retailer.contact?.phone || "");
        setValue("email", retailer.contact?.email || "");
        setValue("shopName", retailer.shopName || "");
        setValue("shopDescription", retailer.shopDescription || "");
        setValue("street", retailer.address?.street || "");
        setValue("city", retailer.address?.city || "");
        setValue("state", retailer.address?.state || "");
        setValue("pincode", retailer.address?.pincode || "");
        setValue("country", retailer.address?.country || "");

        setProfileImage(retailer.profileUrl || DEFAULT_PROFILE_IMAGE);
      } catch (err) {
        console.error("Error fetching profile ❌:", err);
        setError("Failed to fetch profile.");
      }
    };

    fetchProfile();
  }, [token]); // Only runs when `token` changes

  // Handle Image Selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result); // Preview image
      reader.readAsDataURL(file);
    }
  };

  // Handle Form Submission
  const onSubmit = async (formData) => {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("phone", formData.phone);
    data.append("email", formData.email);
    data.append("shopName", formData.shopName);
    data.append("shopDescription", formData.shopDescription);
    data.append("street", formData.street);
    data.append("city", formData.city);
    data.append("state", formData.state);
    data.append("pincode", formData.pincode);
    data.append("country", formData.country);

    // Append selected profile image (if new one is chosen)
    if (selectedImage) {
      data.append("profileImage", selectedImage);
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/retailers/profile", {
        method: "POST", // Ensures updating existing data
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data, // FormData (no manual Content-Type)
      });

      const result = await response.json();
      console.log("Server Response:", result);

      if (response.ok) {
        alert("Profile updated successfully! ✅");
      } else {
        throw new Error(result.message || "Failed to update profile ❌");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="flex justify-center items-center min-h-screen bg-green-50 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl p-8 border border-green-300">
        <h2 className="text-3xl font-bold text-green-700 text-center mb-6">
          Edit Profile
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center space-y-3">
            <div className="relative w-32 h-32">
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full rounded-full border-4 border-green-500 object-cover shadow-md"
              />
              <label
                htmlFor="profileImage"
                className="absolute bottom-2 right-2 bg-green-600 p-2 rounded-full cursor-pointer hover:bg-green-700 transition"
              >
                <Upload className="text-white w-6 h-6" />
              </label>
            </div>
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* Personal Details */}
          <div className="grid gap-4">
            <label className="text-lg font-semibold text-green-700">Personal Details</label>
            <div className="grid grid-cols-2 gap-4">
              <input {...register("name")} placeholder="Full Name" className="input-field" />
              <input {...register("phone")} placeholder="Phone Number" className="input-field" />
            </div>
            <input {...register("email")} placeholder="Email Address" className="input-field" />
          </div>

          {/* Address */}
          <div className="grid gap-4">
            <label className="text-lg font-semibold text-green-700">Address</label>
            <input {...register("street")} placeholder="Street" className="input-field" />
            <div className="grid grid-cols-2 gap-4">
              <input {...register("city")} placeholder="City" className="input-field" />
              <input {...register("state")} placeholder="State" className="input-field" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input {...register("pincode")} placeholder="Pincode" className="input-field" />
              <input {...register("country")} placeholder="Country" className="input-field" />
            </div>
          </div>

          {/* Shop Details */}
          <div className="grid gap-4">
            <label className="text-lg font-semibold text-green-700">Shop Details</label>
            <input {...register("shopName")} placeholder="Shop Name" className="input-field" />
            <input {...register("shopDescription")} placeholder="Shop Description" className="input-field" />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
