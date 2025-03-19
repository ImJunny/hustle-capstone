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
import { trpc } from "@/server/lib/trpc-client";
import Toast from "react-native-toast-message";

export default function CreatePostForm() {
  const themeColor = useThemeColor();

  const formMethods = useForm<z.infer<typeof CreateAddressSchema>>({
    resolver: zodResolver(CreateAddressSchema),
  });

  const { mutateAsync: findAddress } =
    trpc.address.find_suggested_address.useMutation({
      onError: (error) => {
        Toast.show({
          text1: error.message,
          type: "error",
          swipeable: false,
          visibilityTime: 2000,
        });
      },
    });

  const handleSave = async () => {
    const { address_line_1, address_line_2, city, state, zip } =
      formMethods.getValues();
    const encoded_address = `${address_line_1},${
      address_line_2 ? address_line_2 : ""
    },${city},${state},${zip}`.replaceAll(" ", "+");
    const a = await findAddress({ encoded_address });
    console.log(a);
    if (!a) {
      Toast.show({
        text1: "No matching addresses found.",
        type: "error",
        swipeable: false,
      });
    }
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
        </ScrollView>
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
