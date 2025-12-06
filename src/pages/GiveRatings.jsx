import { useState, useEffect } from "react";
import { getProductById, addReview } from "../api/product"; // Import API functions

export default function GiveRatings({ userId, productId, userName }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState(""); // ✅ Store review comment
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false); // ✅ Prevent duplicate submissions

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(productId);
        setProduct(productData);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleSubmit = async () => {
    if (submitting) return; // ✅ Prevent multiple submissions

    if (rating === 0 || !comment.trim()) {
      setMessage("Please provide a rating and a review.");
      return;
    }

    // const token = localStorage.getItem("userToken");
    // if (!token) {
    //   setMessage("You must be logged in to submit a review.");
    //   return;
    // }

    try {
      setSubmitting(true);
      setMessage("");

      const reviewData = { rating, comment };
      await addReview(productId, reviewData); // ✅ Submit review

      setMessage("Review submitted successfully!");
      setRating(0);
      setComment("");

      // ✅ Fetch updated reviews dynamically
      const updatedProduct = await getProductById(productId);
      setProduct(updatedProduct);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-md shadow-md">
      <h3 className="text-md font-semibold">Give Your Ratings for {product?.name}</h3>
      {message && <p className={`text-sm ${message.includes("success") ? "text-green-500" : "text-red-500"}`}>{message}</p>}

      <div className="flex gap-2 my-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`text-xl transition-all duration-200 ${rating >= star ? "text-yellow-500" : "text-gray-400"}`}
            onClick={() => setRating(star)}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        className="w-full p-2 border rounded-md text-sm"
        placeholder="Write a review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={submitting}
      />

      <button
        className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg disabled:bg-gray-400"
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>

      {/* Display existing reviews */}
      <div className="mt-4">
        <h4 className="text-md font-semibold">Reviews</h4>
        {product?.reviews?.length > 0 ? (
          product.reviews.map((r, index) => (
            <div key={index} className="p-2 bg-white border rounded-md mt-2">
              <p className="font-semibold">
                {r.userName} ({r.rating} ★)
              </p>
              <p className="text-sm">{r.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}
