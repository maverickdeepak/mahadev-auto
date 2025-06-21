"use client";

import React, { useState } from "react";
import { Search, Bike, Wrench, Clock, User, Phone, MapPin } from "lucide-react";

interface ServiceRecord {
  bikeNumber: string;
  customerName: string;
  phone: string;
  bikeModel: string;
  serviceType: string;
  status: string;
  dropDate: string;
  estimatedCompletion: string;
  address: string;
}

const ServicePage = () => {
  const [bikeNumber, setBikeNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<ServiceRecord | null>(null);

  const handleSearch = async () => {
    if (!bikeNumber.trim()) return;

    setIsSearching(true);

    // Simulate API call
    setTimeout(() => {
      // Mock data - replace with actual API call
      setSearchResult({
        bikeNumber: bikeNumber,
        customerName: "John Doe",
        phone: "+91 98765 43210",
        bikeModel: "Honda Activa 6G",
        serviceType: "Full Service",
        status: "In Progress",
        dropDate: "2024-01-15",
        estimatedCompletion: "2024-01-17",
        address: "123 Main Street, City, State 12345",
      });
      setIsSearching(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Bike className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Service Store
          </h1>
          <p className="text-gray-600 text-lg">
            Find bike service details by bike number
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Search Bike Service
            </h2>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Enter bike number"
                  value={bikeNumber}
                  onChange={(e) => setBikeNumber(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white text-gray-900 placeholder-gray-500"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  maxLength={4}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={isSearching || !bikeNumber.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 flex items-center justify-center gap-2"
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Find Bike
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {searchResult && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Service Details
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Customer Information */}
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Customer Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Name
                      </label>
                      <p className="text-gray-900 font-medium">
                        {searchResult.customerName}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Phone
                      </label>
                      <p className="text-gray-900 font-medium flex items-center gap-2">
                        <Phone className="h-4 w-4 text-blue-600" />
                        {searchResult.phone}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Address
                      </label>
                      <p className="text-gray-900 font-medium flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        {searchResult.address}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Bike className="h-5 w-5 text-green-600" />
                    Bike Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Bike Number
                      </label>
                      <p className="text-gray-900 font-medium">
                        {searchResult.bikeNumber}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Model
                      </label>
                      <p className="text-gray-900 font-medium">
                        {searchResult.bikeModel}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Information */}
              <div className="space-y-6">
                <div className="bg-purple-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-purple-600" />
                    Service Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Service Type
                      </label>
                      <p className="text-gray-900 font-medium">
                        {searchResult.serviceType}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Status
                      </label>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          searchResult.status === "In Progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : searchResult.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {searchResult.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    Timeline
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Drop Date
                      </label>
                      <p className="text-gray-900 font-medium">
                        {searchResult.dropDate}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Estimated Completion
                      </label>
                      <p className="text-gray-900 font-medium">
                        {searchResult.estimatedCompletion}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200">
                Update Status
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200">
                Mark Complete
              </button>
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200">
                Print Receipt
              </button>
            </div>
          </div>
        )}

        {/* No Results Message */}
        {searchResult === null && !isSearching && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="flex justify-center mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Search for a Bike
            </h3>
            <p className="text-gray-600">
              Enter a bike number above to find service details
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicePage;
