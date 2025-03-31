import View from "@/components/ui/View";
import React, { useState } from "react";
import { StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { SimpleHeader } from "@/components/headers/Headers";
import { useThemeColor } from "@/hooks/useThemeColor";
import ScrollView from "@/components/ui/ScrollView";
import { CreateAddressProvider } from "@/contexts/CreateAddressContext";
import AddPaymentForm from "@/components/settings/payment-methods/AddPaymentForm";
import { StripeProvider } from "@stripe/stripe-react-native";

const publish_key = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
if (!publish_key) {
  throw new Error(
    "Stripe publishable key is not defined in environment variables."
  );
}
export default function CreateAddressForm() {
  const themeColor = useThemeColor();

  const [modalOpen, setModalOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any>();

  return (
    <StripeProvider
      publishableKey={publish_key} // required
      merchantIdentifier="merchant.com.your-app" // required for Apple Pay
      // ...other props if needed
    >
      <CreateAddressProvider>
        <SimpleHeader title="Add New Payment" />
        <KeyboardAvoidingView
          style={styles.avoidingView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.page} color="background">
              <AddPaymentForm />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </CreateAddressProvider>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  avoidingView: {
    flex: 1,
  },
  page: { padding: 16, flex: 1 },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  footerButton: {
    alignSelf: "flex-end",
  },
});
