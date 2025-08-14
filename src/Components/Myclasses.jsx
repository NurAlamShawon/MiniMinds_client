import React, { useEffect, useState, useContext } from "react";
import Useaxios from "../Hooks/Useaxios";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { ValueContext } from "../Context/ValueContext"; 

const Myclasses = () => {
  const axiosInstance = Useaxios();
  const { currentuser } = useContext(ValueContext);

  const [currentUserId, setCurrentUserId] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [expandedSubparts, setExpandedSubparts] = useState({});
  const [selectedVideoLink, setSelectedVideoLink] = useState("");
  const [selectedSubpartName, setSelectedSubpartName] = useState("");
  const [selectedSubpartIndex, setSelectedSubpartIndex] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizAttempts, setQuizAttempts] = useState({});

  // Fetch authenticated user's _id from /users
  useEffect(() => {
    if (!currentuser?.email) return;

    const fetchUserId = async () => {
      try {
        const res = await axiosInstance.get(`/users?email=${currentuser.email}`);
        if (res.data && res.data.length > 0) {
          setCurrentUserId(res.data[0]._id);
        }
      } catch (err) {
        console.error("Failed to fetch user ID", err);
      }
    };

    fetchUserId();
  }, [currentuser, axiosInstance]);

  // Fetch lessons and quiz attempts
  useEffect(() => {
    if (!currentUserId) return;

    const fetchLessons = async () => {
      try {
        const res = await axiosInstance.get("/lessons");
        setLessons(res.data);

        const attempts = {};
        await Promise.all(
          res.data.map(async (lesson) => {
            try {
              const result = await axiosInstance.get(
                `/quiz-results/${currentUserId}/${lesson._id}`
              );
              attempts[lesson._id] = result.data.attempted;
            } catch (err) {
              attempts[lesson._id] = false;
              console.log(err)
            }
          })
        );
        setQuizAttempts(attempts);
      } catch (err) {
        console.error("Failed to fetch lessons", err);
      }
    };

    fetchLessons();
  }, [axiosInstance, currentUserId]);

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    const regExp = /^.*(youtu\.be\/|v\/|watch\?v=|watch\?.+&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2] ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  const toggleLesson = (index) => {
    if (expandedLesson === index) {
      setExpandedLesson(null);
      setExpandedSubparts({});
      setSelectedVideoLink("");
      setSelectedSubpartName("");
      setSelectedSubpartIndex(null);
      setShowQuiz(false);
      setQuizAnswers({});
    } else {
      setExpandedLesson(index);
      setExpandedSubparts({});
      setSelectedVideoLink("");
      setSelectedSubpartName("");
      setSelectedSubpartIndex(null);
      setShowQuiz(false);
      setQuizAnswers({});
    }
  };

  const toggleSubparts = (index) => {
    setExpandedSubparts((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleSubpartClick = (link, name, idx) => {
    setSelectedVideoLink(getYouTubeEmbedUrl(link));
    setSelectedSubpartName(name);
    setSelectedSubpartIndex(idx);
    setShowQuiz(false);
    setQuizAnswers({});
  };

  const goNext = () => {
    if (expandedLesson === null || selectedSubpartIndex === null) return;
    const parts = lessons[expandedLesson]?.parts || [];
    if (selectedSubpartIndex + 1 < parts.length) {
      handleSubpartClick(parts[selectedSubpartIndex + 1].link, parts[selectedSubpartIndex + 1].name, selectedSubpartIndex + 1);
    }
  };

  const goPrev = () => {
    if (expandedLesson === null || selectedSubpartIndex === null) return;
    if (selectedSubpartIndex - 1 >= 0) {
      const parts = lessons[expandedLesson]?.parts || [];
      handleSubpartClick(parts[selectedSubpartIndex - 1].link, parts[selectedSubpartIndex - 1].name, selectedSubpartIndex - 1);
    }
  };

  const handleOptionChange = (qIdx, option) => {
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: option }));
  };

  const submitQuiz = async () => {
    if (!currentUserId) return alert("User not loaded yet.");
    if (expandedLesson === null) return alert("Please select a lesson first.");

    const quiz = lessons[expandedLesson].quiz;
    if (!quiz || quiz.length === 0) return alert("No quiz questions available.");

    const correctCount = quiz.reduce((count, q, idx) => count + (quizAnswers[idx] === q.correctAnswer ? 1 : 0), 0);

    Swal.fire({
      title: "Quiz Submitted!",
      text: `You scored ${correctCount} out of ${quiz.length}`,
      icon: "success",
      showClass: { popup: "animate__animated animate__fadeInUp animate__faster" },
      hideClass: { popup: "animate__animated animate__fadeOutDown animate__faster" }
    });

    try {
      await axiosInstance.post("/quiz-results", {
        userId: currentUserId,
        quizId: lessons[expandedLesson]._id,
        score: correctCount,
        total: quiz.length,
      });

      setQuizAttempts((prev) => ({ ...prev, [lessons[expandedLesson]._id]: true }));
    } catch (error) {
      console.error("Failed to save quiz result", error);
      alert("Failed to save quiz result");
    }

    setShowQuiz(false);
    setQuizAnswers({});
  };

  return (
    <div className="flex flex-col lg:flex-row h-full max-h-[calc(100vh-4rem)] gap-4 p-4">
      {/* Left side */}
      <div className="flex-1 bg-gray-100 rounded-lg p-4 shadow-md flex flex-col overflow-auto">
        {showQuiz ? (
          <h2 className="text-xl font-semibold mb-4">
            Quiz: {expandedLesson !== null ? lessons[expandedLesson].lessonHeading : ""}
          </h2>
        ) : (
          selectedSubpartName && <h2 className="text-xl font-semibold mb-2">{selectedSubpartName}</h2>
        )}

        {showQuiz ? (
          <form className="overflow-auto max-h-[calc(100vh-8rem)]">
            {expandedLesson !== null && lessons[expandedLesson].quiz.length > 0 ? (
              lessons[expandedLesson].quiz.map((q, idx) => (
                <div key={idx} className="mb-4 p-2 border rounded bg-white shadow-sm">
                  <p className="font-semibold">Q{idx + 1}. {q.question}</p>
                  {["optionA", "optionB", "optionC", "optionD"].map((opt) => (
                    <label key={opt} className="block cursor-pointer mt-1">
                      <input
                        type="radio"
                        name={`question_${idx}`}
                        value={opt.charAt(opt.length - 1).toUpperCase()}
                        checked={quizAnswers[idx] === opt.charAt(opt.length - 1).toUpperCase()}
                        onChange={() => handleOptionChange(idx, opt.charAt(opt.length - 1).toUpperCase())}
                        className="mr-2"
                      />
                      {q[opt]}
                    </label>
                  ))}
                </div>
              ))
            ) : <p>No quiz available</p>}

            <button type="button" onClick={submitQuiz} className="btn btn-primary w-full">Submit</button>
          </form>
        ) : selectedVideoLink ? (
          <iframe src={selectedVideoLink} title="Lesson Video" allowFullScreen className="flex-grow w-full rounded" style={{ minHeight: "360px" }} frameBorder="0" />
        ) : (
          <div className="flex-grow flex items-center justify-center text-gray-500">
            Select a lesson video or quiz to display
          </div>
        )}

        {!showQuiz && (
          <div className="mt-4 flex justify-center gap-4">
            <button onClick={goPrev} disabled={selectedSubpartIndex === 0 || selectedSubpartIndex === null} className="btn btn-primary">Previous</button>
            <button onClick={goNext} disabled={expandedLesson === null || selectedSubpartIndex === null || selectedSubpartIndex === lessons[expandedLesson]?.parts.length - 1} className="btn btn-primary">Next</button>
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="w-full lg:w-96 bg-white rounded-lg shadow-md overflow-auto max-h-full p-4">
        <h2 className="text-xl font-semibold mb-4">Lessons</h2>
        {lessons.map((lesson, lessonIdx) => (
          <div key={lesson._id || lessonIdx} className="border rounded mb-4">
            <button onClick={() => toggleLesson(lessonIdx)} className="w-full flex justify-between items-center px-4 py-3 bg-blue-50 hover:bg-blue-100">
              <span>{lesson.lessonHeading}</span>
              <span>{expandedLesson === lessonIdx ? "−" : "+"}</span>
            </button>

            {expandedLesson === lessonIdx && (
              <div className="p-4 bg-gray-50">
                <button onClick={() => toggleSubparts(lessonIdx)} className="w-full flex justify-between items-center mb-2 px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">
                  <span>Sub Parts</span>
                  <span>{expandedSubparts[lessonIdx] ? "−" : "+"}</span>
                </button>

                {expandedSubparts[lessonIdx] &&
                  (lesson.parts.length === 0 ? (
                    <p className="text-gray-500 px-2">No sub parts</p>
                  ) : (
                    <ul className="list-disc list-inside mb-4 max-h-40 overflow-y-auto">
                      {lesson.parts.map((part, partIdx) => (
                        <li key={partIdx} className="cursor-pointer text-blue-700 hover:underline" onClick={() => handleSubpartClick(part.link, part.name, partIdx)}>
                          {part.name}
                        </li>
                      ))}
                    </ul>
                  ))}

                <button
                  onClick={() => {
                    setShowQuiz(true);
                    setSelectedVideoLink("");
                    setSelectedSubpartName("");
                    setSelectedSubpartIndex(null);
                  }}
                  disabled={quizAttempts[lesson._id]}
                  className={`btn btn-secondary w-full ${quizAttempts[lesson._id] ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {quizAttempts[lesson._id] ? "Quiz Attempted" : "Take Quiz"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Myclasses;
