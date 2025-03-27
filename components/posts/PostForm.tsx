import { StyleSheet, TouchableOpacity } from "react-native";
import Input from "../ui/Input";
import Text from "../ui/Text";
import View from "../ui/View";
import { Controller, useFormContext } from "react-hook-form";
import { z } from "zod";
import RadioButton from "../ui/RadioButton";
import { PostDetailsInfo } from "@/server/actions/post-actions";
import { PostImagePicker } from "./PostImagePicker";
import PostDateInput from "./PostDateInput";
import { CreatePostSchema } from "@/zod/zod-schemas";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthData } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Address } from "@/server/actions/address-actions";
import Icon from "../ui/Icon";
import { router, useLocalSearchParams } from "expo-router";

type PostFormProps = {
  type?: "work" | "hire";
};

export default function PostForm({ type = "hire" }: PostFormProps) {
  // Declare form properties
  const {
    control,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = useFormContext<z.infer<typeof CreatePostSchema>>();

  const { user } = useAuthData();
  if (!user) return;

  const [address, setAddress] = useState<Address | null>(null);

  const { selected_address } = useLocalSearchParams();
  useEffect(() => {
    if (selected_address) {
      const parsedAddress = JSON.parse(selected_address as string) as Address;
      setAddress(parsedAddress);
      setValue("address_uuid", parsedAddress.uuid);
    }
  }, [selected_address]);

  const location_type = watch("location_type");
  useEffect(() => {
    if (location_type === "remote") {
      setValue("address_uuid", null);
    } else {
      if (selected_address) {
        const parsedAddress = JSON.parse(selected_address as string) as Address;
        setAddress(parsedAddress);
        setValue("address_uuid", parsedAddress.uuid);
      }
    }
  }, [location_type]);

  const themeColor = useThemeColor();
  const locationType = watch("location_type");
  return (
    <View style={{ gap: 70 }}>
      <View>
        <Text weight="semibold" size="lg">
          Title
        </Text>
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <Input
              style={styles.text_form}
              type="outline"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        <BottomMessage
          field="title"
          defaultMessage="Please provide a title of at least 10 characters."
          hasError
        />
      </View>

      <View>
        <Text weight="semibold" size="lg">
          Description
        </Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <Input
              style={styles.description_form}
              type="outline"
              value={value}
              onChangeText={onChange}
              multiline={true}
              textAlignVertical="top"
            />
          )}
        />
        <BottomMessage
          field="description"
          defaultMessage="Description must be at least 40 characters."
          hasError
        />
      </View>

      <View>
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            alignItems: "center",
          }}
        >
          <View>
            <Text weight="semibold" size="lg">
              Min rate ($)
            </Text>
            <Controller
              control={control}
              name="min_rate"
              render={({ field: { onChange, value } }) => (
                <Input
                  style={styles.rate_form}
                  type="outline"
                  value={
                    value !== undefined && value !== null ? String(value) : ""
                  }
                  onChangeText={(text) => {
                    if (text === "") {
                      onChange(undefined);
                    } else if (/^\d*$/.test(text)) {
                      onChange(parseInt(text, 10));
                    }
                  }}
                  keyboardType="numeric"
                />
              )}
            />
          </View>
          <Text style={{ marginTop: 30 }}>-</Text>
          <View>
            <Text weight="semibold" size="lg">
              Max rate ($)
            </Text>
            <Controller
              control={control}
              name="max_rate"
              render={({ field: { onChange, value } }) => (
                <Input
                  style={styles.rate_form}
                  type="outline"
                  value={
                    value !== undefined && value !== null ? String(value) : ""
                  }
                  onChangeText={(text) => {
                    if (text === "") {
                      onChange(undefined);
                    } else if (/^\d*$/.test(text)) {
                      onChange(parseInt(text, 10));
                    }
                  }}
                  keyboardType="numeric"
                />
              )}
            />
          </View>
        </View>
        <BottomMessage
          field="min_rate"
          defaultMessage="The rate cannot be changed after a worker has been approved."
          hasError
        />
      </View>

      <View>
        <Text weight="semibold" size="lg">
          Location type
        </Text>
        <Controller
          name="location_type"
          control={control}
          defaultValue="remote"
          render={({ field: { value, onChange } }) => (
            <View style={{ marginTop: 4, gap: 16 }}>
              <RadioButton
                label={"Remote"}
                selected={value}
                value="remote"
                onPress={onChange}
              />
              <RadioButton
                label={"Local"}
                selected={value}
                value="local"
                onPress={onChange}
              />
            </View>
          )}
        />
        {locationType === "local" && (
          <View style={{ marginTop: 30 }}>
            <Text weight="semibold" size="lg">
              Location address
            </Text>
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "/choose-address",
                  params: {
                    selected_address: JSON.stringify(address),
                  },
                });
              }}
              style={{
                marginTop: 4,
                paddingHorizontal: 20,
                height: 120,
                borderWidth: 1,
                borderColor: themeColor.foreground,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderRadius: 8,
              }}
            >
              {address ? (
                <View>
                  <Text weight="semibold" style={{ marginBottom: 4 }}>
                    {address.title}
                  </Text>
                  <Text>
                    {address.address_line_1}
                    {address.address_line_2 && `, ${address.address_line_2}`}
                  </Text>
                  <Text>
                    {address.city}, {address.state}, {address.zip_code}
                  </Text>
                </View>
              ) : (
                <View>
                  <Text>No addresses added yet</Text>
                </View>
              )}

              <Icon name="chevron-forward" size="xl" />
            </TouchableOpacity>
            <BottomMessage
              field="address_uuid"
              defaultMessage="This address will be hidden to everyone except the approved worker."
              hasError
            />
          </View>
        )}
      </View>

      {getValues("type") === "work" && (
        <View>
          <Text weight="semibold" size="lg">
            Due date
          </Text>
          <PostDateInput setValue={setValue} />
          <BottomMessage
            field="due_date"
            defaultMessage="This indicates the end-of-day deadline for the job. You cannot make the due date earlier after a worker is approved."
            hasError
          />
        </View>
      )}

      <View>
        <Text weight="semibold" size="lg">
          Photos
        </Text>
        <PostImagePicker />
        <BottomMessage
          field="images"
          defaultMessage="Add up to 6 photos."
          hasError
        />
      </View>

      <View>
        <Text weight="semibold" size="lg">
          Tags
        </Text>
        <Input type="outline" style={styles.text_form} />
        <Text color="muted" size="sm" style={{ marginTop: 4 }}>
          Add up to 3 tags. This helps others find your post.
        </Text>
      </View>
    </View>
  );

  function BottomMessage({
    field,
    defaultMessage,
    hasError,
  }: {
    field: keyof z.infer<typeof CreatePostSchema>;
    defaultMessage: string;
    hasError?: boolean;
  }) {
    if (hasError)
      return (
        <Text
          color={errors[field] ? "red" : "muted"}
          size="sm"
          style={{ marginTop: 4 }}
        >
          {errors[field] ? errors[field].message : defaultMessage}
        </Text>
      );
    return (
      <Text color="muted" size="sm" style={{ marginTop: 4 }}>
        {defaultMessage}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  add_photo: {
    width: 80,
    height: 80,
    backgroundColor: "grey",
    alignItems: "center",
  },
  text_form: {
    marginTop: 4,
  },
  description_form: {
    marginTop: 4,
    height: 160,
    flexWrap: "wrap",
    paddingVertical: 10,
  },
  rate_form: {
    marginTop: 4,
    width: 120,
  },
  footer: {
    position: "absolute",
    width: "100%",
    bottom: 0,
  },
  button: {},
});
