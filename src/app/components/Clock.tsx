"use client";

import { useState, useEffect } from "react";
import { formatTime } from "../utils/dateUtils";

export default function Clock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-sm text-gray-500 font-mono">
      {formatTime(currentTime.toISOString())}
    </div>
  );
}
