import { useState } from "react";
import useAxiosSecure from "./UseAxiosSecure";




const useTrackingUpdater = () => {
  const axiosInstance = useAxiosSecure();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const addTrackingUpdate = async ({ tracking_id, status, location, updated_by }) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axiosInstance.post("/trackings", {
        tracking_id,
        status,
        location,
        updated_by,
      });

      if (res.data.insertedId) {
        setSuccess("Tracking update added successfully.");
      } else {
        setError("Failed to add tracking update.");
      }
    } catch (err) {
      console.error("Tracking update error:", err);
      setError("An error occurred while updating tracking.");
    } finally {
      setLoading(false);
    }
  };

  return {
    addTrackingUpdate,
    loading,
    error,
    success,
  };
};

export default useTrackingUpdater;
