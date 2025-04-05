import View from "@/components/ui/View";
import React from "react";
import { StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { SimpleHeader } from "@/components/headers/Headers";
import ScrollView from "@/components/ui/ScrollView";
import AddPaymentForm from "@/components/settings/payment-methods/AddPaymentForm";
import { StripeProvider } from "@stripe/stripe-react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const CreatePaymentMethodSchema = z.object({
  cardholder_name: z.string().trim().min(1, "Cannot leave field empty"),
  card_is_valid: z.boolean().default(false),
});

export default function CreateAddressForm() {
  const formMethods = useForm<z.infer<typeof CreatePaymentMethodSchema>>({
    resolver: zodResolver(CreatePaymentMethodSchema),
  });

  return (
    <>
      <SimpleHeader title="Add new payment method" />
      <KeyboardAvoidingView
        style={styles.avoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.page} color="background">
            <AddPaymentForm formMethods={formMethods} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
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
