import View from "@/components/ui/View";
import React, { useState } from "react";
import { StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { SimpleHeader } from "@/components/headers/Headers";
import { useThemeColor } from "@/hooks/useThemeColor";
import AddressForm from "@/components/settings/addresses/AddressForm";
import ScrollView from "@/components/ui/ScrollView";
import AddressSuggestionsModal from "@/components/addresses/AddressSuggestionsModal";
import AddressSubmitButton from "@/components/addresses/AddressSubmitButton";
import { CreateAddressProvider } from "@/contexts/CreateAddressContext";

export default function CreateAddressScreen() {
  const themeColor = useThemeColor();

  const [modalOpen, setModalOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any>();

  return (
    <CreateAddressProvider>
      <SimpleHeader title="Create address" />
      <KeyboardAvoidingView
        style={styles.avoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.page} color="background">
            <AddressForm />
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
      <AddressSuggestionsModal
        suggestions={suggestions}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
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
