import React, { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import { ValueContext } from "../Context/ValueContext";
import UseAxiosSecure from "../Hooks/UseAxiosSecure";

const Myclasses = () => {
  const axiosInstance = UseAxiosSecure();
  const { currentuser } = useContext(ValueContext);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentGems, setCurrentGems] = useState(0);
  const [lessons, setLessons] = useState([]);
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [selectedVideoLink, setSelectedVideoLink] = useState("");
  const [selectedSubpartName, setSelectedSubpartName] = useState("");
  const [selectedSubpartIndex, setSelectedSubpartIndex] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizAttempts, setQuizAttempts] = useState({});

  // fetch user
  useEffect(() => {
    if (!currentuser?.email) return;
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(`/users?email=${currentuser.email}`);
        if (res.data && res.data.length > 0) {
          const user = res.data[0];
          setCurrentUserId(user._id);
          setCurrentGems(Number(user.gems || 0));
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchUser();
  }, [currentuser, axiosInstance]);

  // fetch lessons + attempt state
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
            } catch {
              attempts[lesson._id] = false;
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

  // helper to set current subpart
  const handleSubpartClick = (link, name, idx) => {
    setSelectedVideoLink(getYouTubeEmbedUrl(link));
    setSelectedSubpartName(name);
    setSelectedSubpartIndex(idx);
    setShowQuiz(false);
    setQuizAnswers({});
  };

  // Next/Prev navigation
  const goNext = () => {
    if (expandedLesson === null || selectedSubpartIndex === null) return;
    const parts = lessons[expandedLesson]?.parts || [];
    const nextIdx = selectedSubpartIndex + 1;
    if (nextIdx < parts.length) {
      handleSubpartClick(parts[nextIdx].link, parts[nextIdx].name, nextIdx);
    }
  };

  const goPrev = () => {
    if (expandedLesson === null || selectedSubpartIndex === null) return;
    const prevIdx = selectedSubpartIndex - 1;
    if (prevIdx >= 0) {
      const parts = lessons[expandedLesson]?.parts || [];
      handleSubpartClick(parts[prevIdx].link, parts[prevIdx].name, prevIdx);
    }
  };

  const handleOptionChange = (qIdx, option) => {
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: option }));
  };

  const awardGems = async (award) => {
    if (award <= 0) return;
    try {
      const newTotal = currentGems + award;
      await axiosInstance.patch(`/users/gems/${currentuser.email}`, { gems: newTotal });
      setCurrentGems(newTotal);
    } catch (err) {
      console.error("Failed to award gems", err);
    }
  };

  const submitQuiz = async () => {
    if (!currentUserId || expandedLesson === null) return;
    const quiz = lessons[expandedLesson].quiz;
    if (!quiz || quiz.length === 0) return;

    const correctCount = quiz.reduce(
      (count, q, idx) => count + (quizAnswers[idx] === q.correctAnswer ? 1 : 0),
      0
    );

    // save results
    try {
      await axiosInstance.post("/quiz-results", {
        userId: currentUserId,
        quizId: lessons[expandedLesson]._id,
        score: correctCount,
        total: quiz.length,
      });
      setQuizAttempts((prev) => ({
        ...prev,
        [lessons[expandedLesson]._id]: true,
      }));
    } catch (err) {
      console.error("Failed to save quiz result", err);
    }

    // award
    let award = 0;
    if (correctCount === quiz.length) award = 2;
    else if (correctCount === quiz.length - 1) award = 1;

    if (correctCount === quiz.length) {
      // 🎉 fun animated backdrop for perfect score
      await Swal.fire({
        title: "🎉 Amazing! Perfect Score!",
        html: `<b>You earned 2 gems 💎💎</b>`,
        width: 600,
        padding: "2em",
        color: "#2563eb",
        background: "#fff url('/images/confetti-bg.png')",
        backdrop: `
          rgba(0,0,123,0.4)
          url("/images/nyan-cat.gif")
          left top
          no-repeat
        `,
        timer: 3000,
        showConfirmButton: false,
      });
    } else {
      await Swal.fire({
        title: "Quiz Submitted!",
        text:
          award === 1
            ? `You scored ${correctCount}/${quiz.length}. Great job—earned 1 gem! 💎`
            : `You scored ${correctCount}/${quiz.length}. Keep practicing!`,
        icon: award === 1 ? "success" : "info",
        confirmButtonColor: "#22c55e",
      });
    }

    await awardGems(award);
    setShowQuiz(false);
    setQuizAnswers({});
  };

  return (
    <div className="flex xl:my-10 flex-col lg:flex-row gap-4 p-4">
      {/* LEFT: video/quiz viewer */}
      <div className="flex-1 bg-base-200 rounded-lg p-4 shadow-md flex flex-col">
        {showQuiz ? (
          <h2 className="text-2xl font-bold mb-4 text-center text-indigo-600">
            📝 Quiz Time
          </h2>
        ) : (
          selectedSubpartName && (
            <h2 className="text-xl font-bold mb-2 text-blue-600">
              📺 {selectedSubpartName}
            </h2>
          )
        )}

        {showQuiz ? (
          <form className="overflow-auto max-h-[calc(100vh-8rem)] space-y-4">
            {lessons[expandedLesson]?.quiz.map((q, idx) => (
              <div
                key={idx}
                className="card bg-white shadow hover:shadow-lg transition transform hover:scale-[1.01] p-4"
              >
                <p className="font-semibold mb-2">
                  Q{idx + 1}. {q.question}
                </p>
                {["optionA", "optionB", "optionC", "optionD"].map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-blue-50"
                  >
                    <input
                      type="radio"
                      name={`question_${idx}`}
                      value={opt.slice(-1).toUpperCase()}
                      checked={quizAnswers[idx] === opt.slice(-1).toUpperCase()}
                      onChange={() =>
                        handleOptionChange(idx, opt.slice(-1).toUpperCase())
                      }
                      className="radio radio-primary"
                    />
                    {q[opt]}
                  </label>
                ))}
              </div>
            ))}
            <button
              type="button"
              onClick={submitQuiz}
              className="btn btn-primary w-full text-lg mt-2"
            >
              Submit Quiz 🚀
            </button>
          </form>
        ) : selectedVideoLink ? (
          <>
            <iframe
              src={selectedVideoLink}
              title="Lesson Video"
              allowFullScreen
              className="flex-grow w-full rounded-lg shadow"
              style={{ minHeight: "360px" }}
            />
            {/* Next / Prev buttons – same logic, nicer style */}
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={goPrev}
                disabled={selectedSubpartIndex === 0 || selectedSubpartIndex === null}
                className="btn btn-outline btn-accent"
              >
                ⬅ Previous
              </button>
              <button
                onClick={goNext}
                disabled={
                  expandedLesson === null ||
                  selectedSubpartIndex === null ||
                  selectedSubpartIndex === (lessons[expandedLesson]?.parts.length ?? 0) - 1
                }
                className="btn btn-outline btn-success"
              >
                Next ➡
              </button>
            </div>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center text-gray-500">
            Select a lesson video or quiz
          </div>
        )}
      </div>

      {/* RIGHT: lesson list */}
      <div className="w-full lg:w-96 bg-base-100 rounded-lg shadow-md overflow-auto p-4">
        <h2 className="text-xl font-bold mb-4 text-indigo-700">📚 Lessons</h2>
        {lessons.map((lesson, idx) => (
          <div
            key={lesson._id || idx}
            className="collapse collapse-arrow bg-base-200 mb-3 rounded-lg"
          >
            <input
              type="checkbox"
              checked={expandedLesson === idx}
              onChange={() =>
                setExpandedLesson(expandedLesson === idx ? null : idx)
              }
            />
            <div className="collapse-title font-semibold flex justify-between">
              {lesson.lessonHeading}
              {quizAttempts[lesson._id] && (
                <span className="badge badge-success">✔ Done</span>
              )}
            </div>
            <div className="collapse-content space-y-2">
              {lesson.parts.map((part, pIdx) => (
                <button
                  key={pIdx}
                  className="btn btn-sm btn-outline w-full justify-start"
                  onClick={() => handleSubpartClick(part.link, part.name, pIdx)}
                >
                  ▶ {part.name}
                </button>
              ))}
              <button
                className={`btn btn-secondary w-full mt-2 ${
                  quizAttempts[lesson._id] ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={quizAttempts[lesson._id]}
                onClick={() => {
                  setShowQuiz(true);
                  setSelectedVideoLink("");
                  setSelectedSubpartName("");
                  setSelectedSubpartIndex(null);
                }}
              >
                {quizAttempts[lesson._id] ? "Quiz Attempted" : "Take Quiz"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Myclasses;
