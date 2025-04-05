import * as Linking from "expo-linking";
import { StripeProvider as NativeStripeProvider } from "@stripe/stripe-react-native";
import Constants from "expo-constants";

const merchantId = Constants.expoConfig?.plugins?.find(
  (p) => p[0] === "@stripe/stripe-react-native"
)?.[1]?.merchantIdentifier;

if (!merchantId) {
  throw new Error('Missing Expo config for "@stripe/stripe-react-native"');
}

export default function StripeProvider(
  props: Omit<
    React.ComponentProps<typeof NativeStripeProvider>,
    "publishableKey" | "merchantIdentifier"
  >
) {
  return (
    <NativeStripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
      merchantIdentifier={merchantId}
      urlScheme={Linking.createURL("/").split(":")[0]}
      {...props}
    />
  );
}
