import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';

const ThirdSection = () => {
    const [features, setFeatures] = useState([]);

  useEffect(() => {
    fetch("/Third.json")
      .then((res) => res.json())
      .then((data) => setFeatures(data));
  }, []);

   return (
    <section className="bg-gradient-to-r from-cyan-500 to-blue-50 py-16 px-4 my-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Left image */}
        <img
          src="https://i.postimg.cc/y6DVpy15/image.png"
          alt="MiniMinds Characters"
          className=" mx-auto"
        />

        {/* Right content */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Kids will love to learn.
          </h2>

          <div className="space-y-6">
            {features.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-8 h-8 mt-1"
                />
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.desc}</p>
                  <Link
                    to={item.path}
                    className="text-primary underline text-sm font-medium"
                  >
                    Learn more
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThirdSection;