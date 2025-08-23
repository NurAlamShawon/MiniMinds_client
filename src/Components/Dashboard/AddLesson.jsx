import React, { useMemo, useState } from "react";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";


// ---- helpers ----
const makeEmptyQuiz = () => ({
  question: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  correctAnswer: "",
});

const initialParts = [
  { name: "", link: "" },
  { name: "", link: "" },
  { name: "", link: "" },
];

export default function AddLesson() {
  const axiosInstance = UseAxiosSecure();
  const [lessonHeading, setLessonHeading] = useState("");
  const [parts, setParts] = useState([...initialParts]);
  const [quiz, setQuiz] = useState(Array.from({ length: 5 }, () => makeEmptyQuiz()));
  const [loading, setLoading] = useState(false);

  const stats = useMemo(
    () => ({ partsCount: parts.length, quizCount: quiz.length }),
    [parts.length, quiz.length]
  );

  // ---- parts handlers ----
  const handlePartChange = (index, field, value) => {
    setParts((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addPart = () => setParts((prev) => [...prev, { name: "", link: "" }]);

  const removePart = async (index) => {
    const res = await Swal.fire({
      title: "Remove this part?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
    });
    if (res.isConfirmed) {
      setParts((prev) => prev.filter((_, i) => i !== index));
      Swal.fire({
        title: "Removed",
        text: "The part has been removed.",
        icon: "success",
        confirmButtonColor: "#22c55e",
      });
    }
  };

  // ---- quiz handlers ----
  const handleQuizChange = (index, field, value) => {
    setQuiz((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addQuiz = () => setQuiz((prev) => [...prev, makeEmptyQuiz()]);

  const removeQuiz = async (index) => {
    const res = await Swal.fire({
      title: "Remove this question?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
    });
    if (res.isConfirmed) {
      setQuiz((prev) => prev.filter((_, i) => i !== index));
      Swal.fire({
        title: "Removed",
        text: "The question has been removed.",
        icon: "success",
        confirmButtonColor: "#22c55e",
      });
    }
  };

  const clearForm = async () => {
    const res = await Swal.fire({
      title: "Clear all fields?",
      text: "You’ll lose current inputs.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, clear",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
    });
    if (res.isConfirmed) {
      setLessonHeading("");
      setParts([...initialParts]);
      setQuiz(Array.from({ length: 5 }, () => makeEmptyQuiz()));
      Swal.fire({
        title: "Cleared",
        text: "Form reset successfully.",
        icon: "success",
        confirmButtonColor: "#22c55e",
      });
    }
  };

  // ---- submit ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    const lessonData = { lessonHeading, parts, quiz };

    try {
      setLoading(true);
      await axiosInstance.post("/lessons", lessonData);

      // reset
      setLessonHeading("");
      setParts([...initialParts]);
      setQuiz(Array.from({ length: 5 }, () => makeEmptyQuiz()));

      await Swal.fire({
        title: "✅ Success!",
        text: "Lesson saved successfully!",
        icon: "success",
        confirmButtonColor: "#22c55e",
        confirmButtonText: "OK",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "❌ Error",
        text: "Failed to save lesson. Please try again.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* header */}
      <div className="sticky top-0 z-30 backdrop-blur bg-base-100/80 border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Create Lesson</h1>
            <p className="text-sm opacity-70">Class 3 • Math</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="badge badge-primary gap-1">Parts {stats.partsCount}</div>
            <div className="badge badge-secondary gap-1">Quiz {stats.quizCount}</div>
          </div>
        </div>
      </div>

      {/* form */}
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
        {/* Lesson Heading */}
        <div className="card bg-base-100 shadow">
          <div className="card-body gap-4">
            <h2 className="card-title">Lesson Details</h2>

            <label className="form-control w-full">
              <span className="label-text font-medium mb-1">Lesson Heading</span>
              <input
                type="text"
                className="input input-bordered"
                placeholder="Enter lesson heading"
                value={lessonHeading}
                onChange={(e) => setLessonHeading(e.target.value)}
                required
              />
            </label>
          </div>
        </div>

        {/* Parts Section */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <h2 className="card-title">Lesson Parts</h2>
              <button
                type="button"
                onClick={addPart}
                className="btn btn-outline btn-primary btn-sm"
              >
                + Add Part
              </button>
            </div>

            <div className="mt-2 space-y-3">
              {parts.map((part, index) => (
                <div key={index} className="collapse collapse-arrow bg-base-200">
                  <input type="checkbox" defaultChecked />
                  <div className="collapse-title text-base font-medium flex items-center gap-2">
                    <span className="kbd kbd-sm">{index + 1}</span>
                    <span>{part.name || `Part ${index + 1}`}</span>
                  </div>

                  <div className="collapse-content">
                    <div className="grid md:grid-cols-2 gap-4">
                      <label className="form-control">
                        <span className="label-text mb-1">Part Name</span>
                        <input
                          type="text"
                          className="input input-bordered"
                          placeholder={`Enter part ${index + 1} name`}
                          value={part.name}
                          onChange={(e) =>
                            handlePartChange(index, "name", e.target.value)
                          }
                          required
                        />
                      </label>

                      <label className="form-control">
                        <span className="label-text mb-1">Video Link</span>
                        <input
                          type="url"
                          className="input input-bordered"
                          placeholder="Enter video link (https://...)"
                          value={part.link}
                          onChange={(e) =>
                            handlePartChange(index, "link", e.target.value)
                          }
                          required
                        />
                      </label>
                    </div>

                    <div className="mt-3 flex justify-between">
                      <div className="opacity-60 text-sm">
                        Tip: keep videos under 5–8 minutes.
                      </div>
                      <button
                        type="button"
                        className="btn btn-ghost btn-error btn-sm"
                        onClick={() => removePart(index)}
                        disabled={parts.length <= 1}
                        title="Remove this part"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quiz Section */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <h2 className="card-title">Quiz Questions</h2>
              <button
                type="button"
                onClick={addQuiz}
                className="btn btn-outline btn-secondary btn-sm"
              >
                + Add Quiz
              </button>
            </div>

            <div className="mt-2 space-y-3">
              {quiz.map((q, index) => (
                <div key={index} className="collapse collapse-arrow bg-base-200">
                  <input type="checkbox" />
                  <div className="collapse-title text-base font-medium flex items-center gap-2">
                    <span className="badge badge-secondary">Q{index + 1}</span>
                    <span className="truncate">
                      {q.question || "Untitled question"}
                    </span>
                  </div>

                  <div className="collapse-content">
                    <label className="form-control">
                      <span className="label-text mb-1">Question</span>
                      <input
                        type="text"
                        className="input input-bordered"
                        placeholder="Enter question"
                        value={q.question}
                        onChange={(e) =>
                          handleQuizChange(index, "question", e.target.value)
                        }
                        required
                      />
                    </label>

                    <div className="grid md:grid-cols-2 gap-3 mt-3">
                      {["A", "B", "C", "D"].map((opt) => (
                        <label key={opt} className="form-control">
                          <span className="label-text mb-1">Option {opt}</span>
                          <input
                            type="text"
                            className="input input-bordered"
                            placeholder={`Option ${opt}`}
                            value={q[`option${opt}`]}
                            onChange={(e) =>
                              handleQuizChange(index, `option${opt}`, e.target.value)
                            }
                            required
                          />
                        </label>
                      ))}
                    </div>

                    <div className="mt-3 grid md:grid-cols-2 gap-3">
                      <label className="form-control">
                        <span className="label-text mb-1">Correct Answer</span>
                        <select
                          className="select select-bordered"
                          value={q.correctAnswer}
                          onChange={(e) =>
                            handleQuizChange(index, "correctAnswer", e.target.value)
                          }
                          required
                        >
                          <option value="">Select correct option</option>
                          <option value="A">Option A</option>
                          <option value="B">Option B</option>
                          <option value="C">Option C</option>
                          <option value="D">Option D</option>
                        </select>
                      </label>

                      <div className="form-control justify-end">
                        <button
                          type="button"
                          className="btn btn-ghost btn-error"
                          onClick={() => removeQuiz(index)}
                          disabled={quiz.length <= 1}
                        >
                          Remove Question
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Action bar */}
        <div className="sticky bottom-0 z-30">
          <div className="max-w-5xl mx-auto p-3">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body py-3 flex flex-col md:flex-row md:items-center gap-3 justify-between">
                <div className="text-sm opacity-80">
                  <span className="font-semibold">Review</span>:{" "}
                  {lessonHeading || "(No title)"} • {stats.partsCount} parts •{" "}
                  {stats.quizCount} questions
                </div>
                <div className="flex gap-2">
                  <button type="button" className="btn btn-outline" onClick={clearForm}>
                    Clear
                  </button>
                  <button
                    type="submit"
                    className={`btn btn-success ${loading ? "loading" : ""}`}
                    disabled={loading}
                  >
                    {loading ? "Saving" : "Save Lesson"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
