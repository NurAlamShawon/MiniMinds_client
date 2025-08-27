import React, { useContext } from "react";
import { Link } from "react-router";
import { ValueContext } from "../Context/ValueContext";

const HeroSection = () => {
  const { currentuser } = useContext(ValueContext);
  return (
    <div className="xl:flex flex-row items-center justify-between max-w-7xl mx-auto xl:px-0 px-4">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-black">
          <span className="text-yellow-500">Empowering</span>
          <br></br>
          students from small<br></br>
          age <span className="text-sky-400">towards vision</span>
          <br></br>
        </h1>
        <p className="xl:w-150 text-xl text-gray-800 hover:text-sky-400 transition-transform ">
          With the courage, Confidence, Creativity and Compassion to make their
          Unique Contribution in a Diverse and Dynamic World.
        </p>
        {!currentuser && (
          <Link to="/authentication">
            <button className="btn bg-sky-400 text-black px-6 py-4">
              {" "}
              Enroll Now
            </button>
          </Link>
        )}
      </div>
      <img src="https://i.postimg.cc/K8zkz2Gp/hero-kids.png" alt="" />
    </div>
  );
};

export default HeroSection;
