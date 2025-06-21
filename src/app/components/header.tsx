import React from "react";
import { Bike, Phone } from "lucide-react";

const Header = () => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Bike className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">
              Mahadev Automobiles
            </span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#home" className="text-gray-700 hover:text-blue-600">
              Home
            </a>
            <a href="#services" className="text-gray-700 hover:text-blue-600">
              Services
            </a>
            <a href="#about" className="text-gray-700 hover:text-blue-600">
              About
            </a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600">
              Contact
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <Phone className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">
              (555) 123-4567
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
