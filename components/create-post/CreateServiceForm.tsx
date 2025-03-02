import { StyleSheet } from "react-native";
import Input from "../ui/Input";
import Text from "../ui/Text";
import View from "../ui/View";
import DateInput from "./DateInput";
import { Controller, useForm } from "react-hook-form";
import { CreateServiceSchema } from "@/zod/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import RadioButton from "../ui/RadioButton";
import CreatePostImagePicker from "./CreatePostImagePicker";
import CreateJobSubmitButton from "./CreateJobSubmitButton";
import CreateServiceSubmitButton from "./CreateServiceSubmitButton";

export default function CreateServiceForm() {
  // Declare form properties
  const {
    control,
    formState: { errors },
    setValue,
    handleSubmit,
    watch,
  } = useForm<z.infer<typeof CreateServiceSchema>>({
    resolver: zodResolver(CreateServiceSchema),
  });

  const locationType = watch("location_type");
  return (
    <View style={{ gap: 60 }}>
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
          <Text>-</Text>
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
          defaultMessage="The rate cannot be changed after you have been hired."
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
            <View style={{ marginTop: 10, flexDirection: "row", gap: 16 }}>
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
      </View>

      {locationType === "local" && (
        <View>
          <Text weight="semibold" size="lg">
            Location address
          </Text>
          <Controller
            control={control}
            name="location_address"
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
            field="location_address"
            defaultMessage="This address will be hidden to everyone except the approved worker."
            hasError
          />
        </View>
      )}

      <View>
        <Text weight="semibold" size="lg">
          Photos
        </Text>
        <CreatePostImagePicker setValue={setValue} />
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
        <Text color="muted" size="sm" style={{ marginTop: 10 }}>
          Add up to 3 tags. This helps others find your post.
        </Text>
      </View>

      <CreateServiceSubmitButton handleSubmit={handleSubmit} />
    </View>
  );

  function BottomMessage({
    field,
    defaultMessage,
    hasError,
  }: {
    field: keyof z.infer<typeof CreateServiceSchema>;
    defaultMessage: string;
    hasError?: boolean;
  }) {
    if (hasError)
      return (
        <Text
          color={errors[field] ? "red" : "muted"}
          size="sm"
          style={{ marginTop: 10 }}
        >
          {errors[field] ? errors[field].message : defaultMessage}
        </Text>
      );
    return (
      <Text color="muted" size="sm" style={{ marginTop: 10 }}>
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
    marginTop: 10,
  },
  description_form: {
    marginTop: 10,
    height: 160,
    flexWrap: "wrap",
    paddingVertical: 10,
  },
  rate_form: {
    marginTop: 10,
    width: 120,
  },
});
