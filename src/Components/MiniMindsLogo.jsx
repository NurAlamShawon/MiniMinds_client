import React from "react";
import { Link } from "react-router";

const MiniMindsLogo = () => {
  return (
    <div>
      <Link to="/">
        <div className="flex items-center ">
          <img
            src="https://i.postimg.cc/HnNNGmBc/image.png"
            alt=""
            className="w-8 h-10  "
          />
          <span className=" text-lg font-medium text-black">
            Mini<span className="text-sky-400">Minds</span>
          </span>
        </div>
      </Link>
    </div>
  );
};

export default MiniMindsLogo;
