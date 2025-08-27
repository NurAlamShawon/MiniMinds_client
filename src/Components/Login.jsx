import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import GoogleSignIn from "./GoogleSignIn";;
import { auth } from "../firebase-init";
import { ValueContext } from "../Context/ValueContext";

const Login = () => {
  const [eye, seteye] = useState(false);
  const [error, seterror] = useState("");
  const { loginwithemail, resetpassword } = useContext(ValueContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setemail] = useState("");

  const handlelogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    setemail(email);
    const password = e.target.password.value;

    const passcheck = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    seterror("");

    if (passcheck.test(password) === false) {
      seterror(
        "Password must contain one Upperletter one Lowerletter and a digit"
      );
      return;
    }

    loginwithemail(email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        if (!user.emailVerified) {
          alert("Please verify your email before logging in.");
          // Optionally sign out the user
          auth.signOut();
          return;
        }

        navigate(location?.state || "/");
        // Continue with login if verified
        // console.log("Login successful and email verified", user);
        // Set success state, redirect, etc.

        // ...
      })
      .catch((error) => {
        const errorMessage = error.message;
        seterror(errorMessage);
      });
  };

  const handleforget = () => {
    if (!email) {
      alert("Enter your email");
    }
    resetpassword(email)
      .then(() => {
        // Password reset email sent!
        // ..
        alert("Check your email a verification code has send to your email");
      })
      .catch((error) => {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        console.log(error);
        // ..
      });
  };

  return (
    <div className="w-full xl:flex flex-row">
      <div className="xl:w-1/2 bg-white w-full max-w-md mx-auto mt-10 p-6  rounded shadow my-5">
        <div>
          <form className="space-y-6  m-10 " onSubmit={handlelogin}>
            <h1 className="font-semibold text-2xl text-center">Welcome back</h1>
            <p className="text-base text-center text-gray-400">
              Login with MiniMinds
            </p>
            <div className="border-1 border-gray-200 mx-2"></div>
            <label>Email Address</label>
            <br></br>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              className="input w-full"
              onChange={(e) => setemail(e.target.value)}
            />
            <br></br>
            <label>Password</label>
            <br></br>
            <div className=" flex relative">
              <input
                type={eye ? "text" : "password"}
                name="password"
                className="input pr-10 w-full"
                placeholder="Password"
              />
              <button
                className="absolute right-2 top-2 "
                type="button"
                onClick={() => {
                  seteye(!eye);
                }}
              >
                {eye ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                )}
              </button>
            </div>

            <span
              className="hover:text-sky-700 underline cursor-pointer  hover:underline-offset-2"
              onClick={handleforget}
            >
              Forget Password?
            </span>

            <br></br>
            <br></br>

            <input
              type="submit"
              value="Login"
              className="text-white btn bg-primary w-full"
            />
            <br></br>

            <div>
              <span className="text-base text-red-500">
                {error ? error : ""}
              </span>
            </div>
          </form>
          <div className="flex w-full flex-col">
            <div>
              {" "}
              <p className="font-semibold text-base text-black text-center">
                Don't Have An Account?
                <Link to="registration" className="text-[#f77b33] pl-2">
                  Registration
                </Link>{" "}
              </p>
            </div>
            <div className="divider">OR</div>

            <div>
              {" "}
              <GoogleSignIn></GoogleSignIn>
            </div>
          </div>
        </div>
      </div>
      <div className="xl:w-1/2 w-full bg-[#FAFDF0] border-2 border-gray-200">
        <img
          src="https://i.postimg.cc/fWpYV7kk/auth-Image.png"
          alt=""
          className="mx-auto mt-20"
        />
      </div>
    </div>
  );
};

export default Login;
