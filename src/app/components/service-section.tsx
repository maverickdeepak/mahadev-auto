import { Bike, CheckCircle, Clock, Wrench } from "lucide-react";
import React from "react";

const ServiceSection = () => {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From basic tune-ups to complex repairs, we handle all your bike
            maintenance needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition duration-300">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <Wrench className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Basic Tune-Up
            </h3>
            <p className="text-gray-600 mb-4">
              Complete inspection and adjustment of brakes, gears, and wheels.
              Perfect for regular maintenance.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Brake adjustment
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Gear tuning
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Wheel truing
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition duration-300">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <Bike className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Full Service
            </h3>
            <p className="text-gray-600 mb-4">
              Comprehensive service including parts replacement, deep cleaning,
              and complete bike overhaul.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Complete disassembly
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Parts replacement
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Deep cleaning
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition duration-300">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Emergency Repairs
            </h3>
            <p className="text-gray-600 mb-4">
              Quick fixes for urgent issues. Flat tires, broken chains, and
              other immediate problems.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Flat tire repair
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Chain replacement
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Brake emergency
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
