import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../Hooks/UseAxiosSecure";

const Standings = () => {
  const axiosInstance = UseAxiosSecure();
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [standings, setStandings] = useState([]);

  // Fetch all lessons
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await axiosInstance.get("/lessons");
        setLessons(res.data);
      } catch (err) {
        console.error("Failed to fetch lessons", err);
      }
    };
    fetchLessons();
  }, [axiosInstance]);

  // Fetch standings when a lesson is selected
  useEffect(() => {
    if (!selectedLesson) return;

    const fetchStandings = async () => {
      try {
      
        const res = await axiosInstance.get(`/standings/${selectedLesson._id}`);
        setStandings(res.data);
      } catch (err) {
        console.error("Failed to fetch standings", err);
      }
    };

    fetchStandings();
  }, [selectedLesson, axiosInstance]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">Quiz Standings</h2>

      {/* Lesson buttons */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {lessons.map((lesson) => (
          <button
            key={lesson._id}
            onClick={() => setSelectedLesson(lesson)}
            className={`px-4 py-2 rounded btn  text-white transition-colors duration-500 transform ${
              selectedLesson?._id === lesson._id
                ? "bg-blue-600 "
                : "bg-green-600 "
            }`}
          >
            {lesson.lessonHeading}
          </button>
        ))}
      </div>

      {/* Standings Table */}
      {selectedLesson && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Rank</th>
                <th className="py-2 px-4 text-left">User</th>
                <th className="py-2 px-4 text-left">Score</th>
                <th className="py-2 px-4 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {standings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    No attempts yet
                  </td>
                </tr>
              ) : (
                standings.map((item, idx) => (
                  <tr
                    key={item._id}
                    className={idx === 0 ? "bg-yellow-100 font-bold" : ""}
                  >
                    <td className="py-2 px-4">{idx + 1}</td>
                    <td className="py-2 px-4">{item.userInfo.name}</td>
                    <td className="py-2 px-4">{item.score}</td>
                    <td className="py-2 px-4">{item.total}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Standings;
