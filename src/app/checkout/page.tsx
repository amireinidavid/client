"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import CheckoutSuspense from "./checkoutSkeleton";

function CheckoutPage() {
  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
    currency: "USD",
    intent: "capture",
    vault: false,
    components: "buttons",
    disableFunding: "credit,card",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <CheckoutSuspense />
    </PayPalScriptProvider>
  );
}

export default CheckoutPage;
