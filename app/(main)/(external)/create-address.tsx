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

export default function CreatePostForm() {
  const themeColor = useThemeColor();

  const formMethods = useForm<z.infer<typeof CreateAddressSchema>>({
    resolver: zodResolver(CreateAddressSchema),
  });

  const handleSave = formMethods.handleSubmit(() => {
    console.log("test");
  });

  return (
    <>
      <SimpleHeader title="Edit address" />
      <KeyboardAvoidingView
        style={styles.avoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.page}>
          <AddressForm formMethods={formMethods} />
        </View>
        <View style={[styles.footer, { borderColor: themeColor.border }]}>
          <Button style={styles.footerButton} onPress={handleSave}>
            Save changes
          </Button>
        </View>
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
