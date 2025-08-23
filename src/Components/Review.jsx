import React, { useState, useMemo } from "react";
import Useaxios from "../Hooks/Useaxios";
import { useQuery } from "@tanstack/react-query";

const CARD_WIDTH = 350;
const GAP = 16;

const Review = () => {
  const axiosInstance = Useaxios();
  const [current, setCurrent] = useState(0);

  const {
    data: testimonials = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const res = await axiosInstance.get("/review");
      // Expecting an array
      return Array.isArray(res.data) ? res.data : [];
    },
    staleTime: 30_000,
  });

  const total = testimonials.length;

  const prevTestimonial = () => {
    if (!total) return;
    setCurrent((prev) => (prev - 1 + total) % total);
  };

  const nextTestimonial = () => {
    if (!total) return;
    setCurrent((prev) => (prev + 1) % total);
  };

  const getVisibleCards = useMemo(() => {
    if (!total) return [];
    const visible = [];
    for (let offset = -2; offset <= 2; offset++) {
      const index = (current + offset + total) % total;
      visible.push({
        ...testimonials[index],
        relative: offset,
        key: `${index}-${offset}`,
      });
    }
    return visible;
  }, [current, testimonials, total]);

  return (
    <div className="px-2 xl:mx-0">
      <div className="space-y-5 max-w-3xl mx-auto text-center">
        <img
          src="https://i.postimg.cc/d3GHLfFD/image.png"
          alt="Live Tracking"
          className="mx-auto w-90"
        />
        <h1 className="text-[#03373D] text-3xl font-extrabold">
          What our Parents are saying
        </h1>
        <p className="text-[#606060] text-base">
          Make learning math fun, engaging, and effective—aligned with the NCTB
          curriculum to build strong foundations with confidence and ease.
        </p>
      </div>

      {/* Loading / Error states */}
      {isLoading && (
        <div className="flex justify-center my-10">
          <span className="loading loading-bars loading-lg"></span>
        </div>
      )}
      {isError && (
        <div className="text-center my-10 text-error">
          Failed to load reviews. Please try again later.
        </div>
      )}

      {/* Carousel */}
      {!isLoading && !isError && total > 0 && (
        <div className="relative w-full h-[400px] my-20 flex items-center justify-center overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center">
            {getVisibleCards.map((testimonial) => {
              const { relative, key } = testimonial;

              let scale = "scale-90";
              let blur = "blur-sm";
              let opacity = "opacity-30";
              let z = "z-0";

              if (relative === 0) {
                scale = "scale-100";
                blur = "blur-0";
                opacity = "opacity-100";
                z = "z-20";
              } else if (Math.abs(relative) === 1) {
                scale = "scale-95";
                blur = "blur-sm";
                opacity = "opacity-60";
                z = "z-10";
              }

              return (
                <div
                  key={key}
                  className={`absolute transition-all duration-500 ease-in-out ${scale} ${blur} ${opacity} ${z}`}
                  style={{
                    transform: `translateX(${relative * (CARD_WIDTH + GAP)}px)`,
                    width: `${CARD_WIDTH}px`,
                  }}
                >
                  <div className="bg-white rounded-lg p-6 shadow-md h-full">
                    <img
                      src="https://i.postimg.cc/BZ8zKgZK/review-Quote.png"
                      alt="quote"
                      className="mb-4"
                    />
                    <p className="text-gray-700 text-base italic mb-4">
                      “{testimonial.message}”
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold text-sm">
                        {testimonial.name?.charAt(0) ?? "?"}
                      </div>
                      <div>
                        <h4 className="text-md font-semibold text-gray-900">
                          {testimonial.name || "Anonymous"}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {testimonial.title || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center mt-6 space-x-4 absolute bottom-0 left-1/2 -translate-x-1/2">
            <button
              onClick={prevTestimonial}
              className="w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition"
            >
              ←
            </button>

            {testimonials.map((_, index) => (
              <span
                key={index}
                className={`w-2 h-2 rounded-full ${
                  current === index ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            ))}

            <button
              onClick={nextTestimonial}
              className="w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition"
            >
              →
            </button>
          </div>
        </div>
      )}

      {!isLoading && !isError && total === 0 && (
        <div className="text-center my-10 opacity-70">No reviews yet.</div>
      )}
    </div>
  );
};

export default Review;
