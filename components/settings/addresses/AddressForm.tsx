import Input from "@/components/ui/Input";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { CreateAddressSchema } from "@/zod/zod-schemas";
import { Controller, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import Dropdown from "@/components/ui/Dropdown";
import { countries, us_states } from "@/constants/Data";
import { useEffect } from "react";
import { Address } from "@/server/actions/address-actions";

// Prop types
type AddressFormProps = {
  data?: Address;
  formMethods: UseFormReturn<z.infer<typeof CreateAddressSchema>>;
};
type AddressFormInputProps = {
  title: string;
  name: keyof z.infer<typeof CreateAddressSchema>;
  formMethods: UseFormReturn<z.infer<typeof CreateAddressSchema>>;
  defaultMessage?: string;
};
type AddressFormDropdownProps = {
  title: string;
  name: keyof z.infer<typeof CreateAddressSchema>;
  data: { label: string; value: string }[];
  formMethods: UseFormReturn<z.infer<typeof CreateAddressSchema>>;
  defaultMessage?: string;
};

// Address form
export default function AddressForm({ formMethods, data }: AddressFormProps) {
  const isUS = formMethods.watch("country") === "united_states";
  useEffect(() => {
    if (!isUS) formMethods.setValue("state", "");
  }, [isUS, formMethods]);

  return (
    <View style={{ gap: 12 }}>
      <AddressFormInput
        title="Address title"
        name="address_title"
        formMethods={formMethods}
        defaultMessage="This title is only meant for you to help identify the type of address. (ex: Home)"
      />
      <AddressFormDropdown
        title="Country/Region"
        name="country"
        data={countries}
        formMethods={formMethods}
      />
      <AddressFormInput
        title="Address line 1"
        name="address_line_1"
        formMethods={formMethods}
      />
      <AddressFormInput
        title="Address line 2"
        name="address_line_2"
        formMethods={formMethods}
      />
      <AddressFormInput title="City" name="city" formMethods={formMethods} />
      {isUS ? (
        <AddressFormDropdown
          title="State/Province"
          name="state"
          data={us_states}
          formMethods={formMethods}
        />
      ) : (
        <AddressFormInput
          title="State/Province"
          name="state"
          formMethods={formMethods}
        />
      )}
      <AddressFormInput
        title="Zip code*"
        name="zip"
        formMethods={formMethods}
      />
    </View>
  );
}

function AddressFormInput({
  title,
  name,
  formMethods,
  defaultMessage,
}: AddressFormInputProps) {
  const {
    control,
    formState: { errors },
  } = formMethods;

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

// Memoize AddressFormDropdown to avoid unnecessary re-renders
function AddressFormDropdown({
  title,
  name,
  data,
  formMethods,
  defaultMessage,
}: AddressFormDropdownProps) {
  const {
    control,
    formState: { errors },
  } = formMethods;

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
