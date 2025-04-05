import Stripe from "stripe";

export const stripe = new Stripe(process.env.EXPO_PUBLIC_STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
  appInfo: {
    name: "Hustle",
  },
});
