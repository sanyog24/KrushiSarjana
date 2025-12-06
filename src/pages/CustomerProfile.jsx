
"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { upsertCustomer, getCustomerDetails } from "../api/customer.js";

export default function RetailerProfile() {
  const { register, handleSubmit, setValue, reset } = useForm();
  const [profileImage, setProfileImage] = useState("https://example.com/default-profile.png");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    console.log("Stored Token:", storedToken);
    if (!storedToken) return;
  
    const fetchProfile = async () => {
      try {
        const data = await getCustomerDetails(storedToken);
        console.log("Fetched customer data:", data);
        if (data?.customer) {
          reset({
            name: data.customer.name || "",
            phone: data.customer.contact?.phone || "",
            email: data.customer.contact?.email || "",
            street: data.customer.address?.street || "",
            city: data.customer.address?.city || "",
            state: data.customer.address?.state || "",
            pincode: data.customer.address?.pincode || "",
            country: data.customer.address?.country || "",
          });
  
          // Set profile image only if profileUrl exists and is not empty
          if (data.customer.profileUrl) {
            setProfileImage(data.customer.profileUrl);
          }
        }
      } catch (err) {
        console.error("Error fetching profile:", err.message);
        setError("Failed to fetch profile.");
      }
    };
  
    fetchProfile();
  }, [reset]);
  
  useEffect(() => {
    console.log("Profile Image updated:", profileImage);
  }, [profileImage]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      setValue("profileImage", file);
      console.log("Image selected:", file.name);
      setTimeout(() => URL.revokeObjectURL(imageUrl), 1000);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      console.log("Submitting data:", data);
      const formData = new FormData();
      if (data.profileImage instanceof File) {
        formData.append("profileImage", data.profileImage);
      } else {
        formData.append("profileImage", profileImage);
      }

      formData.append("name", data.name);
      formData.append("contact_phone", data.phone);
      formData.append("contact_email", data.email);
      formData.append("address_street", data.street);
      formData.append("address_city", data.city);
      formData.append("address_state", data.state);
      formData.append("address_pincode", data.pincode);
      formData.append("address_country", data.country);

      const updatedProfile = await upsertCustomer(localStorage.getItem("token"), formData);
      console.log("Updated profile response:", updatedProfile);
      reset({
        name: updatedProfile.customer.name || "",
        phone: updatedProfile.customer.contact?.phone || "",
        email: updatedProfile.customer.contact?.email || "",
        street: updatedProfile.customer.address?.street || "",
        city: updatedProfile.customer.address?.city || "",
        state: updatedProfile.customer.address?.state || "",
        pincode: updatedProfile.customer.address?.pincode || "",
        country: updatedProfile.customer.address?.country || "",
      });

      setProfileImage(updatedProfile.customer.profileUrl);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update error:", err);
      setError("Profile update failed.");
    }

    setLoading(false);
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
            <input type="file" id="profileImage" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>

          <div className="grid gap-4">
            <label className="text-lg font-semibold text-green-700">Personal Details</label>
            <div className="grid grid-cols-2 gap-4">
              <input id="name" {...register("name")} placeholder="Full Name" required className="input-field" />
              <input id="phone" {...register("phone")} placeholder="Phone Number" required className="input-field" />
            </div>
            <input id="email" {...register("email")} placeholder="Email Address" required className="input-field" />
          </div>
          
          <div className="grid gap-4">
            <label className="text-lg font-semibold text-green-700">Address</label>
            <input {...register("street")} placeholder="Street" required className="input-field" />
            <div className="grid grid-cols-2 gap-4">
              <input {...register("city")} placeholder="City" required className="input-field" />
              <input {...register("state")} placeholder="State" required className="input-field" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input {...register("pincode")} placeholder="Pincode" required className="input-field" />
              <input {...register("country")} placeholder="Country" required className="input-field" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition">
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
