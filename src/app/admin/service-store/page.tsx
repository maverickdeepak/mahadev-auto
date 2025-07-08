"use client";

import React, { useState, useEffect, Suspense } from "react";
import { createClient } from "@supabase/supabase-js";
import { useSearchParams } from "next/navigation";

import { Plus, Trash2, BarChart3 } from "lucide-react";
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
  IndianRupee,
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
  // Payment tracking fields
  amountPaid?: number;
  pendingAmount?: number;
  paymentHistory?: Array<{
    id: string;
    amount: number;
    date: string;
    notes?: string;
    paymentMethod?: string;
  }>;
}

const ServicePageContent = () => {
  const { user, signOut } = useAuth();
  const searchParams = useSearchParams();
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

  // New state for adding service items to existing services
  const [newItem, setNewItem] = useState({ itemName: "", itemCost: 0 });
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string>("");
  const [dialogType, setDialogType] = useState<"delivery" | "removeItem">(
    "delivery"
  );

  // Payment tracking state
  const [newPayment, setNewPayment] = useState({
    amount: 0,
    notes: "",
    paymentMethod: "Cash",
  });
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentDialogType, setPaymentDialogType] = useState<
    "delivery" | "removeItem" | "payment"
  >("delivery");

  // Payment method options
  const paymentMethods = [
    "Cash",
    "UPI",
    "Bank Transfer",
    "Credit Card",
    "Debit Card",
    "Cheque",
    "Digital Wallet",
    "Other",
  ];

  // Handle URL parameters for pre-filling bike search
  useEffect(() => {
    const bikeParam = searchParams?.get("bike");
    if (bikeParam) {
      setBikeNumber(bikeParam);
      // Auto-search when bike parameter is present
      setTimeout(() => {
        handleSearch();
      }, 100);
    }
  }, [searchParams]);

  const sendSms = async (searchResult: ServiceRecord) => {
    await fetch("/api/send-notification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: searchResult.phone,
        customerName: searchResult.customerName,
        serviceType: searchResult.serviceType,
        bikeNumber: searchResult.bikeNumber,
        totalCost: searchResult.totalCost,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success("Notification sent to customer!");
          console.log("Notification sent!", data);
        } else {
          toast.error("Notification failed: " + data.error);
          console.error("Notification failed:", data.error);
        }
      })
      .catch((error) => {
        toast.error("Network or server error while sending notification.");
        console.error("Network or server error:", error);
      });
  };
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
          // Handle empty, null, or invalid serviceItems
          if (
            record.serviceItems &&
            typeof record.serviceItems === "string" &&
            record.serviceItems.trim() !== ""
          ) {
            parsedServiceItems = JSON.parse(record.serviceItems);
          } else {
            parsedServiceItems = [];
          }
        } catch (e) {
          console.error(
            "Error parsing serviceItems:",
            e,
            "Raw value:",
            record.serviceItems
          );
          parsedServiceItems = [];
        }

        // Parse paymentHistory from JSON string to array
        let parsedPaymentHistory: Array<{
          id: string;
          amount: number;
          date: string;
          notes?: string;
          paymentMethod?: string;
        }> = [];
        try {
          // Handle empty, null, or invalid paymentHistory
          if (
            record.paymentHistory &&
            typeof record.paymentHistory === "string" &&
            record.paymentHistory.trim() !== ""
          ) {
            parsedPaymentHistory = JSON.parse(record.paymentHistory);
          } else {
            parsedPaymentHistory = [];
          }
        } catch (e) {
          console.error(
            "Error parsing paymentHistory:",
            e,
            "Raw value:",
            record.paymentHistory
          );
          parsedPaymentHistory = [];
        }

        // Auto-calculate pending amount if it's null or incorrect
        const amountPaid = record.amountPaid || 0;
        const totalCost = record.totalCost || 0;
        const calculatedPendingAmount = Math.max(0, totalCost - amountPaid);

        // If pending amount is null or doesn't match calculation, update it
        if (
          record.pendingAmount === null ||
          record.pendingAmount !== calculatedPendingAmount
        ) {
          // Update the database with correct pending amount
          supabase
            .from("bike_records")
            .update({ pendingAmount: calculatedPendingAmount })
            .eq("id", record.id)
            .then(({ error }) => {
              if (error) {
                console.error("Error updating pending amount:", error);
              }
            });
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
          totalCost: totalCost,
          serviceStartDate:
            record.serviceStartDate || new Date().toISOString().split("T")[0],
          deliveryDate:
            record.deliveryDate || new Date().toISOString().split("T")[0],
          serviceStatus: record.serviceStatus || "In Progress",
          amountPaid: amountPaid,
          pendingAmount: calculatedPendingAmount,
          paymentHistory: parsedPaymentHistory,
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
      setDialogType("delivery");
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
    if (pendingStatus === "Delivered" && searchResult) {
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
          .eq("id", searchResult.id);

        if (!error) {
          // Send SMS notification when bike is delivered
          await sendSms(searchResult);

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
              record.id === searchResult.id
                ? {
                    ...record,
                    serviceStatus: "Delivered",
                    deliveryDate: new Date().toISOString(),
                  }
                : record
            )
          );

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

  // Function to add new service item to existing service
  const addServiceItem = async () => {
    if (!searchResult) return;

    if (newItem.itemName.trim() && newItem.itemCost > 0) {
      setIsAddingItem(true);

      try {
        const newServiceItem = {
          id: Date.now().toString(),
          itemName: newItem.itemName,
          itemCost: newItem.itemCost,
        };

        const updatedServiceItems = [
          ...searchResult.serviceItems,
          newServiceItem,
        ];
        const newTotalCost =
          searchResult.serviceCost +
          updatedServiceItems.reduce((sum, item) => sum + item.itemCost, 0);

        // Recalculate pending amount based on new total cost
        const currentAmountPaid = searchResult.amountPaid || 0;
        const newPendingAmount = Math.max(0, newTotalCost - currentAmountPaid);

        const { error } = await supabase
          .from("bike_records")
          .update({
            serviceItems: JSON.stringify(updatedServiceItems),
            totalCost: newTotalCost,
            pendingAmount: newPendingAmount,
          })
          .eq("id", searchResult.id);

        if (!error) {
          // Update local state
          const updatedRecord = {
            ...searchResult,
            serviceItems: updatedServiceItems,
            totalCost: newTotalCost,
            pendingAmount: newPendingAmount,
          };

          setSearchResult(updatedRecord);
          setSelectedRecord(updatedRecord);

          // Update all records to reflect the change
          setAllRecords((prevRecords) =>
            prevRecords.map((record) =>
              record.id === searchResult.id ? updatedRecord : record
            )
          );

          setNewItem({ itemName: "", itemCost: 0 });
          setShowAddItemForm(false);
          toast.success(
            `Added ${newItem.itemName} - ₹${newItem.itemCost.toFixed(2)}`
          );
        } else {
          toast.error("Error adding service item. Please try again.");
        }
      } catch (error) {
        console.error("Error adding service item:", error);
        toast.error("Error adding service item. Please try again.");
      } finally {
        setIsAddingItem(false);
      }
    } else {
      toast.error("Please enter both item name and cost");
    }
  };

  // Function to remove service item from existing service
  const removeServiceItem = (id: string) => {
    setItemToRemove(id);
    setDialogType("removeItem");
    setShowConfirmDialog(true);
  };

  const handleConfirmRemoveItem = async () => {
    if (!searchResult || !itemToRemove) return;

    setIsAddingItem(true);

    try {
      const updatedServiceItems = searchResult.serviceItems.filter(
        (item) => item.id !== itemToRemove
      );
      const newTotalCost =
        searchResult.serviceCost +
        updatedServiceItems.reduce((sum, item) => sum + item.itemCost, 0);

      // Recalculate pending amount based on new total cost
      const currentAmountPaid = searchResult.amountPaid || 0;
      const newPendingAmount = Math.max(0, newTotalCost - currentAmountPaid);

      const { error } = await supabase
        .from("bike_records")
        .update({
          serviceItems: JSON.stringify(updatedServiceItems),
          totalCost: newTotalCost,
          pendingAmount: newPendingAmount,
        })
        .eq("id", searchResult.id);

      if (!error) {
        // Update local state
        const updatedRecord = {
          ...searchResult,
          serviceItems: updatedServiceItems,
          totalCost: newTotalCost,
          pendingAmount: newPendingAmount,
        };

        setSearchResult(updatedRecord);
        setSelectedRecord(updatedRecord);

        // Update all records to reflect the change
        setAllRecords((prevRecords) =>
          prevRecords.map((record) =>
            record.id === searchResult.id ? updatedRecord : record
          )
        );

        toast.success("Service item removed successfully");
      } else {
        toast.error("Error removing service item. Please try again.");
      }
    } catch (error) {
      console.error("Error removing service item:", error);
      toast.error("Error removing service item. Please try again.");
    } finally {
      setIsAddingItem(false);
      setItemToRemove("");
      setShowConfirmDialog(false);
    }
  };

  // Combined confirm handler for both delivery and item removal
  const handlePaymentConfirmation = async () => {
    console.log(
      "handlePaymentConfirmation called with paymentDialogType:",
      paymentDialogType
    );

    if (paymentDialogType === "payment") {
      // User confirmed delivery with pending payment
      console.log(
        "Processing delivery with pending payment for service:",
        searchResult?.id
      );
      if (!searchResult) return;

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
          .eq("id", searchResult.id);

        if (!error) {
          // Send SMS notification when bike is delivered (even with pending payment)
          await sendSms(searchResult);

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
              record.id === searchResult.id
                ? {
                    ...record,
                    serviceStatus: "Delivered",
                    deliveryDate: new Date().toISOString(),
                  }
                : record
            )
          );

          toast.success(
            `Service delivered with pending payment! Delivery date updated to ${formatDateTime(
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
        setPaymentDialogType("delivery");
      }
    } else if (paymentDialogType === "delivery") {
      await handleConfirmDelivery();
    } else if (paymentDialogType === "removeItem") {
      await handleConfirmRemoveItem();
    }
  };

  // Payment management functions
  const addPayment = async () => {
    if (!searchResult || newPayment.amount <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }

    setIsAddingPayment(true);

    try {
      const currentAmountPaid = searchResult.amountPaid || 0;
      const newAmountPaid = currentAmountPaid + newPayment.amount;
      const newPendingAmount = Math.max(
        0,
        searchResult.totalCost - newAmountPaid
      );

      const newPaymentRecord = {
        id: Date.now().toString(),
        amount: newPayment.amount,
        date: new Date().toISOString(),
        notes: newPayment.notes || "",
        paymentMethod: newPayment.paymentMethod,
      };

      const currentPaymentHistory = searchResult.paymentHistory || [];
      const updatedPaymentHistory = [
        ...currentPaymentHistory,
        newPaymentRecord,
      ];

      const { error } = await supabase
        .from("bike_records")
        .update({
          amountPaid: newAmountPaid,
          pendingAmount: newPendingAmount,
          paymentHistory: JSON.stringify(updatedPaymentHistory),
        })
        .eq("id", searchResult.id);

      if (!error) {
        // Update local state
        const updatedRecord = {
          ...searchResult,
          amountPaid: newAmountPaid,
          pendingAmount: newPendingAmount,
          paymentHistory: updatedPaymentHistory,
        };

        setSearchResult(updatedRecord);
        setSelectedRecord(updatedRecord);

        // Update all records to reflect the change
        setAllRecords((prevRecords) =>
          prevRecords.map((record) =>
            record.id === searchResult.id ? updatedRecord : record
          )
        );

        setNewPayment({ amount: 0, notes: "", paymentMethod: "Cash" });
        setShowPaymentForm(false);
        toast.success(
          `Payment of ₹${newPayment.amount.toFixed(2)} recorded successfully`
        );
      } else {
        toast.error("Error recording payment. Please try again.");
      }
    } catch (error) {
      console.error("Error recording payment:", error);
      toast.error("Error recording payment. Please try again.");
    } finally {
      setIsAddingPayment(false);
    }
  };

  const updatePaymentStatus = async () => {
    // notificationapi.init(notificationClientId, notificationClientSecret);

    // notificationapi
    //   .send({
    //     type: "sms_notification",
    //     to: {
    //       number: `+91${searchResult!.phone}`,
    //     },
    //     sms: {
    //       message: `Dear ${searchResult!.customerName}, your ${
    //         searchResult!.serviceType
    //       } service for bike ${
    //         searchResult!.bikeNumber
    //       } has been completed and is delivered. Thank you for choosing Mahadev Automobiles!`,
    //     },
    //   })
    //   .then((res) => console.log("SMS notification sent successfully", res))
    //   .catch((error) => {
    //     console.error("Error sending SMS notification:", error);
    //   });

    if (!searchResult) return;

    // Check if there's pending amount
    const pendingAmount = searchResult.pendingAmount || 0;
    console.log("Pending amount:", pendingAmount);
    if (pendingAmount > 0) {
      console.log("Setting payment dialog type to 'payment'");
      setPaymentDialogType("payment");
      setShowConfirmDialog(true);
      return;
    }

    // If no pending amount, proceed with delivery
    console.log("No pending amount, proceeding with delivery");
    await handleConfirmDelivery();
  };

  const recalculatePayment = async () => {
    if (!searchResult) return;

    setIsUpdatingStatus(true);

    try {
      // Recalculate pending amount
      const totalCost = searchResult.totalCost || 0;
      const amountPaid = searchResult.amountPaid || 0;
      const pendingAmount = Math.max(0, totalCost - amountPaid);

      // Update the database
      const { error } = await supabase
        .from("bike_records")
        .update({
          pendingAmount: pendingAmount,
        })
        .eq("id", searchResult.id);

      if (!error) {
        // Update local state
        const updatedRecord = {
          ...searchResult,
          pendingAmount: pendingAmount,
        };

        setSearchResult(updatedRecord);
        setSelectedRecord(updatedRecord);

        // Update all records to reflect the change
        setAllRecords((prevRecords) =>
          prevRecords.map((record) =>
            record.id === searchResult.id ? updatedRecord : record
          )
        );

        toast.success("Payment status recalculated successfully");
      } else {
        toast.error("Error recalculating payment status. Please try again.");
      }
    } catch (error) {
      console.error("Error recalculating payment status:", error);
      toast.error("Error recalculating payment status. Please try again.");
    } finally {
      setIsUpdatingStatus(false);
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
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/admin/bike-store"
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
                  >
                    <Plus className="h-4 w-4" />
                    Add New Bike Record
                  </Link>
                  <Link
                    href="/admin/analytics"
                    className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
                  >
                    <BarChart3 className="h-4 w-4" />
                    View Analytics
                  </Link>
                  <Link
                    href="/admin/pending-payments"
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
                  >
                    <IndianRupee className="h-4 w-4" />
                    Pending Payments
                  </Link>
                </div>
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
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <IndianRupee className="h-5 w-5 text-indigo-600" />
                        Service Items & Costs
                      </h3>
                      {searchResult.serviceStatus !== "Delivered" && (
                        <button
                          onClick={() => setShowAddItemForm(!showAddItemForm)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition duration-200 flex items-center gap-1"
                        >
                          <Plus className="h-4 w-4" />
                          {showAddItemForm ? "Cancel" : "Add Item"}
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Service Cost
                        </label>
                        <p className="text-gray-900 font-medium">
                          ₹{searchResult.serviceCost.toFixed(2)}
                        </p>
                      </div>

                      {/* Add New Item Form */}
                      {showAddItemForm &&
                        searchResult.serviceStatus !== "Delivered" && (
                          <div className="bg-white rounded-lg p-4 border-2 border-indigo-200">
                            <h4 className="font-medium text-gray-900 mb-3">
                              Add New Service Item
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <input
                                  type="text"
                                  placeholder="Enter item name"
                                  value={newItem.itemName}
                                  onChange={(e) =>
                                    setNewItem((prev) => ({
                                      ...prev,
                                      itemName: e.target.value,
                                    }))
                                  }
                                  className="block w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 bg-white text-gray-900 placeholder-gray-500 text-sm"
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
                                  className="block w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 bg-white text-gray-900 placeholder-gray-500 text-sm"
                                />
                              </div>
                              <div>
                                <button
                                  type="button"
                                  onClick={addServiceItem}
                                  disabled={
                                    isAddingItem ||
                                    !newItem.itemName.trim() ||
                                    newItem.itemCost <= 0
                                  }
                                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-lg font-medium transition duration-200 flex items-center justify-center gap-1 text-sm"
                                >
                                  {isAddingItem ? (
                                    <>
                                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                      Adding...
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="h-3 w-3" />
                                      Add Item
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                      {searchResult.serviceItems.length > 0 && (
                        <div>
                          <label className="text-sm font-medium text-gray-600 mb-2 block">
                            Service Items
                          </label>
                          <div className="space-y-2">
                            {searchResult.serviceItems.map((item) => (
                              <div
                                key={item.id}
                                className="flex justify-between items-center bg-white rounded-lg p-3 border border-gray-200"
                              >
                                <div className="flex-1">
                                  <span className="text-gray-900 font-medium">
                                    {item.itemName}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-gray-900 font-medium">
                                    ₹{item.itemCost.toFixed(2)}
                                  </span>
                                  {searchResult.serviceStatus !==
                                    "Delivered" && (
                                    <button
                                      type="button"
                                      onClick={() => removeServiceItem(item.id)}
                                      className="text-red-600 hover:text-red-800 transition duration-200"
                                      title="Remove item"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
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

              {/* Payment Tracking Section */}
              <div className="bg-emerald-50 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <IndianRupee className="h-5 w-5 text-emerald-600" />
                    Payment Tracking
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowPaymentForm(!showPaymentForm)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition duration-200 flex items-center gap-1 ${
                        searchResult.serviceStatus === "Delivered"
                          ? "bg-orange-600 hover:bg-orange-700 text-white"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white"
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                      {showPaymentForm
                        ? "Cancel"
                        : searchResult.serviceStatus === "Delivered"
                        ? "Record Payment"
                        : "Add Payment"}
                    </button>
                    <button
                      onClick={recalculatePayment}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition duration-200 flex items-center gap-1"
                      title="Recalculate payment status"
                    >
                      <IndianRupee className="h-4 w-4" />
                      Recalculate
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Payment Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-3 border border-emerald-200">
                      <label className="text-sm font-medium text-gray-600">
                        Total Bill
                      </label>
                      <p className="text-lg font-bold text-gray-900">
                        ₹{searchResult.totalCost.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-emerald-200">
                      <label className="text-sm font-medium text-gray-600">
                        Amount Paid
                      </label>
                      <p className="text-lg font-bold text-green-600">
                        ₹{(searchResult.amountPaid || 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-emerald-200">
                      <label className="text-sm font-medium text-gray-600">
                        Pending Amount
                      </label>
                      <p
                        className={`text-lg font-bold ${
                          (searchResult.pendingAmount || 0) > 0
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        ₹{(searchResult.pendingAmount || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Auto-calculation info */}
                  <div className="text-xs text-gray-500 text-center">
                    💡 Pending amount is automatically calculated: Total Bill -
                    Amount Paid
                  </div>

                  {/* Add Payment Form */}
                  {showPaymentForm && (
                    <div className="bg-white rounded-lg p-4 border-2 border-emerald-200">
                      <h4 className="font-medium text-gray-900 mb-3">
                        Record New Payment
                        {searchResult.serviceStatus === "Delivered" && (
                          <span className="ml-2 text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                            Post-Delivery Payment
                          </span>
                        )}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <input
                            type="number"
                            placeholder="Payment Amount (₹)"
                            step="0.01"
                            value={newPayment.amount}
                            onChange={(e) =>
                              setNewPayment((prev) => ({
                                ...prev,
                                amount: parseFloat(e.target.value) || 0,
                              }))
                            }
                            className="block w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200 bg-white text-gray-900 placeholder-gray-500 text-sm"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Notes (optional)"
                            value={newPayment.notes}
                            onChange={(e) =>
                              setNewPayment((prev) => ({
                                ...prev,
                                notes: e.target.value,
                              }))
                            }
                            className="block w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200 bg-white text-gray-900 placeholder-gray-500 text-sm"
                          />
                        </div>
                        <div>
                          <select
                            value={newPayment.paymentMethod}
                            onChange={(e) =>
                              setNewPayment((prev) => ({
                                ...prev,
                                paymentMethod: e.target.value,
                              }))
                            }
                            className="block w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200 bg-white text-gray-900 placeholder-gray-500 text-sm"
                          >
                            {paymentMethods.map((method) => (
                              <option key={method} value={method}>
                                {method}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={addPayment}
                            disabled={isAddingPayment || newPayment.amount <= 0}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-lg font-medium transition duration-200 flex items-center justify-center gap-1 text-sm"
                          >
                            {isAddingPayment ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                Recording...
                              </>
                            ) : (
                              <>
                                <Plus className="h-3 w-3" />
                                Record Payment
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment History */}
                  {searchResult.paymentHistory &&
                    searchResult.paymentHistory.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-600 mb-2 block">
                          Payment History
                        </label>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {Array.isArray(searchResult.paymentHistory) &&
                            searchResult.paymentHistory.map((payment) => {
                              // Check if payment was made after delivery
                              const paymentDate = new Date(payment.date);
                              const deliveryDate = searchResult.deliveryDate
                                ? new Date(searchResult.deliveryDate)
                                : null;
                              const isPostDeliveryPayment =
                                deliveryDate && paymentDate > deliveryDate;

                              return (
                                <div
                                  key={payment.id}
                                  className="flex justify-between items-center bg-white rounded-lg p-3 border border-emerald-200"
                                >
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-gray-900 font-medium">
                                        ₹{payment.amount.toFixed(2)}
                                      </span>
                                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                        {payment.paymentMethod || "Cash"}
                                      </span>
                                      {isPostDeliveryPayment && (
                                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                                          Post-Delivery
                                        </span>
                                      )}
                                      {payment.notes && (
                                        <span className="text-sm text-gray-600">
                                          - {payment.notes}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-500">
                                      {formatDateTime(payment.date)}
                                    </p>
                                  </div>
                                  <span className="text-green-600 font-medium">
                                    ✓ Paid
                                  </span>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}

                  {/* Payment Status Alert */}
                  {(searchResult.pendingAmount || 0) > 0 && (
                    <div
                      className={`rounded-lg p-3 ${
                        searchResult.serviceStatus === "Delivered"
                          ? "bg-orange-50 border border-orange-200"
                          : "bg-yellow-50 border border-yellow-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            searchResult.serviceStatus === "Delivered"
                              ? "text-orange-600"
                              : "text-yellow-600"
                          }
                        >
                          {searchResult.serviceStatus === "Delivered"
                            ? "💰"
                            : "⚠️"}
                        </span>
                        <span
                          className={`text-sm ${
                            searchResult.serviceStatus === "Delivered"
                              ? "text-orange-800"
                              : "text-yellow-800"
                          }`}
                        >
                          <strong>
                            {searchResult.serviceStatus === "Delivered"
                              ? "Outstanding Balance:"
                              : "Pending Payment:"}
                          </strong>{" "}
                          ₹{(searchResult.pendingAmount || 0).toFixed(2)}{" "}
                          remaining
                          {searchResult.serviceStatus === "Delivered" && (
                            <span className="block text-xs mt-1">
                              Service delivered on{" "}
                              {formatDateTime(searchResult.deliveryDate)}.
                              Customer can pay remaining amount anytime.
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {searchResult && (
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
                onClick={updatePaymentStatus}
                disabled={
                  isUpdatingStatus || searchResult.serviceStatus === "Delivered"
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
          onConfirm={handlePaymentConfirmation}
          title={
            paymentDialogType === "payment"
              ? "Confirm Delivery with Pending Payment"
              : "Confirm Action"
          }
          message={
            paymentDialogType === "payment"
              ? `This service has a pending payment of ₹${(
                  searchResult?.pendingAmount || 0
                ).toFixed(
                  2
                )}. Are you sure you want to mark it as delivered? You can still record payments later.`
              : `Are you sure you want to ${
                  dialogType === "delivery"
                    ? "mark this service as delivered"
                    : "remove this item"
                }? This action cannot be undone.`
          }
          confirmText={
            paymentDialogType === "payment"
              ? "Deliver with Pending Payment"
              : "Confirm"
          }
          cancelText="Cancel"
          type="warning"
        />
      </div>
    </ProtectedRoute>
  );
};

const ServicePage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ServicePageContent />
    </Suspense>
  );
};

export default ServicePage;
