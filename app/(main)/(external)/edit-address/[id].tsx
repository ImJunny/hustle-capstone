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

export default function EditAddressForm() {
  const { id } = useLocalSearchParams();
  const { data } = trpc.address.get_address_info.useQuery({
    id: parseInt(id as string),
  });

  const themeColor = useThemeColor();
  const formMethods = useForm<z.infer<typeof CreateAddressSchema>>({
    resolver: zodResolver(CreateAddressSchema),
    defaultValues: {
      address_title: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      country: "",
      zip: "",
    },
  });

  useEffect(() => {
    if (data) {
      formMethods.reset({
        address_title: data.title || "",
        address_line_1: data.address_line_1 || "",
        address_line_2: data.address_line_2 || "",
        city: data.city || "",
        state: data.state?.toLowerCase() || "",
        country: data.country?.toLowerCase().replaceAll(" ", "_") || "",
        zip: data.zip_code || "",
      });
    }
  }, [data, formMethods.reset]);

  const [modalOpen, setModalOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any>();

  return (
    <>
      <SimpleHeader title="Edit address" />
      <KeyboardAvoidingView
        style={styles.avoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.page} color="background">
            <AddressForm
              formMethods={formMethods}
              data={data as unknown as Address}
            />
          </View>
        </ScrollView>
        <View
          style={[styles.footer, { borderColor: themeColor.border }]}
          color="background"
        >
          <AddressSubmitButton
            setSuggestions={setSuggestions}
            setModalOpen={setModalOpen}
            formMethods={formMethods}
            isEditing
          />
        </View>
      </KeyboardAvoidingView>
      <AddressSuggestionsModal
        suggestions={suggestions}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        formMethods={formMethods}
      />
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
