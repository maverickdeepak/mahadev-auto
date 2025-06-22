"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
import { formatDateTime } from "../../utils/dateUtils";
import Clock from "../../components/Clock";
import {
  processAnalyticsData,
  ServiceRecord,
  AnalyticsData,
} from "../../utils/analyticsUtils";
import { LucideIcon } from "lucide-react";

import {
  BarChart3,
  Users,
  IndianRupee,
  Bike,
  Wrench,
  Activity,
  Target,
  Award,
  LogOut,
  RefreshCw,
  Search,
} from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const AnalyticsPage = () => {
  const { user, signOut } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">(
    "30d"
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAnalyticsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const endDate = new Date();
      const startDate = new Date();

      switch (timeRange) {
        case "7d":
          startDate.setDate(endDate.getDate() - 7);
          break;
        case "30d":
          startDate.setDate(endDate.getDate() - 30);
          break;
        case "90d":
          startDate.setDate(endDate.getDate() - 90);
          break;
        case "1y":
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }

      const { data: records, error } = await supabase
        .from("bike_records")
        .select("*")
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString())
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching records:", error);
        toast.error("Error loading analytics data");
        return;
      }

      if (!records) {
        toast.error("No data available");
        return;
      }

      // Process the data using the analytics utils function
      const processedData = processAnalyticsData(records as ServiceRecord[]);
      setAnalyticsData(processedData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Error loading analytics data");
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAnalyticsData();
    setIsRefreshing(false);
    toast.success("Analytics data refreshed");
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    subtitle,
  }: {
    title: string;
    value: string | number;
    icon: LucideIcon;
    color: string;
    subtitle?: string;
  }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const ChartCard = ({
    title,
    children,
    className = "",
  }: {
    title: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 ${className}`}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex-1"></div>
              <div className="flex justify-center flex-1">
                <div className="bg-blue-600 p-3 rounded-full">
                  <BarChart3 className="h-8 w-8 text-white" />
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
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Comprehensive insights into your bike service business
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

          {/* Controls */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Time Range
                </h2>
                <select
                  value={timeRange}
                  onChange={(e) =>
                    setTimeRange(e.target.value as "7d" | "30d" | "90d" | "1y")
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                  <option value="1y">Last Year</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  {isRefreshing ? "Refreshing..." : "Refresh"}
                </button>
                <Link
                  href="/admin/service-store"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200"
                >
                  <Bike className="h-4 w-4" />
                  Service Store
                </Link>
              </div>
            </div>
          </div>

          {analyticsData && (
            <>
              {/* Overview Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Total Services"
                  value={analyticsData.overview.totalServices}
                  icon={Wrench}
                  color="bg-blue-500"
                  subtitle={`${timeRange} period`}
                />
                <StatCard
                  title="Total Revenue"
                  value={`₹${analyticsData.overview.totalRevenue.toLocaleString()}`}
                  icon={IndianRupee}
                  color="bg-green-500"
                  subtitle={`₹${(
                    analyticsData.overview.totalRevenue /
                    analyticsData.overview.totalServices
                  ).toFixed(0)} avg/service`}
                />
                <StatCard
                  title="Total Customers"
                  value={analyticsData.overview.totalCustomers}
                  icon={Users}
                  color="bg-purple-500"
                  subtitle={`${analyticsData.customerAnalytics.repeatCustomers} repeat customers`}
                />
                <StatCard
                  title="Customer Retention"
                  value={`${analyticsData.customerAnalytics.customerRetentionRate.toFixed(
                    1
                  )}%`}
                  icon={Users}
                  color="bg-orange-500"
                  subtitle={`${analyticsData.customerAnalytics.repeatCustomers} repeat customers`}
                />
              </div>

              {/* Service Status Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Pending
                      </p>
                      <p className="text-xl font-bold text-yellow-600">
                        {
                          analyticsData.performanceMetrics.statusDistribution
                            .pending
                        }
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-yellow-100">
                      <Activity className="h-5 w-5 text-yellow-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        In Progress
                      </p>
                      <p className="text-xl font-bold text-blue-600">
                        {
                          analyticsData.performanceMetrics.statusDistribution
                            .inProgress
                        }
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Wrench className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Completed
                      </p>
                      <p className="text-xl font-bold text-green-600">
                        {
                          analyticsData.performanceMetrics.statusDistribution
                            .done
                        }
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-green-100">
                      <Target className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Delivered
                      </p>
                      <p className="text-xl font-bold text-purple-600">
                        {
                          analyticsData.performanceMetrics.statusDistribution
                            .delivered
                        }
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-purple-100">
                      <Award className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <ChartCard title="Service Type Breakdown">
                  <div className="space-y-3">
                    {analyticsData.serviceAnalytics.serviceTypeBreakdown.map(
                      (service, index) => (
                        <div
                          key={service.serviceType}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                index === 0
                                  ? "bg-blue-500"
                                  : index === 1
                                  ? "bg-green-500"
                                  : index === 2
                                  ? "bg-yellow-500"
                                  : index === 3
                                  ? "bg-purple-500"
                                  : "bg-gray-500"
                              }`}
                            ></div>
                            <span className="text-sm font-medium text-gray-700">
                              {service.serviceType}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">
                              {service.count}
                            </p>
                            <p className="text-xs text-gray-500">
                              {service.percentage.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </ChartCard>

                <ChartCard title="Top Customers">
                  <div className="space-y-3">
                    {analyticsData.customerAnalytics.topCustomers.map(
                      (customer) => (
                        <div
                          key={customer.bikeNumber}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {customer.customerName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {customer.bikeNumber} • {customer.visits} visits
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">
                              ₹{customer.totalSpent.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDateTime(customer.lastVisit)}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </ChartCard>
              </div>

              {/* Revenue Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <ChartCard title="Revenue Overview">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-600">
                          Total Revenue
                        </p>
                        <p className="text-xl font-bold text-green-600">
                          ₹
                          {analyticsData.overview.totalRevenue.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-600">
                          Avg Order Value
                        </p>
                        <p className="text-xl font-bold text-blue-600">
                          ₹
                          {(
                            analyticsData.overview.totalRevenue /
                            analyticsData.overview.totalServices
                          ).toFixed(0)}
                        </p>
                      </div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-600">
                        Payment Status
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-green-600">
                          Paid: ₹
                          {(
                            analyticsData.overview.totalRevenue -
                            analyticsData.overview.totalPendingAmount
                          ).toLocaleString()}
                        </span>
                        <span className="text-sm text-red-600">
                          Pending: ₹
                          {analyticsData.overview.totalPendingAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </ChartCard>

                <ChartCard title="Payment Methods">
                  <div className="space-y-3">
                    {analyticsData?.revenueAnalytics?.paymentMethods?.length >
                    0 ? (
                      analyticsData.revenueAnalytics.paymentMethods.map(
                        (method, index) => (
                          <div
                            key={method.method}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  index === 0
                                    ? "bg-green-500"
                                    : index === 1
                                    ? "bg-blue-500"
                                    : index === 2
                                    ? "bg-purple-500"
                                    : index === 3
                                    ? "bg-yellow-500"
                                    : "bg-gray-500"
                                }`}
                              ></div>
                              <span className="text-sm font-medium text-gray-700">
                                {method.method}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-gray-900">
                                ₹{method.amount.toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-500">
                                {method.count} payments (
                                {method.percentage.toFixed(1)}%)
                              </p>
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-500">
                          No payment data available yet
                        </p>
                      </div>
                    )}

                    {/* Post-Delivery Payments Summary */}
                    {analyticsData?.revenueAnalytics?.postDeliveryPayments && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="bg-orange-50 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-orange-600">💰</span>
                              <span className="text-sm font-medium text-orange-800">
                                Post-Delivery Payments
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-orange-900">
                                ₹
                                {analyticsData.revenueAnalytics.postDeliveryPayments.amount.toLocaleString()}
                              </p>
                              <p className="text-xs text-orange-700">
                                {
                                  analyticsData.revenueAnalytics
                                    .postDeliveryPayments.count
                                }{" "}
                                payments (
                                {analyticsData.revenueAnalytics.postDeliveryPayments.percentage.toFixed(
                                  1
                                )}
                                %)
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ChartCard>
              </div>

              {/* Customer Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <ChartCard title="Customer Insights">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-purple-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-600">
                          Total Customers
                        </p>
                        <p className="text-xl font-bold text-purple-600">
                          {analyticsData.customerAnalytics.totalCustomers}
                        </p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-600">
                          Repeat Customers
                        </p>
                        <p className="text-xl font-bold text-green-600">
                          {analyticsData.customerAnalytics.repeatCustomers}
                        </p>
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-600">
                        Customer Retention Rate
                      </p>
                      <p className="text-xl font-bold text-blue-600">
                        {analyticsData.customerAnalytics.customerRetentionRate.toFixed(
                          1
                        )}
                        %
                      </p>
                    </div>
                  </div>
                </ChartCard>
              </div>
            </>
          )}

          {/* Navigation Links */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/admin/bike-store"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
              >
                <Bike className="h-4 w-4" />
                Add New Bike Record
              </Link>
              <Link
                href="/admin/service-store"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
              >
                <Search className="h-4 w-4" />
                Search Bike Records
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AnalyticsPage;
