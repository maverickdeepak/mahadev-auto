"use client";

import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Plus } from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
import { formatDateTime } from "../../utils/dateUtils";
import Clock from "../../components/Clock";
import ConfirmDialog from "../../components/ConfirmDialog";
// import { sendMockSMS } from "../../utils/smsUtils";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

import {
  Search,
  Bike,
  Wrench,
  Clock as LucideClock,
  User,
  Phone,
  MapPin,
  DollarSign,
  LogOut,
} from "lucide-react";

interface ServiceRecord {
  id: number;
  bikeNumber: string;
  customerName: string;
  phone: string;
  bikeModel: string;
  serviceType: string;
  status: string;
  dropDate: string;
  estimatedCompletion: string;
  address: string;
  serviceCost: number;
  serviceItems: Array<{
    id: string;
    itemName: string;
    itemCost: number;
  }>;
  totalCost: number;
  serviceStartDate: string;
  deliveryDate: string;
  serviceStatus: string;
}

const ServicePage = () => {
  const { user, signOut } = useAuth();
  const [bikeNumber, setBikeNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<ServiceRecord | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [allRecords, setAllRecords] = useState<ServiceRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<ServiceRecord | null>(
    null
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string>("");

  const handleSearch = async () => {
    if (!bikeNumber.trim()) return;

    setIsSearching(true);

    // Convert search input to uppercase for consistency
    const searchTerm = bikeNumber.trim().toUpperCase();

    // Check if the search term is exactly 4 digits (last 4 digits search)
    const isLastFourDigits = /^\d{4}$/.test(searchTerm);

    let query = supabase.from("bike_records").select("*");

    if (isLastFourDigits) {
      // Search by last 4 digits using LIKE query
      query = query.ilike("bikeNumber", `%${searchTerm}`);
    } else {
      // Search by exact bike number
      query = query.eq("bikeNumber", searchTerm);
    }

    // Order by created_at descending to get most recent records first
    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;
    console.log(data);
    console.log(error);

    if (data && data.length > 0 && !error) {
      const records = data.map((record) => {
        // Parse serviceItems from JSON string to array
        let parsedServiceItems: Array<{
          id: string;
          itemName: string;
          itemCost: number;
        }> = [];
        try {
          parsedServiceItems = JSON.parse(record.serviceItems || "[]");
        } catch (e) {
          console.error("Error parsing serviceItems:", e);
          parsedServiceItems = [];
        }

        return {
          id: record.id,
          bikeNumber: record.bikeNumber,
          customerName: record.userName,
          phone: record.phoneNumber?.toString() || "",
          bikeModel: record.bikeModel || "Not specified",
          serviceType: record.serviceType,
          status: record.status || "In Progress",
          dropDate: record.dropDate || new Date().toISOString().split("T")[0],
          estimatedCompletion:
            record.estimatedCompletion ||
            new Date().toISOString().split("T")[0],
          address: record.address,
          serviceCost: record.serviceCost || 0,
          serviceItems: parsedServiceItems,
          totalCost: record.totalCost || 0,
          serviceStartDate:
            record.serviceStartDate || new Date().toISOString().split("T")[0],
          deliveryDate:
            record.deliveryDate || new Date().toISOString().split("T")[0],
          serviceStatus: record.serviceStatus || "In Progress",
        };
      });

      setAllRecords(records);
      setSelectedRecord(records[0]); // Set the most recent record as selected
      setSearchResult(records[0]);
      toast.success(`Found ${records.length} service record(s)`);
    } else {
      setAllRecords([]);
      setSelectedRecord(null);
      setSearchResult(null);
      toast.error("No service records found for this bike number");
    }

    setIsSearching(false);
  };

  const updateServiceStatus = async (newStatus: string) => {
    if (!searchResult) return;

    // Ask for confirmation when marking as delivered
    if (newStatus === "Delivered") {
      setShowConfirmDialog(true);
      setPendingStatus(newStatus);
      return;
    }

    // For other statuses, update directly
    setIsUpdatingStatus(true);

    try {
      // Prepare update data
      const updateData: { serviceStatus: string; deliveryDate?: string } = {
        serviceStatus: newStatus,
      };

      // If status is being changed to "Delivered", update the delivery date to current date and time
      if (newStatus === "Delivered") {
        updateData.deliveryDate = new Date().toISOString();
      }

      const { error } = await supabase
        .from("bike_records")
        .update(updateData)
        .eq("id", searchResult.id);

      if (!error) {
        // Update local state
        setSearchResult((prev) => {
          if (!prev) return null;

          const updatedRecord = { ...prev, serviceStatus: newStatus };

          // Update delivery date if status is "Delivered"
          if (newStatus === "Delivered") {
            updatedRecord.deliveryDate = new Date().toISOString();
          }

          return updatedRecord;
        });

        // Also update the selected record in the history
        setSelectedRecord((prev) => {
          if (!prev) return null;

          const updatedRecord = { ...prev, serviceStatus: newStatus };

          // Update delivery date if status is "Delivered"
          if (newStatus === "Delivered") {
            updatedRecord.deliveryDate = new Date().toISOString();
          }

          return updatedRecord;
        });

        // Update all records to reflect the change
        setAllRecords((prevRecords) =>
          prevRecords.map((record) =>
            record.id === searchResult.id
              ? {
                  ...record,
                  serviceStatus: newStatus,
                  ...(newStatus === "Delivered" && {
                    deliveryDate: new Date().toISOString(),
                  }),
                }
              : record
          )
        );

        if (newStatus === "Delivered") {
          toast.success(
            `Service delivered! Delivery date updated to ${formatDateTime(
              new Date().toISOString()
            )}`
          );
        } else {
          toast.success(`Service status updated to: ${newStatus}`);
        }
      } else {
        toast.error("Error updating service status. Please try again.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating service status. Please try again.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleConfirmDelivery = async () => {
    if (pendingStatus === "Delivered") {
      setIsUpdatingStatus(true);

      try {
        // Prepare update data
        const updateData: { serviceStatus: string; deliveryDate?: string } = {
          serviceStatus: "Delivered",
          deliveryDate: new Date().toISOString(),
        };

        const { error } = await supabase
          .from("bike_records")
          .update(updateData)
          .eq("id", searchResult!.id);

        if (!error) {
          // Update local state
          setSearchResult((prev) => {
            if (!prev) return null;

            const updatedRecord = {
              ...prev,
              serviceStatus: "Delivered",
              deliveryDate: new Date().toISOString(),
            };
            return updatedRecord;
          });

          // Also update the selected record in the history
          setSelectedRecord((prev) => {
            if (!prev) return null;

            const updatedRecord = {
              ...prev,
              serviceStatus: "Delivered",
              deliveryDate: new Date().toISOString(),
            };
            return updatedRecord;
          });

          // Update all records to reflect the change
          setAllRecords((prevRecords) =>
            prevRecords.map((record) =>
              record.id === searchResult!.id
                ? {
                    ...record,
                    serviceStatus: "Delivered",
                    deliveryDate: new Date().toISOString(),
                  }
                : record
            )
          );

          // Send SMS notification to customer
          // try {
          //   // Use mock SMS for testing (replace with sendDeliverySMS for production)
          //   const smsResult = await sendMockSMS(
          //     searchResult!.phone,
          //     searchResult!.customerName,
          //     searchResult!.bikeNumber,
          //     searchResult!.serviceType
          //   );

          //   if (smsResult.success) {
          //     toast.success(
          //       `Service delivered! SMS notification sent to ${
          //         searchResult!.customerName
          //       }`
          //     );
          //   } else {
          //     toast.success(
          //       `Service delivered! (SMS failed: ${smsResult.message})`
          //     );
          //   }
          // } catch (smsError) {
          //   console.error("SMS sending error:", smsError);
          //   toast.success(`Service delivered! (SMS notification failed)`);
          // }

          toast.success(
            `Service delivered! Delivery date updated to ${formatDateTime(
              new Date().toISOString()
            )}`
          );
        } else {
          toast.error("Error updating service status. Please try again.");
        }
      } catch (error) {
        console.error("Error updating status:", error);
        toast.error("Error updating service status. Please try again.");
      } finally {
        setIsUpdatingStatus(false);
        setShowConfirmDialog(false);
        setPendingStatus("");
      }
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
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
              Service Store
            </h1>
            <p className="text-gray-600 text-lg">
              Find bike service details by bike number
            </p>
            {user && (
              <p className="text-sm text-gray-500 mt-2">
                Logged in as: {user.email}
              </p>
            )}
            <div className="flex justify-center items-center gap-4 mt-2">
              <Clock />
            </div>
          </div>

          {/* Search Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6 sm:mb-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
                Search Bike Service
              </h2>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter bike number or last 4 digits"
                    value={bikeNumber}
                    onChange={(e) => setBikeNumber(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white text-gray-900 placeholder-gray-600"
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
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

              {/* Search Hint */}
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  💡 Tip: You can search by full bike number (e.g., &ldquo;HP
                  17AA 1234&rdquo;) or just the last 4 digits (e.g.,
                  &ldquo;1234&rdquo;)
                </p>
              </div>

              {/* Add New Bike Link */}
              <div className="mt-6 text-center">
                <Link
                  href="/admin/bike-store"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
                >
                  <Plus className="h-4 w-4" />
                  Add New Bike Record
                </Link>
              </div>
            </div>
          </div>

          {/* Results Section */}
          {searchResult && (
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Service Details
              </h2>

              {/* Service History */}
              {allRecords.length > 1 && (
                <div className="mb-6 bg-gray-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Service History ({allRecords.length} visits)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {allRecords.map((record, index) => (
                      <button
                        key={record.id}
                        onClick={() => {
                          setSelectedRecord(record);
                          setSearchResult(record);
                        }}
                        className={`p-3 rounded-lg border-2 transition-all w-full ${
                          selectedRecord?.id === record.id
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                        }`}
                      >
                        <div className="text-left">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-gray-900 text-sm">
                              Visit #{allRecords.length - index}
                            </p>
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
                          <p className="text-sm text-gray-600 mb-1">
                            {record.serviceType}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDateTime(record.serviceStartDate)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
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
                          Service Status
                        </label>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            searchResult.serviceStatus === "Pending"
                              ? "bg-gray-100 text-gray-800"
                              : searchResult.serviceStatus === "In Progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : searchResult.serviceStatus === "Done"
                              ? "bg-green-100 text-green-800"
                              : searchResult.serviceStatus === "Delivered"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {searchResult.serviceStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <LucideClock className="h-5 w-5 text-orange-600" />
                      Service Timeline
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Service Start Date
                        </label>
                        <p className="text-gray-900 font-medium">
                          {formatDateTime(searchResult.serviceStartDate)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          {searchResult.serviceStatus === "Delivered"
                            ? "Actual Delivery Date"
                            : "Expected Delivery Date"}
                        </label>
                        <p className="text-gray-900 font-medium">
                          {formatDateTime(searchResult.deliveryDate)}
                          {searchResult.serviceStatus === "Delivered" && (
                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              ✓ Delivered
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Service Items and Costs */}
                  <div className="bg-indigo-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-indigo-600" />
                      Service Items & Costs
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Service Cost
                        </label>
                        <p className="text-gray-900 font-medium">
                          ₹{searchResult.serviceCost.toFixed(2)}
                        </p>
                      </div>

                      {searchResult.serviceItems.length > 0 && (
                        <div>
                          <label className="text-sm font-medium text-gray-600 mb-2 block">
                            Service Items
                          </label>
                          <div className="space-y-2">
                            {searchResult.serviceItems.map((item) => (
                              <div
                                key={item.id}
                                className="flex justify-between items-center bg-white rounded-lg p-2"
                              >
                                <span className="text-gray-900">
                                  {item.itemName}
                                </span>
                                <span className="text-gray-900 font-medium">
                                  ₹{item.itemCost.toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="border-t pt-3">
                        <label className="text-sm font-medium text-gray-600">
                          Total Cost
                        </label>
                        <p className="text-xl font-bold text-gray-900">
                          ₹{searchResult.totalCost.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button
                  onClick={() => updateServiceStatus("Pending")}
                  disabled={
                    isUpdatingStatus || searchResult.serviceStatus === "Pending"
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold transition duration-200 text-sm sm:text-base"
                >
                  {isUpdatingStatus ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    <>Mark Pending</>
                  )}
                </button>
                <button
                  onClick={() => updateServiceStatus("In Progress")}
                  disabled={
                    isUpdatingStatus ||
                    searchResult.serviceStatus === "In Progress"
                  }
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold transition duration-200 text-sm sm:text-base"
                >
                  {isUpdatingStatus ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    <>Mark In Progress</>
                  )}
                </button>
                <button
                  onClick={() => updateServiceStatus("Done")}
                  disabled={
                    isUpdatingStatus || searchResult.serviceStatus === "Done"
                  }
                  className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold transition duration-200 text-sm sm:text-base"
                >
                  {isUpdatingStatus ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    <>Mark Done</>
                  )}
                </button>
                <button
                  onClick={() => updateServiceStatus("Delivered")}
                  disabled={
                    isUpdatingStatus ||
                    searchResult.serviceStatus === "Delivered"
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold transition duration-200 text-sm sm:text-base"
                >
                  {isUpdatingStatus ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    <>Mark Delivered</>
                  )}
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

        {/* Confirm Dialog */}
        <ConfirmDialog
          isOpen={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          onConfirm={handleConfirmDelivery}
          title="Confirm Delivery"
          message="Are you sure you want to mark this service as delivered? This will update the delivery date to the current date and time."
          confirmText="Mark as Delivered"
          cancelText="Cancel"
          type="warning"
        />
      </div>
    </ProtectedRoute>
  );
};

export default ServicePage;
