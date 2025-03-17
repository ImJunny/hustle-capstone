import Input from "@/components/ui/Input";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { CreateAddressSchema } from "@/zod/zod-schemas";
import { Controller, UseFormReturn } from "react-hook-form";
import { KeyboardAvoidingView, StyleSheet, ViewStyle } from "react-native";
import { z } from "zod";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Icon from "@/components/ui/Icon";
import Dropdown from "@/components/ui/Dropdown";

// Prop types
type AddressFormProps = {
  formMethods: UseFormReturn<z.infer<typeof CreateAddressSchema>>;
};
type AddressFormEntryProps = {
  title: string;
  name: keyof z.infer<typeof CreateAddressSchema>;
  style?: ViewStyle;
};

// Address form
export default function AddressForm({ formMethods }: AddressFormProps) {
  return (
    <View style={{ gap: 12 }}>
      <AddressFormEntry title="Address line 1" name="street_address" />
      <AddressFormEntry title="Address line 2" name="street_address" />
      <AddressFormEntry title="City" name="city" />
      <AddressFormEntry title="State/Province" name="state" />
      <AddressFormEntry title="Zip code" name="zip" />
      <Dropdown label={"Country/Region"} />
    </View>
  );

  // Address form entry
  function AddressFormEntry({ title, name, style }: AddressFormEntryProps) {
    const {
      control,
      formState: { errors },
    } = formMethods;

    return (
      <View style={style}>
        <Text weight="semibold" size="lg">
          {title}
        </Text>
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              value={value}
              onChange={onChange}
              type="outline"
              style={styles.input}
              borderColor="background-variant"
            />
          )}
        />
        {errors[name] && (
          <Text color="red" style={{ marginTop: 4 }}>
            {errors[name].message}
          </Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    marginTop: 4,
  },
});
