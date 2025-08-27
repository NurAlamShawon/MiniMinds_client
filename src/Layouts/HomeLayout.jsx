import React from "react";
import Navbar from "../Components/Navbar";
import { Outlet } from "react-router";
import Footer from "../Components/Footer";

const HomeLayout = () => {
  return (
    <div className="bg-gradient-to-r from-[#DCCFC0] to-blue-50">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <Outlet />
      <Footer />
    </div>
  );
};

export default HomeLayout;
