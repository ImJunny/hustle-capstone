import View from "@/components/ui/View";
import React, { useEffect, useState } from "react";
import { StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { SimpleHeader } from "@/components/headers/Headers";
import { useThemeColor } from "@/hooks/useThemeColor";
import AddressForm from "@/components/settings/addresses/AddressForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreateAddressSchema } from "@/zod/zod-schemas";
import ScrollView from "@/components/ui/ScrollView";
import AddressSuggestionsModal from "@/components/addresses/AddressSuggestionsModal";
import AddressSubmitButton from "@/components/addresses/AddressSubmitButton";
import { useLocalSearchParams } from "expo-router";
import { trpc } from "@/server/lib/trpc-client";
import { Address } from "@/server/actions/address-actions";
import LoadingView from "@/components/ui/LoadingView";
import { CreateAddressProvider } from "@/contexts/CreateAddressContext";

export default function EditAddressForm() {
  const { id } = useLocalSearchParams();
  const { data, isLoading } = trpc.address.get_address_info.useQuery({
    id: parseInt(id as string),
  });

  const themeColor = useThemeColor();

  const [modalOpen, setModalOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any>();

  // Prevent rendering the form until data is available
  if (isLoading || !data) {
    return (
      <>
        <SimpleHeader title="Edit address" />
        <LoadingView />
      </>
    );
  }

  return (
    <>
      <CreateAddressProvider data={data}>
        <SimpleHeader title="Edit address" />
        <KeyboardAvoidingView
          style={styles.avoidingView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.page} color="background">
              <AddressForm data={data as Address} />
            </View>
          </ScrollView>
          <View
            style={[styles.footer, { borderColor: themeColor.border }]}
            color="background"
          >
            <AddressSubmitButton
              data={data as Address}
              setSuggestions={setSuggestions}
              setModalOpen={setModalOpen}
              isEditing
            />
          </View>
        </KeyboardAvoidingView>
        <AddressSuggestionsModal
          suggestions={suggestions}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          isEditing
        />
      </CreateAddressProvider>
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
    height: 40,
  },
});
