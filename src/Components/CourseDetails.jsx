import React, { useEffect, useState } from 'react';
import Useaxios from '../Hooks/Useaxios';

const CourseDetails = () => {
  const axiosInstance = Useaxios();
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await axiosInstance.get('/lessons');
        setLessons(res.data);
      } catch (err) {
        console.error('Failed to fetch lessons', err);
      }
    };

    fetchLessons();
  }, [axiosInstance]);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">Course Lessons</h2>
      <div className="grid grid-cols-1  gap-4">
        {lessons.map((lesson) => (
          <div
            key={lesson._id}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold mb-2">{lesson.lessonHeading}</h3>
            <p className="text-gray-600">
              Subparts: {lesson.parts?.length || 0}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseDetails;
