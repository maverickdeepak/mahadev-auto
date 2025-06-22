export interface ServiceRecord {
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
  amountPaid?: number;
  pendingAmount?: number;
  paymentHistory?: Array<{
    id: string;
    amount: number;
    date: string;
    notes?: string;
    paymentMethod?: string;
  }>;
  created_at: string;
}

export interface AnalyticsData {
  overview: {
    totalServices: number;
    totalRevenue: number;
    totalCustomers: number;
    averageServiceTime: number;
    pendingServices: number;
    completedServices: number;
    totalPendingAmount: number;
  };
  serviceAnalytics: {
    serviceTypeBreakdown: Array<{
      serviceType: string;
      count: number;
      revenue: number;
      percentage: number;
    }>;
    monthlyServices: Array<{
      month: string;
      count: number;
      revenue: number;
    }>;
  };
  revenueAnalytics: {
    totalRevenue: number;
    averageOrderValue: number;
    revenueByService: Array<{
      serviceType: string;
      revenue: number;
      percentage: number;
    }>;
    paymentStatus: {
      paid: number;
      pending: number;
      total: number;
    };
    paymentMethods: Array<{
      method: string;
      count: number;
      amount: number;
      percentage: number;
    }>;
    postDeliveryPayments: {
      count: number;
      amount: number;
      percentage: number;
    };
  };
  customerAnalytics: {
    totalCustomers: number;
    repeatCustomers: number;
    newCustomers: number;
    customerRetentionRate: number;
    topCustomers: Array<{
      customerName: string;
      bikeNumber: string;
      visits: number;
      totalSpent: number;
      lastVisit: string;
    }>;
  };
  performanceMetrics: {
    averageServiceTime: number;
    onTimeDeliveryRate: number;
    statusDistribution: {
      pending: number;
      inProgress: number;
      done: number;
      delivered: number;
    };
  };
}

export const processAnalyticsData = (
  records: ServiceRecord[]
): AnalyticsData => {
  // Overview calculations
  const totalServices = records.length;
  const totalRevenue = records.reduce(
    (sum, record) => sum + (record.totalCost || 0),
    0
  );
  const uniqueCustomers = new Set(records.map((r) => r.bikeNumber)).size;
  const pendingServices = records.filter(
    (r) => r.serviceStatus === "Pending"
  ).length;
  const completedServices = records.filter(
    (r) => r.serviceStatus === "Delivered"
  ).length;
  const totalPendingAmount = records.reduce(
    (sum, record) => sum + (record.pendingAmount || 0),
    0
  );

  // Calculate average service time
  const deliveredServices = records.filter(
    (r) =>
      r.serviceStatus === "Delivered" && r.serviceStartDate && r.deliveryDate
  );
  const totalServiceTime = deliveredServices.reduce((sum, record) => {
    const start = new Date(record.serviceStartDate);
    const delivery = new Date(record.deliveryDate);
    return sum + (delivery.getTime() - start.getTime()) / (1000 * 60 * 60 * 24); // days
  }, 0);
  const averageServiceTime =
    deliveredServices.length > 0
      ? totalServiceTime / deliveredServices.length
      : 0;

  // Service type breakdown
  const serviceTypeCount = records.reduce((acc, record) => {
    const type = record.serviceType || "Unknown";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const serviceTypeBreakdown = Object.entries(serviceTypeCount)
    .map(([type, count]) => ({
      serviceType: type,
      count,
      revenue: records
        .filter((r) => r.serviceType === type)
        .reduce((sum, r) => sum + (r.totalCost || 0), 0),
      percentage: (count / totalServices) * 100,
    }))
    .sort((a, b) => b.count - a.count);

  // Monthly services
  const monthlyData = records.reduce((acc, record) => {
    const month = new Date(record.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
    if (!acc[month]) {
      acc[month] = { count: 0, revenue: 0 };
    }
    acc[month].count++;
    acc[month].revenue += record.totalCost || 0;
    return acc;
  }, {} as Record<string, { count: number; revenue: number }>);

  const monthlyServices = Object.entries(monthlyData)
    .map(([month, data]) => ({
      month,
      count: data.count,
      revenue: data.revenue,
    }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

  // Revenue analytics
  const averageOrderValue =
    totalServices > 0 ? totalRevenue / totalServices : 0;
  const paidAmount = records.reduce(
    (sum, record) => sum + (record.amountPaid || 0),
    0
  );

  // Payment method analytics
  const paymentMethodData = records.reduce((acc, record) => {
    if (record.paymentHistory && Array.isArray(record.paymentHistory)) {
      record.paymentHistory.forEach((payment) => {
        const method = payment.paymentMethod || "Cash";
        if (!acc[method]) {
          acc[method] = { count: 0, amount: 0 };
        }
        acc[method].count++;
        acc[method].amount += payment.amount;
      });
    }
    return acc;
  }, {} as Record<string, { count: number; amount: number }>);

  const totalPaymentCount = Object.values(paymentMethodData).reduce(
    (sum, data) => sum + data.count,
    0
  );

  const paymentMethods = Object.entries(paymentMethodData)
    .map(([method, data]) => ({
      method,
      count: data.count,
      amount: data.amount,
      percentage:
        totalPaymentCount > 0 ? (data.count / totalPaymentCount) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  // Post-delivery payment analytics
  const postDeliveryPayments = records.reduce(
    (acc, record) => {
      if (
        record.paymentHistory &&
        Array.isArray(record.paymentHistory) &&
        record.deliveryDate
      ) {
        const deliveryDate = new Date(record.deliveryDate);
        record.paymentHistory.forEach((payment) => {
          const paymentDate = new Date(payment.date);
          if (paymentDate > deliveryDate) {
            acc.count++;
            acc.amount += payment.amount;
          }
        });
      }
      return acc;
    },
    { count: 0, amount: 0 }
  );

  const postDeliveryPercentage =
    totalPaymentCount > 0
      ? (postDeliveryPayments.count / totalPaymentCount) * 100
      : 0;

  // Customer analytics
  const customerVisits = records.reduce(
    (acc, record) => {
      const bikeNumber = record.bikeNumber;
      if (!acc[bikeNumber]) {
        acc[bikeNumber] = {
          customerName: record.customerName,
          bikeNumber,
          visits: 0,
          totalSpent: 0,
          lastVisit: record.created_at,
        };
      }
      acc[bikeNumber].visits++;
      acc[bikeNumber].totalSpent += record.totalCost || 0;
      return acc;
    },
    {} as Record<
      string,
      {
        customerName: string;
        bikeNumber: string;
        visits: number;
        totalSpent: number;
        lastVisit: string;
      }
    >
  );

  const repeatCustomers = Object.values(customerVisits).filter(
    (customer) => customer.visits > 1
  ).length;
  const customerRetentionRate =
    uniqueCustomers > 0 ? (repeatCustomers / uniqueCustomers) * 100 : 0;

  const topCustomers = Object.values(customerVisits)
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

  // Performance metrics
  const statusDistribution = {
    pending: records.filter((r) => r.serviceStatus === "Pending").length,
    inProgress: records.filter((r) => r.serviceStatus === "In Progress").length,
    done: records.filter((r) => r.serviceStatus === "Done").length,
    delivered: records.filter((r) => r.serviceStatus === "Delivered").length,
  };

  const onTimeDeliveries = deliveredServices.filter((record) => {
    const delivery = new Date(record.deliveryDate);
    const expected = new Date(
      record.estimatedCompletion || record.deliveryDate
    );
    return delivery <= expected;
  }).length;

  const onTimeDeliveryRate =
    deliveredServices.length > 0
      ? (onTimeDeliveries / deliveredServices.length) * 100
      : 0;

  return {
    overview: {
      totalServices,
      totalRevenue,
      totalCustomers: uniqueCustomers,
      averageServiceTime,
      pendingServices,
      completedServices,
      totalPendingAmount,
    },
    serviceAnalytics: {
      serviceTypeBreakdown,
      monthlyServices,
    },
    revenueAnalytics: {
      totalRevenue,
      averageOrderValue,
      revenueByService: serviceTypeBreakdown,
      paymentStatus: {
        paid: paidAmount,
        pending: totalPendingAmount,
        total: totalRevenue,
      },
      paymentMethods,
      postDeliveryPayments: {
        count: postDeliveryPayments.count,
        amount: postDeliveryPayments.amount,
        percentage: postDeliveryPercentage,
      },
    },
    customerAnalytics: {
      totalCustomers: uniqueCustomers,
      repeatCustomers,
      newCustomers: uniqueCustomers - repeatCustomers,
      customerRetentionRate,
      topCustomers,
    },
    performanceMetrics: {
      averageServiceTime,
      onTimeDeliveryRate,
      statusDistribution,
    },
  };
};

export const getDateRange = (timeRange: "7d" | "30d" | "90d" | "1y") => {
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

  return { startDate, endDate };
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPercentage = (value: number) => {
  return `${value.toFixed(1)}%`;
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "text-yellow-600 bg-yellow-100";
    case "In Progress":
      return "text-blue-600 bg-blue-100";
    case "Done":
      return "text-green-600 bg-green-100";
    case "Delivered":
      return "text-purple-600 bg-purple-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};
