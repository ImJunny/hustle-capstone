import Input from "@/components/ui/Input";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { CreateAddressSchema } from "@/zod/zod-schemas";
import { Controller, useFormContext, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import Dropdown from "@/components/ui/Dropdown";
import { countries, us_states } from "@/constants/Data";
import { useEffect } from "react";
import { Address } from "@/server/actions/address-actions";

// Prop types
type AddressFormProps = {
  data?: Address;
};
type AddressFormInputProps = {
  title: string;
  name: keyof z.infer<typeof CreateAddressSchema>;
  defaultMessage?: string;
};
type AddressFormDropdownProps = {
  title: string;
  name: keyof z.infer<typeof CreateAddressSchema>;
  data: { label: string; value: string }[];
  defaultMessage?: string;
};

// Address form
export default function AddressForm({ data }: AddressFormProps) {
  const { setValue, watch } =
    useFormContext<z.infer<typeof CreateAddressSchema>>();
  const isUS = watch("country") === "united_states";
  useEffect(() => {
    if (!isUS) setValue("state", "");
  }, [isUS, setValue]);

  return (
    <View style={{ gap: 12 }}>
      <AddressFormInput
        title="Address title"
        name="address_title"
        defaultMessage="This title is only meant for you to help identify the type of address. (ex: Home)"
      />
      <AddressFormDropdown
        title="Country/Region"
        name="country"
        data={countries}
      />
      <AddressFormInput title="Address line 1" name="address_line_1" />
      <AddressFormInput title="Address line 2" name="address_line_2" />
      <AddressFormInput title="City" name="city" />
      {isUS ? (
        <AddressFormDropdown
          title="State/Province"
          name="state"
          data={us_states}
        />
      ) : (
        <AddressFormInput title="State/Province" name="state" />
      )}
      <AddressFormInput title="Zip code" name="zip" />
    </View>
  );
}

function AddressFormInput({
  title,
  name,
  defaultMessage,
}: AddressFormInputProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<z.infer<typeof CreateAddressSchema>>();

  return (
    <View>
      <Text weight="semibold" size="lg">
        {title}
      </Text>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input
            value={value}
            onChangeText={onChange}
            type="outline"
            style={{ marginTop: 4 }}
            borderColor="background-variant"
          />
        )}
      />
      {(defaultMessage || errors[name]) && (
        <Text color={errors[name] ? "red" : "muted"} style={{ marginTop: 4 }}>
          {defaultMessage && !errors[name]
            ? defaultMessage
            : errors[name]?.message}
        </Text>
      )}
    </View>
  );
}

function AddressFormDropdown({
  title,
  name,
  data,
  defaultMessage,
}: AddressFormDropdownProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<z.infer<typeof CreateAddressSchema>>();

  return (
    <View>
      <Text weight="semibold" size="lg">
        {title}
      </Text>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Dropdown
            style={{ marginTop: 4 }}
            borderColor="background-variant"
            data={data}
            value={value}
            onChange={onChange}
          />
        )}
      />
      {(defaultMessage || errors[name]) && (
        <Text color={errors[name] ? "red" : "muted"} style={{ marginTop: 4 }}>
          {defaultMessage && !errors[name]
            ? defaultMessage
            : errors[name]?.message}
        </Text>
      )}
    </View>
  );
}

export { AddressFormInput, AddressFormDropdown };
