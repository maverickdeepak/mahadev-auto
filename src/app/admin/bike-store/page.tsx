"use client";

import React, { useState } from "react";
import Link from "next/link";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

import {
  Bike,
  User,
  Wrench,
  DollarSign,
  Save,
  Plus,
  Trash2,
  Clock,
  Search,
  LogOut,
} from "lucide-react";

interface BikeServiceItem {
  id: string;
  itemName: string;
  itemCost: number;
}

interface BikeRecord {
  bikeNumber: string;
  userName: string;
  phoneNumber: string;
  address: string;
  serviceType: string;
  serviceCost: number;
  serviceItems: BikeServiceItem[];
  totalCost: number;
  serviceStartDate: string;
  deliveryDate: string;
  serviceStatus: string;
}

const BikeStorepage = () => {
  const { user, signOut } = useAuth();

  const [formData, setFormData] = useState<BikeRecord>({
    bikeNumber: "",
    userName: "",
    phoneNumber: "",
    address: "",
    serviceType: "",
    serviceCost: 0,
    serviceItems: [],
    totalCost: 0,
    serviceStartDate: "",
    deliveryDate: "",
    serviceStatus: "",
  });

  const [newItem, setNewItem] = useState({ itemName: "", itemCost: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingRecords, setExistingRecords] = useState<
    Array<{
      id: number;
      bikeNumber: string;
      userName: string;
      serviceType: string;
      serviceStatus: string;
      created_at: string;
    }>
  >([]);
  const [showExistingRecords, setShowExistingRecords] = useState(false);

  const serviceTypes = [
    "Basic Tune-Up",
    "Full Service",
    "Emergency Repairs",
    "Parts Replacement",
  ];

  const serviceStatuses = ["Pending", "In Progress", "Done", "Delivered"];

  const checkExistingRecords = async (bikeNumber: string) => {
    if (!bikeNumber.trim()) return;

    const { data } = await supabase
      .from("bike_records")
      .select("*")
      .eq("bikeNumber", bikeNumber.toUpperCase())
      .order("created_at", { ascending: false });

    if (data && data.length > 0) {
      setExistingRecords(data);
      setShowExistingRecords(true);
      toast(
        `${data.length} previous service record(s) found for this bike number`,
        {
          icon: "🔍",
          duration: 5000,
        }
      );
    } else {
      setExistingRecords([]);
      setShowExistingRecords(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Convert bike number to uppercase
    let processedValue = value;
    if (name === "bikeNumber") {
      processedValue = value.toUpperCase();
    }

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "serviceCost"
          ? parseFloat(processedValue) || 0
          : processedValue,
    }));

    // Check for existing records when bike number is entered
    if (name === "bikeNumber" && processedValue.length >= 4) {
      checkExistingRecords(processedValue);
    }
  };

  const addServiceItem = () => {
    if (newItem.itemName.trim() && newItem.itemCost > 0) {
      const item: BikeServiceItem = {
        id: Date.now().toString(),
        itemName: newItem.itemName,
        itemCost: newItem.itemCost,
      };

      setFormData((prev) => ({
        ...prev,
        serviceItems: [...prev.serviceItems, item],
        totalCost:
          prev.serviceCost +
          prev.serviceItems.reduce((sum, item) => sum + item.itemCost, 0) +
          newItem.itemCost,
      }));

      setNewItem({ itemName: "", itemCost: 0 });
      toast.success(
        `Added ${newItem.itemName} - ₹${newItem.itemCost.toFixed(2)}`
      );
    } else {
      toast.error("Please enter both item name and cost");
    }
  };

  const removeServiceItem = (id: string) => {
    setFormData((prev) => {
      const removedItem = prev.serviceItems.find((item) => item.id === id);
      const updatedItems = prev.serviceItems.filter((item) => item.id !== id);
      const newTotalCost =
        prev.serviceCost +
        updatedItems.reduce((sum, item) => sum + item.itemCost, 0);

      if (removedItem) {
        toast.success(`Removed ${removedItem.itemName}`);
      }

      return {
        ...prev,
        serviceItems: updatedItems,
        totalCost: newTotalCost,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      const { data, error } = await supabase
        .from("bike_records")
        .insert(formData);
      console.log(data);
      console.log(error);

      // Reset form after successful submission
      setFormData({
        bikeNumber: "",
        userName: "",
        phoneNumber: "",
        address: "",
        serviceType: "",
        serviceCost: 0,
        serviceItems: [],
        totalCost: 0,
        serviceStartDate: "",
        deliveryDate: "",
        serviceStatus: "",
      });
      // show toast only if data is inserted
      if (data && !error) {
        toast.success("Bike information saved successfully!");
      } else {
        toast.error("Error saving bike information. Please try again.");
      }
    } catch (error) {
      console.error("Error saving bike record:", error);
      toast.error("Error saving bike information. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex-1"></div>
              <div className="flex justify-center flex-1">
                <div className="bg-blue-600 p-3 rounded-full">
                  <Bike className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="flex-1 flex justify-end">
                <button
                  onClick={signOut}
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Add Bike Information
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              Enter bike details and service information
            </p>
            {user && (
              <p className="text-sm text-gray-500 mb-4">
                Logged in as: {user.email}
              </p>
            )}

            {/* Navigation Link */}
            <div className="flex justify-center">
              <Link
                href="/admin/service-store"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
              >
                <Search className="h-4 w-4" />
                Search Bike Records
              </Link>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Bike Information Section */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Bike className="h-5 w-5 text-blue-600" />
                  Bike Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="bikeNumber"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Bike Number *
                    </label>
                    <input
                      type="text"
                      id="bikeNumber"
                      name="bikeNumber"
                      required
                      value={formData.bikeNumber}
                      onChange={handleInputChange}
                      placeholder="e.g., HP 17A 1234"
                      className="block w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white text-gray-900 placeholder-gray-500"
                    />

                    {/* Existing Records Display */}
                    {showExistingRecords && existingRecords.length > 0 && (
                      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-yellow-800 mb-3">
                          ⚠️ Previous Service Records Found
                        </h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {existingRecords.slice(0, 3).map((record, index) => (
                            <div
                              key={record.id}
                              className="bg-white rounded p-3 border border-yellow-200"
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">
                                    Visit #{existingRecords.length - index}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    {record.serviceType} •{" "}
                                    {record.serviceStatus}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(
                                      record.created_at
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <span
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    record.serviceStatus === "Pending"
                                      ? "bg-gray-100 text-gray-800"
                                      : record.serviceStatus === "In Progress"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : record.serviceStatus === "Done"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {record.serviceStatus}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-yellow-700 mt-2">
                          💡 This will create a new service record. Previous
                          records will be preserved.
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="serviceType"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Service Type *
                    </label>
                    <select
                      id="serviceType"
                      name="serviceType"
                      required
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white text-gray-900"
                    >
                      <option value="">Select service type</option>
                      {serviceTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-6">
                    <label
                      htmlFor="serviceStatus"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Service Status *
                    </label>
                    <select
                      id="serviceStatus"
                      name="serviceStatus"
                      required
                      value={formData.serviceStatus}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white text-gray-900"
                    >
                      <option value="">Select service status</option>
                      {serviceStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Customer Information Section */}
              <div className="bg-green-50 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <User className="h-5 w-5 text-green-600" />
                  Customer Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="userName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      id="userName"
                      name="userName"
                      required
                      value={formData.userName}
                      onChange={handleInputChange}
                      placeholder="Enter customer name"
                      className="block w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white text-gray-900 placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      required
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      className="block w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Address *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    required
                    rows={3}
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter customer address"
                    className="block w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white text-gray-900 placeholder-gray-500 resize-none"
                  />
                </div>
              </div>

              {/* Service Timeline Section */}
              <div className="bg-orange-50 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  Service Timeline
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="serviceStartDate"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Service Start Date *
                    </label>
                    <input
                      type="date"
                      id="serviceStartDate"
                      name="serviceStartDate"
                      required
                      value={formData.serviceStartDate}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white text-gray-900"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="deliveryDate"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Expected Delivery Date *
                    </label>
                    <input
                      type="date"
                      id="deliveryDate"
                      name="deliveryDate"
                      required
                      value={formData.deliveryDate}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Service Cost Section */}
              <div className="bg-purple-50 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                  Service Cost
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="serviceCost"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Service Cost (₹)
                    </label>
                    <input
                      type="number"
                      id="serviceCost"
                      name="serviceCost"
                      min="0"
                      step="0.01"
                      value={formData.serviceCost}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="block w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white text-gray-900 placeholder-gray-500"
                    />
                  </div>

                  <div className="flex items-end">
                    <div className="bg-gray-100 rounded-lg p-4 w-full">
                      <p className="text-sm text-gray-600">Total Cost</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ₹{formData.totalCost.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Items Section */}
              <div className="bg-orange-50 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-orange-600" />
                  Service Items
                </h2>

                {/* Add New Item */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <input
                      type="text"
                      placeholder="Enter item name"
                      value={newItem.itemName || ""}
                      onChange={(e) =>
                        setNewItem((prev) => ({
                          ...prev,
                          itemName: e.target.value,
                        }))
                      }
                      className="block w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white text-gray-900 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Cost (₹)"
                      step="0.01"
                      value={newItem.itemCost}
                      onChange={(e) =>
                        setNewItem((prev) => ({
                          ...prev,
                          itemCost: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="block w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white text-gray-900 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={addServiceItem}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition duration-200 flex items-center justify-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Item
                    </button>
                  </div>
                </div>

                {/* Service Items List */}
                {formData.serviceItems.length > 0 && (
                  <div className="bg-white rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Added Items
                    </h3>
                    <div className="space-y-3">
                      {formData.serviceItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {item.itemName}
                            </p>
                            <p className="text-sm text-gray-600">
                              ₹{item.itemCost.toFixed(2)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeServiceItem(item.id)}
                            className="text-red-600 hover:text-red-800 transition duration-200"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition duration-200 flex items-center gap-2"
                  onClick={handleSubmit}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Bike Information
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default BikeStorepage;
