"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../contexts/AuthContext";
import { IndianRupee, Bike, User, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface ServiceRecord {
  id: number;
  bikeNumber: string;
  customerName: string;
  pendingAmount: number;
  serviceType: string;
}

const PendingPaymentsPage = () => {
  const { signOut } = useAuth();
  const router = useRouter();
  const [pendingRecords, setPendingRecords] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("bike_records")
        .select("id, bikeNumber, userName, pendingAmount, serviceType")
        .gt("pendingAmount", 0)
        .order("pendingAmount", { ascending: false })
        .limit(1000); // Increase limit to get more records
      if (error) {
        toast.error("Error fetching pending payments");
        setLoading(false);
        return;
      }
      setPendingRecords(
        (data || []).map((r) => ({
          id: r.id,
          bikeNumber: r.bikeNumber,
          customerName: r.userName,
          pendingAmount: r.pendingAmount,
          serviceType: r.serviceType,
        }))
      );
      setLoading(false);
    };
    fetchPending();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button
                onClick={() => router.push("/admin/service-store")}
                className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Service Store</span>
                <span className="sm:hidden">Back</span>
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Pending Payments
              </h1>
            </div>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200"
            >
              Logout
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Bikes with Pending Amount
            </h2>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : pendingRecords.length === 0 ? (
              <div className="text-center py-8 text-green-600 font-semibold">
                No pending payments! 🎉
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bike Number
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer Name
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service Type
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pending Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {pendingRecords.map((rec) => (
                        <tr
                          key={rec.id}
                          className="hover:bg-blue-50 transition"
                        >
                          <td className="px-4 py-2">
                            <button
                              onClick={() =>
                                router.push(
                                  `/admin/service-store?bike=${rec.bikeNumber}`
                                )
                              }
                              className="text-blue-700 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <Bike className="h-4 w-4" />
                              {rec.bikeNumber}
                            </button>
                          </td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() =>
                                router.push(
                                  `/admin/service-store?bike=${rec.bikeNumber}`
                                )
                              }
                              className="text-indigo-700 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <User className="h-4 w-4" />
                              {rec.customerName}
                            </button>
                          </td>
                          <td className="px-4 py-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                              {rec.serviceType}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-red-600 font-bold flex items-center gap-1">
                            <IndianRupee className="h-4 w-4" />
                            {rec.pendingAmount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-4">
                  {pendingRecords.map((rec) => (
                    <div
                      key={rec.id}
                      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <button
                            onClick={() =>
                              router.push(
                                `/admin/service-store?bike=${rec.bikeNumber}`
                              )
                            }
                            className="text-blue-700 hover:underline font-semibold flex items-center gap-1 cursor-pointer text-lg"
                          >
                            <Bike className="h-5 w-5" />
                            {rec.bikeNumber}
                          </button>
                        </div>
                        <div className="text-right">
                          <div className="text-red-600 font-bold text-lg flex items-center gap-1 justify-end">
                            <IndianRupee className="h-5 w-5" />
                            {rec.pendingAmount.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <button
                            onClick={() =>
                              router.push(
                                `/admin/service-store?bike=${rec.bikeNumber}`
                              )
                            }
                            className="text-indigo-700 hover:underline font-medium cursor-pointer"
                          >
                            {rec.customerName}
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-sm">
                            Service:
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {rec.serviceType}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default PendingPaymentsPage;
