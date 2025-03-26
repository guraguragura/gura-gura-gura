
import React from "react";
import { Link } from "react-router-dom";

const TopInfoBar = () => {
  return (
    <div className="bg-gray-100 py-2 text-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <p className="text-gray-700">Free delivery above 30k FW</p>
          <Link to="/app" className="text-gray-700 hover:text-black">
            Download the Gura App
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopInfoBar;
