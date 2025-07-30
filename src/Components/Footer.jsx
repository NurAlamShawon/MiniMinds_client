import React from "react";
import MiniMindsLogo from "./MiniMindsLogo";

const Footer = () => {
  return (
    <footer className="max-w-7xl mx-auto xl:px-0 px-4 bg-white border-t border-gray-300 mt-10 text-center text-black text-sm">
      <div className=" py-8 space-y-6">
        {/* Logo & Links */}
        <div className="flex items-center justify-between">
          <MiniMindsLogo />
          <p className="xl:text-lg text-xs text-black">
            Nurturing Young Minds, One Lesson at a Time
          </p>
        </div>

        <div className="border-t border-gray-300 my-10"></div>

        <div className="xl:flex flex-row items-center justify-between">
          {/* Social Media */}
          <div className="space-y-4 xl:mb-0 mb-4  xl:pb-6 pb-4 xl:border-b-0 border-b-1 border-gray-300">
            <p className=" text-gray-500 text-xs">Follow Us</p>
            <div className="flex justify-center gap-3 text-xl">
              <div className="flex gap-4 items-center">
                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="28"
                    width="28"
                    viewBox="0 0 32 32"
                    enable-background="new 0 0 32 32"
                    xml:space="preserve"
                    className="hover:scale-125 active:scale-95 transition-transform duration-200 cursor-pointer"
                  >
                    <path
                      fill="#1877F2"
                      d="M16,0L16,0c8.837,0,16,7.163,16,16l0,0c0,8.837-7.163,16-16,16l0,0C7.163,32,0,24.837,0,16l0,0 C0,7.163,7.163,0,16,0z"
                    ></path>
                    <path
                      fill="#FFFFFF"
                      d="M18,17.5h2.5l1-4H18v-2c0-1.03,0-2,2-2h1.5V6.14C21.174,6.097,19.943,6,18.643,6C15.928,6,14,7.657,14,10.7 v2.8h-3v4h3V26h4V17.5z"
                    ></path>
                  </svg>
                </a>

                {/* Twitter (X) */}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    enable-background="new 0 0 24 24"
                    xml:space="preserve"
                    height="28"
                    width="28"
                    className="hover:scale-125 active:scale-95 transition-transform duration-200 cursor-pointer"
                  >
                    <circle fill="#0F1419" cx="12" cy="12" r="12"></circle>
                    <path
                      fill="#FFFFFF"
                      d="M15.531,7h1.662l-3.63,4.236L17.833,17h-3.343l-2.62-3.495L8.876,17H7.212l3.882-4.531L7,7h3.427
l2.366,3.195L15.531,7z M14.947,15.986h0.92L9.926,7.962H8.937L14.947,15.986z"
                    ></path>
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://i.postimg.cc/7bvm3Pns/image.png"
                    alt="Instagram"
                    className="h-12 w-12 object-contain hover:scale-125 active:scale-95 transition-transform duration-200 cursor-pointer"
                  />
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="28"
                    width="28"
                    viewBox="0 0 32 32"
                    enable-background="new 0 0 32 32"
                    xml:space="preserve"
                    className="hover:scale-125 active:scale-95 transition-transform duration-200 cursor-pointer"
                  >
                    <path
                      fill="#FF0000"
                      d="M16,0L16,0c8.837,0,16,7.163,16,16l0,0c0,8.837-7.163,16-16,16l0,0C7.163,32,0,24.837,0,16l0,0 C0,7.163,7.163,0,16,0z"
                    ></path>
                    <path
                      fill="#FFFFFF"
                      d="M25.543,10.498C26,12.28,26,16,26,16s0,3.72-0.457,5.502c-0.254,0.985-0.997,1.76-1.938,2.022 C21.896,24,16,24,16,24s-5.893,0-7.605-0.476c-0.945-0.266-1.687-1.04-1.938-2.022C6,19.72,6,16,6,16s0-3.72,0.457-5.502 c0.254-0.985,0.997-1.76,1.938-2.022C10.107,8,16,8,16,8s5.896,0,7.605,0.476C24.55,8.742,25.292,9.516,25.543,10.498L25.543,10.498 z M14,19.5l6-3.5l-6-3.5V19.5z"
                    ></path>
                  </svg>
                </a>

                {/* Google news */}
                <a
                  href="https://www.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full  bg-gray-300 hover:scale-125 active:scale-95 transition-transform duration-200 cursor-pointer"
                >
                  <img
                    src="https://i.postimg.cc/nLvZBMK5/image.png"
                    alt="Google"
                    className="h-7 w-7 rounded-full object-contain  p-0.5"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* App Downloads */}

          <div>
            <p className=" text-gray-500 text-xs mb-3">Mobile Apps</p>
            <div className="flex justify-center items-center gap-4">
              {/* Google Play – PNG badge with white effect */}
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white p-1 rounded hover:scale-105 transition-transform duration-300"
              >
                <img
                  src="https://i.postimg.cc/hGqd4X0j/image.png"
                  alt="Get it on Google Play"
                  className="h-10 border-1 border-gray-300 rounded"
                />
              </a>

              {/* App Store – SVG badge with white effect */}
              <a
                href="https://www.apple.com/app-store/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://i.postimg.cc/L6Ry85h5/image.png"
                  alt="Download on the App Store"
                  className="h-10 border-1 rounded bg-white border-gray-300 hover:scale-105 transition-transform duration-300 "
                />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <span className="text-center pt-2 text-xs text-gray-500 hover:text-blue-700">
          Copyright © 2025 - All right reserved
        </span>
      </div>
    </footer>
  );
};

export default Footer;
