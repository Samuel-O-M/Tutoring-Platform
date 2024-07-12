import React from 'react';
import { Link } from 'react-router-dom'; // Import Link component from react-router-dom

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-8">Page Not Found</p>
      {/* Link the button to localhost:3000 */}
      <Link to="/" className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
        Go Back Home
      </Link>
    </div>
  );
}

export default NotFound;