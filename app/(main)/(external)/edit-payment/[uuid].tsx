import View from "@/components/ui/View";
import React, { useState } from "react";
import { StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { SimpleHeader } from "@/components/headers/Headers";
import { useThemeColor } from "@/hooks/useThemeColor";
import AddressForm from "@/components/settings/addresses/AddressForm";
import ScrollView from "@/components/ui/ScrollView";
import AddressSuggestionsModal from "@/components/addresses/AddressSuggestionsModal";
import AddressSubmitButton from "@/components/addresses/AddressSubmitButton";
import { useLocalSearchParams } from "expo-router";
import { trpc } from "@/server/lib/trpc-client";
import { Address } from "@/server/actions/address-actions";
import LoadingView from "@/components/ui/LoadingView";
import { CreateAddressProvider } from "@/contexts/CreateAddressContext";
import { AddPaymentProvider } from "@/contexts/AddPaymentContext";
import AddPaymentForm from "@/components/settings/payment-methods/AddPaymentForm";
import PaymentSubmitButton from "@/components/payment-methods/PaymentSubmitButton";
import { PaymentMethod } from "@/server/actions/payment-method-actions";

export default function EditAddressForm() {
  const { uuid } = useLocalSearchParams();
  const { data, isLoading } =
    trpc.payment_methods.get_payment_method_info.useQuery({
      uuid: uuid as string,
    });

  const themeColor = useThemeColor();

  const [modalOpen, setModalOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any>();

  // Prevent rendering the form until data is available
  if (isLoading || !data) {
    return (
      <>
        <SimpleHeader title="Edit Payment" />
        <LoadingView />
      </>
    );
  }

  return (
    <AddPaymentProvider data={data}>
      <SimpleHeader title="Edit Payment" />
      <KeyboardAvoidingView
        style={styles.avoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.page} color="background">
            <AddPaymentForm />
          </View>
        </ScrollView>
        <View
          style={[styles.footer, { borderColor: themeColor.border }]}
          color="background"
        >
          <PaymentSubmitButton
            data={data as PaymentMethod}
            isEditing
            setModalOpen={function (
              value: React.SetStateAction<boolean>
            ): void {
              throw new Error("Function not implemented.");
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </AddPaymentProvider>
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
    height: 40,
  },
});
