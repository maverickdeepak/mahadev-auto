"use client";
import React, { useState } from "react";
import { Bike, Phone, Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b relative md:relative sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Bike className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">
              Mahadev Automobiles
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <a
              href="#home"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Home
            </a>
            <a
              href="#services"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Services
            </a>
            <a
              href="#about"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              About
            </a>
            <a
              href="#contact"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Contact
            </a>
          </div>

          {/* Desktop Phone */}
          <div className="hidden md:flex items-center space-x-4">
            <Phone className="h-5 w-5 text-blue-600" />
            <a
              href="tel:+918350902050"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              +91 83509-02050
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "max-h-96 opacity-100 visible"
              : "max-h-0 opacity-0 invisible"
          } overflow-hidden`}
        >
          <div className="py-4 space-y-4 border-t border-gray-200">
            <a
              href="#home"
              onClick={closeMenu}
              className="block text-gray-700 hover:text-blue-600 transition-colors py-2"
            >
              Home
            </a>
            <a
              href="#services"
              onClick={closeMenu}
              className="block text-gray-700 hover:text-blue-600 transition-colors py-2"
            >
              Services
            </a>
            <a
              href="#about"
              onClick={closeMenu}
              className="block text-gray-700 hover:text-blue-600 transition-colors py-2"
            >
              About
            </a>
            <a
              href="#contact"
              onClick={closeMenu}
              className="block text-gray-700 hover:text-blue-600 transition-colors py-2"
            >
              Contact
            </a>
            <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
              <Phone className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                (555) 123-4567
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
