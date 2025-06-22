"use client";

import React from "react";

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface SimpleChartProps {
  data: ChartData[];
  type?: "bar" | "pie" | "line";
}

const SimpleChart: React.FC<SimpleChartProps> = ({ data, type = "bar" }) => {
  const maxValue = Math.max(...data.map((d) => d.value));
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-orange-500",
  ];

  if (type === "bar") {
    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                {item.label}
              </span>
              <span className="text-sm font-bold text-gray-900">
                {item.value}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${colors[index % colors.length]}`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "pie") {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  colors[index % colors.length]
                }`}
              ></div>
              <span className="text-sm font-medium text-gray-700">
                {item.label}
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-gray-900">
                {item.value}
              </span>
              <span className="text-xs text-gray-500 ml-1">
                ({((item.value / total) * 100).toFixed(1)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.label} className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            {item.label}
          </span>
          <span className="text-sm font-bold text-gray-900">{item.value}</span>
        </div>
      ))}
    </div>
  );
};

export default SimpleChart;
