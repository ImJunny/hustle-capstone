import { StyleSheet } from "react-native";
import Input from "../ui/Input";
import Text from "../ui/Text";
import View from "../ui/View";
import Button from "../ui/Button";
import DateInput from "./DateInput";
import AddImage from "../ui/AddImages";
import { Controller, useForm } from "react-hook-form";
import { CreateJobSchema } from "@/zod/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import RadioButton from "../ui/RadioButton";

export default function CreateJobForm() {
  // Declare form properties
  const {
    control,
    formState: { errors },
    setValue,
    getValues,
    handleSubmit,
    watch,
  } = useForm<z.infer<typeof CreateJobSchema>>({
    resolver: zodResolver(CreateJobSchema),
  });

  const minRate = watch("min_rate");
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
          Due date
        </Text>
        <DateInput setValue={setValue} />
        <BottomMessage
          field="due_date"
          defaultMessage="This indicates the end-of-day deadline for the job. You cannot make
          the due date earlier after a worker is approved."
          hasError
        />
      </View>

      <View>
        <Text weight="semibold" size="lg">
          Photos
        </Text>
        <AddImage />
        <Text color="muted" size="sm">
          Add up to 6 photos. If you do not provide any images, a placeholder
          gradient will be displayed.
        </Text>
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

      <Button
        style={{ marginLeft: "auto" }}
        onPress={handleSubmit(() => {
          console.log(getValues());
        })}
      >
        Post job
      </Button>
    </View>
  );

  function BottomMessage({
    field,
    defaultMessage,
    hasError,
  }: {
    field: keyof z.infer<typeof CreateJobSchema>;
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
    textAlignVertical: "auto",
    height: 160,
    flexWrap: "wrap",
  },
  rate_form: {
    marginTop: 10,
    width: 120,
  },
});
