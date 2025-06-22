/**
 * Utility functions for date formatting
 */

/**
 * Formats a date string to a readable format
 * @param dateString - The date string to format
 * @returns Formatted date string (e.g., "22 June 2025")
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString; // Return original string if parsing fails
  }
};

/**
 * Formats a date string to include time in AM/PM format
 * @param dateString - The date string to format
 * @returns Formatted date string with time (e.g., "22 June 2025, 10:30 AM")
 */
export const formatDateTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const datePart = date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timePart = date
      .toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .toUpperCase(); // Convert am/pm to AM/PM

    return `${datePart} at ${timePart}`;
  } catch {
    return dateString; // Return original string if parsing fails
  }
};

/**
 * Formats a date string to a short format
 * @param dateString - The date string to format
 * @returns Formatted date string (e.g., "22/06/2025")
 */
export const formatDateShort = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return dateString; // Return original string if parsing fails
  }
};

/**
 * Formats only the time part in AM/PM format
 * @param dateString - The date string to format
 * @returns Formatted time string (e.g., "10:30 AM")
 */
export const formatTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date
      .toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .toUpperCase(); // Convert am/pm to AM/PM
  } catch {
    return dateString; // Return original string if parsing fails
  }
};

/**
 * Formats date and time in a compact format
 * @param dateString - The date string to format
 * @returns Formatted date and time string (e.g., "22/06/2025, 10:30 AM")
 */
export const formatDateTimeCompact = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const datePart = date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const timePart = date
      .toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .toUpperCase(); // Convert am/pm to AM/PM

    return `${datePart}, ${timePart}`;
  } catch {
    return dateString; // Return original string if parsing fails
  }
};
