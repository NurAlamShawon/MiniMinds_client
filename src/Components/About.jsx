import React, { useEffect, useState } from 'react';

const About = () => {
    const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/About.json")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching about data:", error));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <img
          src='https://i.postimg.cc/T3Vn3wkj/image.png'
          alt="About Icon"
          className="mx-auto w-66  mb-4"
        />
        <h1 className="text-3xl font-bold mb-2">About Us</h1>
        <p className="text-gray-600">Meet with our Team</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {data.map((member, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl p-4 text-center"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
            <h2 className="text-xl font-semibold">{member.name}</h2>
            <p className="text-blue-600">{member.role}</p>
            <p className="text-sm text-gray-500">{member.department}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;