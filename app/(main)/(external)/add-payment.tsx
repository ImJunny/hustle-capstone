import View from "@/components/ui/View";
import React, { useState } from "react";
import { StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { SimpleHeader } from "@/components/headers/Headers";
import { useThemeColor } from "@/hooks/useThemeColor";
import ScrollView from "@/components/ui/ScrollView";
import AddressSubmitButton from "@/components/addresses/AddressSubmitButton";
import { CreateAddressProvider } from "@/contexts/CreateAddressContext";
import AddPaymentForm from "@/components/settings/payment-methods/AddPaymentForm";

export default function CreateAddressForm() {
  const themeColor = useThemeColor();

  const [modalOpen, setModalOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any>();

  return (
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
        <View
          style={[styles.footer, { borderColor: themeColor.border }]}
          color="background"
        >
          <AddressSubmitButton
            setSuggestions={setSuggestions}
            setModalOpen={setModalOpen}
          />
        </View>
      </KeyboardAvoidingView>
    </CreateAddressProvider>
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
