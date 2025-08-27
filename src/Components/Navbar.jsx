import React, { useContext } from "react";
import { Link, NavLink } from "react-router"; // keep as you have
import { ValueContext } from "../Context/ValueContext";
import MiniMindsLogo from "./MiniMindsLogo";
import { useQuery } from "@tanstack/react-query";
import UseUserRole from "../Hooks/UseuserRole";
import Useaxios from "../Hooks/Useaxios";




const Navbar = () => {
  const { currentuser, signout } = useContext(ValueContext);
  const axiosInstance = Useaxios();
  const { role } = UseUserRole();
  const isAdmin = role === "admin";
  const isLoggedIn = !!currentuser?.email;

  const hanglegotologin = () => {
    signout();
  };

  const { data: dbUser, isLoading } = useQuery({
    queryKey: ["user", currentuser?.email],
    enabled: isLoggedIn,
    queryFn: async () => {
      const res = await axiosInstance.get(`/users/email?email=${currentuser.email}`);
      return res.data;
    },
  });

  return (
    <div className="raleway">
      <div className="navbar bg-base-100 shadow-sm xl:px-10">
        {/* LEFT */}
        <div className="navbar-start">
          {/* Mobile menu */}
          <div className="dropdown">
            <div tabIndex={0} role="button" className="pr-2 btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm space-y-1 dropdown-content bg-base-100 rounded-box z-1 mt-3 w-56 p-2 shadow"
            >
              {/* If admin: only dashboard; else: show all public links */}
              {isAdmin ? (
                <li>
                  <NavLink to={"/dashboard"}>Dashboard</NavLink>
                </li>
              ) : (
                <>
                  <li><NavLink to="/course-details">Course Details</NavLink></li>
                  <li><NavLink to="/my-classes">My Classes</NavLink></li>
                  <li><NavLink to="/avater">Avatar</NavLink></li>
                  <li><NavLink to="/Premium">Premium</NavLink></li>
                  <li><NavLink to="/standings">Standings</NavLink></li>
                  <li><NavLink to="/games">Games</NavLink></li>
                  <li><NavLink to="/gift">Gift</NavLink></li>
                </>
              )}

              {/* Gems (only when logged in) */}
              {isLoggedIn && (
                <li className="mt-2">
                  <div className="flex items-center gap-2 px-2 py-1">
                    <span className="badge badge-warning gap-2 px-3 py-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 3l3.09 3.09L21 7.5l-9 13.5L3 7.5l5.91-1.41L12 3z" />
                      </svg>
                      <span className="font-semibold">{dbUser?.gems}</span>
                    </span>
                  </div>
                </li>
              )}
            </ul>
          </div>

          <MiniMindsLogo />
        </div>

        {/* RIGHT */}
        <div className="navbar-end w-76 xl:w-300">
          {/* Desktop menu */}
          <ul className="xl:menu space-x-5 xl:menu-horizontal px-1 hidden xl:flex">
            {isAdmin ? (
              <li>
                <NavLink to={"/dashboard"}>Dashboard</NavLink>
              </li>
            ) : (
              <>
                <li><NavLink to="/course-details">Course Details</NavLink></li>
                <li><NavLink to="/my-classes">My Classes</NavLink></li>
                <li><NavLink to="/avater">Avatar</NavLink></li>
                <li><NavLink to="/Premium">Premium</NavLink></li>
                <li><NavLink to="/standings">Standings</NavLink></li>
                <li><NavLink to="/games">Games</NavLink></li>
                <li><NavLink to="/gift">Gift</NavLink></li>
              </>
            )}
          </ul>

          {/* Gems badge (only if logged in) */}
          {isLoggedIn && role==="user" && (
            <div className="mx-3 tooltip tooltip-bottom" data-tip="Your gems">
              <div className="badge badge-warning gap-2 px-3 py-3 text-base-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3l3.09 3.09L21 7.5l-9 13.5L3 7.5l5.91-1.41L12 3z" />
                </svg>
                <span className="font-semibold">{dbUser?.gems}</span>
              </div>
            </div>
          )}

          {/* Avatar */}
          {isLoading ? (
            "Loading..."
          ) : (
            <img
              src={dbUser?.img || "https://i.postimg.cc/xCXgGNKq/image.png"}
              className="w-8 h-8 rounded-full"
              alt="User avatar"
            />
          )}

          {/* Auth buttons */}
          {isLoggedIn ? (
            <button className="xl:ml-4 ml-2 btn btn-info" onClick={hanglegotologin}>
              SignOut
            </button>
          ) : (
            <div className="flex">
              <Link to="/authentication">
                <button className="xl:ml-2 ml-2 btn btn-info xl:mx-2">Login</button>
              </Link>
              <Link to="authentication/registration">
                <button className="btn btn-success xl:block hidden">Register</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
