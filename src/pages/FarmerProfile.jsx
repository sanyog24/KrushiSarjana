"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Upload, MapPin } from "lucide-react";
import { getFarmerDetails, upsertFarmerProfile } from "../api/farmer.js"; // API functions
// import { db } from "../../../backend/firebase"; // Import Firestore instance
// import { doc, setDoc } from "firebase/firestore";

export default function FarmerProfile() {
  const { register, handleSubmit, setValue } = useForm();
  const [profileImage, setProfileImage] = useState(
    "https://example.com/default-profile.png"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [location, setLocation] = useState(""); // State to store location
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;


    // const saveUserLocation = async (userId) => {
    //   if (!navigator.geolocation) {
    //     alert("Geolocation is not supported by your browser");
    //     return;
    //   }
    
    //   navigator.geolocation.getCurrentPosition(
    //     async (position) => {
    //       const { latitude, longitude } = position.coords;
    //       try {
    //         await setDoc(doc(db, "users", userId), { latitude, longitude }, { merge: true });
    //         alert("Location saved successfully!");
    //       } catch (error) {
    //         console.error("Error saving location: ", error);
    //       }
    //     },
    //     (error) => alert("Error fetching location: " + error.message)
    //   );
    // };

  // Fetch farmer profile on mount
  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const response = await getFarmerDetails(token);
        console.log("Fetched Farmer Profile:", response);

        if (response && response.farmer) {
          const farmer = response.farmer; // Extract farmer object
          setValue("name", farmer.name || "");
          setValue("phone", farmer.contact?.phone || "");
          setValue("email", farmer.contact?.email || "");
          setValue("street", farmer.address?.street || "");
          setValue("city", farmer.address?.city || "");
          setValue("state", farmer.address?.state || "");
          setValue("pincode", farmer.address?.pincode || "");
          setValue("country", farmer.address?.country || "");
          setProfileImage(farmer.profileUrl || profileImage);
          setLocation(farmer.address?.location || ""); // Set location if available
        }
      } catch (err) {
        console.error("Error fetching farmer profile:", err.message);
        setError(err.message || "Failed to fetch profile.");
      }
    };

    fetchProfile();
  }, [setValue, token]);

  // Handle Form Submission
  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("phone", data.phone);
      formData.append("email", data.email);
      formData.append("street", data.street);
      formData.append("city", data.city);
      formData.append("state", data.state);
      formData.append("pincode", data.pincode);
      formData.append("country", data.country);
      formData.append("location", location); // Include location in form data

      const updatedProfile = await upsertFarmerProfile(formData, token);

      if (updatedProfile && updatedProfile.farmer) {
        const farmer = updatedProfile.farmer;
        setValue("name", farmer.name || "");
        setValue("phone", farmer.contact?.phone || "");
        setValue("email", farmer.contact?.email || "");
        setValue("street", farmer.address?.street || "");
        setValue("city", farmer.address?.city || "");
        setValue("state", farmer.address?.state || "");
        setValue("pincode", farmer.address?.pincode || "");
        setValue("country", farmer.address?.country || "");
        setProfileImage(farmer.profileUrl || profileImage);
        setLocation(farmer.address?.location || ""); // Update location
      }

      alert("Profile updated successfully!");
    } catch (err) {
      setError(err.message || "Profile update failed.");
    }

    setLoading(false);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result); // Preview image
      reader.readAsDataURL(file);
    }
  };

  // Fetch User's Current Location
  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude}, ${longitude}`); // Set location as latitude and longitude
        },
        (error) => {
          console.error("Error fetching location:", error);
          setError("Failed to fetch location. Please enter manually.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
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

          {/* Location */}
          {/* <div className="grid gap-4">
            <label className="text-lg font-semibold text-green-700">Location</label>
            <div className="flex gap-4">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your location"
                className="input-field flex-1"
              />
              <button
                type="button"
                onClick={fetchLocation}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <MapPin className="w-5 h-5" />
                Use Current Location
              </button>
            </div>
          </div> */}

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