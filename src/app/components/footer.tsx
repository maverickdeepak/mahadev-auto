import React from "react";
import { Bike } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Bike className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold">
                Mahadev Automobiles
              </span>
            </div>
            <p className="text-gray-400">
              Professional bike repair and maintenance services with over 15
              years of experience.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Basic Tune-Up</li>
              <li>Full Service</li>
              <li>Emergency Repairs</li>
              <li>Parts Replacement</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#home" className="hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white">
                  Services
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white">
                  About
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white">
                  Contact
                </a>
              </li>
              <li>
                <a href="/admin/login" className="hover:text-white">
                  Admin
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-gray-400">
              <div>
                Main Bus Stand, Sataun, Sirmour, Himachal Pradesh, India
              </div>
              <div>
                <a href="tel:+918350902050" className="hover:text-white">
                  +91 83509-02050
                </a>
              </div>
              <div>Mon-Sat: 9AM-8PM</div>
              <div>Sun: 9AM-6PM</div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Mahadev Automobiles. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
