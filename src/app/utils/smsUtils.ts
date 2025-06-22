// SMS Utility Functions
// You can use any SMS service like TextLocal, Twilio, AWS SNS, etc.

interface SMSConfig {
  apiKey: string;
  senderId: string;
  apiUrl: string;
}

// Example using TextLocal (popular in India)
// You'll need to sign up at https://www.textlocal.in/
const smsConfig: SMSConfig = {
  apiKey: process.env.NEXT_PUBLIC_SMS_API_KEY || "",
  senderId: process.env.NEXT_PUBLIC_SMS_SENDER_ID || "MAHADEV",
  apiUrl: "https://api.textlocal.in/send/",
};

export const sendDeliverySMS = async (
  phoneNumber: string,
  customerName: string,
  bikeNumber: string,
  serviceType: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Format phone number (remove +91 if present and ensure it starts with 91)
    let formattedPhone = phoneNumber.replace(/\s/g, "").replace(/^\+/, "");
    if (!formattedPhone.startsWith("91")) {
      formattedPhone = "91" + formattedPhone;
    }

    // Create SMS message
    const message = `Dear ${customerName}, your ${serviceType} service for bike ${bikeNumber} has been completed and is ready for delivery. Thank you for choosing Mahadev Automobiles!`;

    // Prepare request data for TextLocal
    const requestData = new URLSearchParams({
      apikey: smsConfig.apiKey,
      numbers: formattedPhone,
      message: message,
      sender: smsConfig.senderId,
      test: "0", // Set to '1' for testing (free)
    });

    // Send SMS
    const response = await fetch(smsConfig.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: requestData.toString(),
    });

    const result = await response.json();

    if (result.status === "success") {
      return {
        success: true,
        message: "SMS sent successfully",
      };
    } else {
      console.error("SMS API Error:", result);
      return {
        success: false,
        message: result.message || "Failed to send SMS",
      };
    }
  } catch (error) {
    console.error("SMS sending error:", error);
    return {
      success: false,
      message: "Failed to send SMS due to network error",
    };
  }
};

// Alternative: Simple mock function for testing (no actual SMS sent)
export const sendMockSMS = async (
  phoneNumber: string,
  customerName: string,
  bikeNumber: string,
  serviceType: string
): Promise<{ success: boolean; message: string }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log("📱 Mock SMS sent:", {
    to: phoneNumber,
    customer: customerName,
    bike: bikeNumber,
    service: serviceType,
    message: `Dear ${customerName}, your ${serviceType} service for bike ${bikeNumber} has been completed and is ready for delivery. Thank you for choosing Mahadev Automobiles!`,
  });

  return {
    success: true,
    message: "Mock SMS sent successfully (for testing)",
  };
};
