import React, { useContext } from "react";
import { Link, NavLink } from "react-router";
import { ValueContext } from "../Context/ValueContext";
import MiniMindsLogo from "./MiniMindsLogo";
import Useaxios from "../Hooks/Useaxios";
import { useQuery } from "@tanstack/react-query";

const Navbar = () => {
  const { currentuser, signout } = useContext(ValueContext);
  const axiosInstance = Useaxios();
  const hanglegotologin = () => {
    signout();
  };

  const { data: dbUser, isLoading } = useQuery({
    queryKey: ["user", currentuser?.email],
    enabled: !!currentuser?.email,
    queryFn: async () => {
      const res = await axiosInstance.get(`/users?email=${currentuser.email}`);
      return res.data[0];
    },
  });

  return (
    <div className="mb-10 raleway">
      <div className="navbar bg-base-100 shadow-sm xl:px-10">
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="pr-2 btn-ghost lg:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm space-y-1 dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <NavLink to={"/course-details"}>Course Details</NavLink>
              </li>
              <li>
                <NavLink to={"/my-classes"}>My Classes</NavLink>
              </li>
              <li>
                <NavLink to={"/avater"}>Avatar</NavLink>
              </li>
              <li>
                <NavLink to={"/dashboard"}>Dashboard</NavLink>
              </li>

              <li>
                <NavLink to={"/Premium"}>Premium</NavLink>
              </li>
              <li>
                <NavLink to={"/standings"}>Standings</NavLink>
              </li>
              <li>
                <NavLink to={"/games"}>Games</NavLink>
              </li>
            </ul>
          </div>

          <div>
            <MiniMindsLogo />
          </div>
        </div>

        <div className="navbar-end w-76 xl:w-280">
          <ul className="xl:menu space-x-5 xl:menu-horizontal px-1 hidden">
            <li>
              <NavLink to={"/course-details"}>Course Details</NavLink>
            </li>
            <li>
              <NavLink to={"/my-classes"}>My Classes</NavLink>
            </li>
            <li>
              <NavLink to={"/avater"}>Avatar</NavLink>
            </li>
            <li>
              <NavLink to={"/Premium"}>Premium</NavLink>
            </li>
              <li>
                <NavLink to={"/dashboard"}>Dashboard</NavLink>
              </li>
            <li>
              <NavLink to={"/standings"}>Standings</NavLink>
            </li>
            <li>
              <NavLink to={"/games"}>Games</NavLink>
            </li>
          </ul>

          {isLoading ? (
            "Loading..."
          ) : (
            <img
              src={dbUser?.img || "https://i.postimg.cc/xCXgGNKq/image.png"}
              className="w-8 h-8 rounded-full"
            />
          )}

          {currentuser ? (
            <button
              className="xl:ml-4 ml-1 btn btn-info"
              onClick={hanglegotologin}
            >
              SignOut
            </button>
          ) : (
            <div className="flex">
              <Link to="/authentication">
                {" "}
                <button className="btn btn-info xl:mx-2">Login</button>
              </Link>
              <Link to="registration">
                {" "}
                <button className="btn btn-success xl:block hidden">
                  Register
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
