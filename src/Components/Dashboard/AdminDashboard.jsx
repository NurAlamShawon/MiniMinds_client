import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const axiosInstance = UseAxiosSecure();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/admin/overview");
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
  }, [axiosInstance]);

  if (!stats) {
    return <span className="loading loading-infinity loading-3xl mx-auto mt-20"></span>;
  }

  return (
    <div className="px-4 py-8">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">
        📦 Admin Dashboard Overview
      </h2>
      <p className="text-center text-gray-500 mb-10 max-w-xl mx-auto">
        Real-time insights into student progress, learning activities, and
        engagement.
      </p>

      <div className="grid grid-cols-1  lg:grid-cols-3 gap-6">
        {/* Total Lesson's */}
        <div className="stats shadow bg-green-600 text-white hover:shadow-lg transition duration-300 ease-in-out cursor-pointer">
          <div className="stat">
            <div className="stat-figure text-white">
              {/* Check Circle Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2l4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="stat-title text-white/80">Total Lesson's</div>
            <div className="stat-value">{stats.totalLesson}</div>
          </div>
        </div>
        {/* Total Admin's */}
        <div className="stats shadow bg-gray-600 text-white hover:shadow-lg transition duration-300 ease-in-out cursor-pointer">
          <div className="stat">
            <div className="stat-figure text-white">
              {/* Check Circle Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2l4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="stat-title text-white/80">Total Admin's</div>
            <div className="stat-value">{stats.totalAdmin}</div>
          </div>
        </div>

        {/* Total Users */}
        <div className="stats shadow bg-cyan-600 text-white hover:shadow-lg transition duration-300 ease-in-out cursor-pointer">
          <div className="stat">
            <div className="stat-figure text-white">
              {/* Users Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M12 12a4 4 0 100-8 4 4 0 000 8zm6 8H6"
                />
              </svg>
            </div>
            <div className="stat-title text-white/80">Total Users</div>
            <div className="stat-value">{stats.totalUsers}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
