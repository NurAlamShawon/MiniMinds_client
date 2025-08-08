import React from 'react';
import { Link } from 'react-router';

const Forbidden = () => {
   return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md text-center">
        <svg
          className="mx-auto h-24 w-24 text-red-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"
          />
        </svg>
        <h1 className="text-4xl font-bold text-gray-800 mt-6">403 Forbidden</h1>
        <p className="mt-2 text-gray-600">
          You don’t have permission to access this page.
        </p>
        <Link
          to="/"
          className="inline-block mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default Forbidden;