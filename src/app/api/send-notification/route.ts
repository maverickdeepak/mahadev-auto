// src/app/api/send-notification/route.ts
import { NextRequest, NextResponse } from "next/server";
import notificationapi from "notificationapi-node-server-sdk";

export async function POST(req: NextRequest) {
  try {
    const { phone, customerName, serviceType, bikeNumber, totalCost } =
      await req.json();

    const notificationClientId = process.env.NOTIFICATIONAPI_CLIENT_ID;
    const notificationClientSecret = process.env.NOTIFICATIONAPI_CLIENT_SECRET;

    // Check if environment variables are set
    if (!notificationClientId || !notificationClientSecret) {
      console.error("Missing environment variables:", {
        hasClientId: !!notificationClientId,
        hasClientSecret: !!notificationClientSecret,
      });
      return NextResponse.json(
        {
          success: false,
          error:
            "SMS service configuration is missing. Please check environment variables.",
        },
        { status: 500 }
      );
    }

    // Validate input parameters
    if (
      !phone ||
      !customerName ||
      !serviceType ||
      !bikeNumber ||
      totalCost === undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required parameters: phone, customerName, serviceType, bikeNumber, or totalCost",
        },
        { status: 400 }
      );
    }

    console.log(
      "Initializing notification API with client ID:",
      notificationClientId ? "SET" : "NOT SET"
    );

    // Initialize the notification API
    notificationapi.init(notificationClientId, notificationClientSecret);

    const response = await notificationapi.send({
      type: "sms_notification",
      to: { number: `+91${phone}` },
      sms: {
        message: `Dear ${customerName}, your ${serviceType} service for bike ${bikeNumber} has been completed and is delivered. Total cost: ₹${totalCost.toFixed(
          2
        )}. Thank you for choosing Mahadev Automobiles!`,
      },
    });

    console.log("response", response);

    // --- FIX IS HERE ---
    // Extract only the necessary and serializable parts from the response.
    // The exact properties to extract depend on what 'notificationapi.send' returns.
    // Common properties might be 'data', 'id', 'status', etc.
    // For now, let's assume it returns a success indicator or a simple ID.
    // If the `response` object itself is what you need, you might need to inspect its structure.

    // A common approach is to just send back a success message or a relevant ID.
    // If 'response' has a 'data' property that's serializable, use that.
    // Let's assume 'response' has a simple structure like { notificationId: '...', status: 'sent' }
    // If you're unsure, inspect the 'response' object using console.log(JSON.stringify(response, null, 2))
    // (though this will also fail if it's circular, so you might need `util.inspect` or a debugger).

    // Let's try sending back a generic success object, as the client side only checks `data.success`
    // If you need more specific data from the NotificationAPI response, you'll need to
    // check their SDK documentation or log `Object.keys(response)` to see what's available.

    // Example 1: Sending back a simple success object
    const serializableResponse = {
      message: "Notification API call successful",
      // If `response` has a direct, simple ID, you might add it like:
      // notificationId: response.id,
      // Or if it's nested:
      // notificationId: response.data?.id,
    };

    return NextResponse.json(
      { success: true, data: serializableResponse }, // Pass the safe, serializable object
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error sending SMS notification:", error);

    // Log more details for debugging
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    // Ensure the error response is also serializable
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: "Check server logs for more information",
      },
      { status: 500 }
    );
  }
}
