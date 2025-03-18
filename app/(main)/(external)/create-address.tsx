import View from "@/components/ui/View";
import React from "react";
import { StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { SimpleHeader } from "@/components/headers/Headers";
import { useThemeColor } from "@/hooks/useThemeColor";
import AddressForm from "@/components/settings/addresses/AddressForm";
import Button from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreateAddressSchema } from "@/zod/zod-schemas";
import ScrollView from "@/components/ui/ScrollView";

export default function CreatePostForm() {
  const themeColor = useThemeColor();

  const formMethods = useForm<z.infer<typeof CreateAddressSchema>>({
    resolver: zodResolver(CreateAddressSchema),
  });

  const handleSave = () => {
    console.log("saved");
  };

  return (
    <>
      <SimpleHeader title="Edit address" />
      <KeyboardAvoidingView
        style={styles.avoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.page} color="background">
            <AddressForm formMethods={formMethods} />
          </View>
          <View
            style={[styles.footer, { borderColor: themeColor.border }]}
            color="background"
          >
            <Button
              style={styles.footerButton}
              onPress={formMethods.handleSubmit(handleSave)}
            >
              Save changes
            </Button>
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
    height: 40,
  },
});
