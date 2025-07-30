import React, { useEffect, useState } from "react";

const Faq = () => {
  const [faq, setfaq] = useState([]);

  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    const fetchfaq = async () => {
      const res = await fetch("/Faq.json");
      const data = await res.json();
      setfaq(data);
    };
    fetchfaq();
  }, []);

  return (
    <div className="max-w-7xl mx-auto my-30">
      <div className="space-y-3 mb-10">
        <h1 className="text-center text-4xl text-[#03373D] font-extrabold">
          Frequently Asked Question (FAQ)
        </h1>
        <p className="text-center text-[#606060] text-base">
          Enhance posture, mobility, and well-being effortlessly with Posture
          Pro. Achieve proper alignment, reduce pain, and strengthen your body
          with ease!
        </p>
      </div>
      <div className="space-y-4">
        {faq.map((item, index) => {
          const isOpen = selectedIndex === index;

          return (
            <div
              key={index}
              className={`border border-base-300 rounded transition-all duration-300 ${
                isOpen ? "bg-[#E6F2F3] text-black" : "bg-base-100"
              }`}
            >
              <button
                className="w-full text-left px-4 py-3 font-semibold flex justify-between items-center"
                onClick={() => setSelectedIndex(isOpen ? null : index)}
              >
                <span>{item.question}</span>
                <svg
                  className={`w-4 h-4 transform transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isOpen && <div className="px-4 pb-4 text-sm">{item.answer}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Faq;
