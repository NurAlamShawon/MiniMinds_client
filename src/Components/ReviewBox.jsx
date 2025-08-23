import React, { useState, useEffect } from "react";
import Useaxios from "../Hooks/Useaxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const ReviewBox = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    message: "",
  });

  const axiosInstance = Useaxios();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [charCount, setCharCount] = useState(0);
  const maxChars = 300;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "message" && value.length > maxChars) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "message") setCharCount(value.length);
  };

  // Mutation to submit a review
  const { mutate: submitReview } = useMutation({
    mutationFn: async (payload) => {
      // Expecting 201 Created; handle as success anyway
      return axiosInstance.post("/review", payload);
    },
    onSuccess: () => {
      // Clear form
      setFormData({ name: "", email: "", title: "", message: "" });
      setCharCount(0);
      setSuccessMessage("Thanks for your review!");

      // 🔄 Trigger Review component to refetch instantly
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: () => {
      setErrorMessage("Something went wrong. Try again later.");
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    submitReview(formData);
  };

  // Auto-hide toast messages after 5 seconds
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  return (
    <>
      {(successMessage || errorMessage) && (
        <div className="toast toast-center toast-top z-50 pointer-events-none">
          <div
            className={`alert shadow-lg pointer-events-auto ${
              successMessage ? "alert-success" : "alert-error"
            }`}
          >
            <div>
              {successMessage ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current flex-shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current flex-shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
              <span>{successMessage || errorMessage}</span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto mt-8 p-6 rounded-lg shadow-2xl bg-base-100">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary">
          Leave a Review
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="input input-bordered w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
            disabled={loading}
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email (optional)"
            value={formData.email}
            onChange={handleChange}
            className="input input-bordered w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            disabled={loading}
          />
          <input
            type="text"
            name="title"
            placeholder="Your Title (e.g. Parent, Teacher)"
            value={formData.title}
            onChange={handleChange}
            className="input input-bordered w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            disabled={loading}
          />
          <textarea
            name="message"
            placeholder="Your Review"
            value={formData.message}
            onChange={handleChange}
            className="textarea textarea-bordered w-full resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows="5"
            required
            disabled={loading}
          ></textarea>
          <div className="text-right text-sm text-gray-500">
            {charCount}/{maxChars} characters
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ReviewBox;
