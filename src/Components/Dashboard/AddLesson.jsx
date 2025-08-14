import React, { useState } from "react";
import Useaxios from "../../Hooks/Useaxios";



const AddLesson = () => {
  const axiosInstance = Useaxios();
  const [lessonHeading, setLessonHeading] = useState("");
  const [parts, setParts] = useState([
    { name: "", link: "" },
    { name: "", link: "" },
    { name: "", link: "" },
  ]);
  const [quiz, setQuiz] = useState(
    Array(5).fill({
      question: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "",
    })
  );
  const [loading, setLoading] = useState(false);

  // Lesson name
  const handleLessonChange = (e) => {
    setLessonHeading(e.target.value);
  };

  // Lesson parts
  const handlePartChange = (index, field, value) => {
    const updatedParts = [...parts];
    updatedParts[index][field] = value;
    setParts(updatedParts);
  };

  const addPart = () => {
    setParts([...parts, { name: "", link: "" }]);
  };

  // Quiz changes
  const handleQuizChange = (index, field, value) => {
    const updatedQuiz = [...quiz];
    updatedQuiz[index] = { ...updatedQuiz[index], [field]: value };
    setQuiz(updatedQuiz);
  };

  // Save lesson
  const handleSubmit = async (e) => {
    e.preventDefault();
    const lessonData = { lessonHeading, parts, quiz };

    try {
      setLoading(true);
      const res = await axiosInstance.post("/lessons", lessonData);
      console.log("Lesson saved:", res.data);

      // Reset form
      setLessonHeading("");
      setParts([
        { name: "", link: "" },
        { name: "", link: "" },
        { name: "", link: "" },
      ]);
      setQuiz(
        Array(5).fill({
          question: "",
          optionA: "",
          optionB: "",
          optionC: "",
          optionD: "",
          correctAnswer: "",
        })
      );

      alert("Lesson saved successfully!");
    } catch (err) {
      console.error("Error saving lesson:", err);
      alert("Failed to save lesson");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add Lesson</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Lesson Heading */}
        <div>
          <label className="block font-medium mb-1">Lesson Heading</label>
          <input
            type="text"
            value={lessonHeading}
            onChange={handleLessonChange}
            placeholder="Enter lesson heading (e.g., Addition)"
            className="w-full border rounded p-2"
            required
          />
        </div>

        {/* Parts */}
        {parts.map((part, index) => (
          <div
            key={index}
            className="border p-4 rounded-md bg-gray-50 space-y-2"
          >
            <label className="block font-medium">
              Part {index + 1} Name
            </label>
            <input
              type="text"
              value={part.name}
              onChange={(e) =>
                handlePartChange(index, "name", e.target.value)
              }
              placeholder={`Enter part ${index + 1} name`}
              className="w-full border rounded p-2"
              required
            />

            <label className="block font-medium">Video Link</label>
            <input
              type="url"
              value={part.link}
              onChange={(e) =>
                handlePartChange(index, "link", e.target.value)
              }
              placeholder="Enter video link"
              className="w-full border rounded p-2"
              required
            />
          </div>
        ))}

        {/* Add More Button */}
        <button
          type="button"
          onClick={addPart}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Add More
        </button>

        {/* Quiz Section */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Quiz (5 Questions)</h3>
          {quiz.map((q, index) => (
            <div
              key={index}
              className="border p-4 rounded-md bg-yellow-50 space-y-2 mb-4"
            >
              <label className="block font-medium">
                Question {index + 1}
              </label>
              <input
                type="text"
                value={q.question}
                onChange={(e) =>
                  handleQuizChange(index, "question", e.target.value)
                }
                placeholder="Enter question"
                className="w-full border rounded p-2"
                required
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={q.optionA}
                  onChange={(e) =>
                    handleQuizChange(index, "optionA", e.target.value)
                  }
                  placeholder="Option A"
                  className="border rounded p-2"
                  required
                />
                <input
                  type="text"
                  value={q.optionB}
                  onChange={(e) =>
                    handleQuizChange(index, "optionB", e.target.value)
                  }
                  placeholder="Option B"
                  className="border rounded p-2"
                  required
                />
                <input
                  type="text"
                  value={q.optionC}
                  onChange={(e) =>
                    handleQuizChange(index, "optionC", e.target.value)
                  }
                  placeholder="Option C"
                  className="border rounded p-2"
                  required
                />
                <input
                  type="text"
                  value={q.optionD}
                  onChange={(e) =>
                    handleQuizChange(index, "optionD", e.target.value)
                  }
                  placeholder="Option D"
                  className="border rounded p-2"
                  required
                />
              </div>

              <label className="block font-medium mt-2">Correct Answer</label>
              <select
                value={q.correctAnswer}
                onChange={(e) =>
                  handleQuizChange(index, "correctAnswer", e.target.value)
                }
                className="w-full border rounded p-2"
                required
              >
                <option value="">Select correct option</option>
                <option value="A">Option A</option>
                <option value="B">Option B</option>
                <option value="C">Option C</option>
                <option value="D">Option D</option>
              </select>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Lesson"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLesson;
