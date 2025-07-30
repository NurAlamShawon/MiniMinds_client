import React, { useEffect, useState } from "react";
import { Link } from "react-router";

const SecondSection = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetch("/Second.json")
      .then((res) => res.json())
      .then((data) => setCards(data))
      .catch((err) => console.error("Failed to load data:", err));
  }, []);

  return (
    <div className="bg-[url('https://i.postimg.cc/W4W9Qj9G/bg.png')] xl:h-120 bg-center my-20 xl:px-0 px-4">
      <div className="max-w-7xl mx-auto py-5">
        <h1 className="text-3xl font-bold text-balance text-center mb-8">
          Back to School
        </h1>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl shadow-lg bg-gradient-to-r ${card.bg} text-center`}
            >
              {card.img && (
                <img
                  src={card.img}
                  alt={card.title}
                  className="mx-auto mb-4 w-20 h-20 object-contain"
                />
              )}
              <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
              <p className="text-gray-700 mb-4">{card.description}</p>
              <Link to={`${card.path}`}>
                <h3 className="text-blue-600 font-semibold cursor-pointer hover:underline">
                  {card.linkText}
                </h3>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecondSection;
