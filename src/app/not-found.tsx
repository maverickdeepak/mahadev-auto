"use client";

import React from "react";
import Link from "next/link";
import {
  Bike,
  Wrench,
  Home,
  Phone,
  MapPin,
  ArrowLeft,
  Search,
  Clock,
  User,
} from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Animated Bike Icon */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="bg-blue-600 p-6 rounded-full shadow-2xl animate-bounce">
              <Bike className="h-16 w-16 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 bg-red-500 p-3 rounded-full shadow-lg animate-pulse">
              <Wrench className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* 404 Text */}
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-bold text-gray-900 mb-4">
            4<span className="text-blue-600">0</span>4
          </h1>
          <div className="text-6xl md:text-7xl font-bold text-gray-300 mb-4">
            OOPS!
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Looks like this bike took a wrong turn! The page you&apos;re looking
            for seems to have broken down somewhere along the way. Don&apos;t
            worry, our expert mechanics are here to help.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
          <Link
            href="/"
            className="bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-300 rounded-xl p-6 transition-all duration-300 shadow-lg hover:shadow-xl group"
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition-colors">
                <Home className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Go Home</h3>
              <p className="text-sm text-gray-600">Back to main page</p>
            </div>
          </Link>

          <Link
            href="/admin/service-store"
            className="bg-white hover:bg-green-50 border-2 border-green-200 hover:border-green-300 rounded-xl p-6 transition-all duration-300 shadow-lg hover:shadow-xl group"
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition-colors">
                <Search className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Service Store</h3>
              <p className="text-sm text-gray-600">Find bike records</p>
            </div>
          </Link>

          <Link
            href="/admin/bike-store"
            className="bg-white hover:bg-purple-50 border-2 border-purple-200 hover:border-purple-300 rounded-xl p-6 transition-all duration-300 shadow-lg hover:shadow-xl group"
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="bg-purple-100 p-3 rounded-full group-hover:bg-purple-200 transition-colors">
                <Bike className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Add Bike</h3>
              <p className="text-sm text-gray-600">New service record</p>
            </div>
          </Link>

          <Link
            href="/admin/login"
            className="bg-white hover:bg-orange-50 border-2 border-orange-200 hover:border-orange-300 rounded-xl p-6 transition-all duration-300 shadow-lg hover:shadow-xl group"
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="bg-orange-100 p-3 rounded-full group-hover:bg-orange-200 transition-colors">
                <User className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Admin Login</h3>
              <p className="text-sm text-gray-600">Access dashboard</p>
            </div>
          </Link>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-2">
            <Wrench className="h-5 w-5 text-blue-600" />
            Need Help? Contact Us
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-600">Phone</p>
                <p className="text-gray-900 font-semibold">+91 83509-02050</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <MapPin className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-600">Location</p>
                <p className="text-gray-900 font-semibold">
                  Sataun, Sirmour, HP
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-3">
              <div className="bg-yellow-100 p-2 rounded-full">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-600">
                  Service Hours
                </p>
                <p className="text-gray-900 font-semibold">
                  7:00 AM - 8:00 PM (Daily)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>

        {/* Fun Message */}
        <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200 max-w-2xl mx-auto">
          <p className="text-sm text-blue-800">
            🚲 <strong>Fun Fact:</strong> Even the best bikes need a tune-up
            sometimes! Just like this page, we&apos;re here to get you back on
            track. Our expert mechanics at Mahadev Automobiles are ready to fix
            any issues - whether it&apos;s your bike or just a broken link! 🛠️
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
