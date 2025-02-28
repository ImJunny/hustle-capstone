import Input from "@/components/ui/Input";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { Controller, useFormContext } from "react-hook-form";
import { StyleSheet } from "react-native";

export default function Username() {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <View style={[styles.page]} color="background">
      <View>
        <Text size="3xl" weight="semibold" style={{ marginTop: 16 }}>
          Create a username
        </Text>
        <Text>
          This helps identify your account. All usernames are lowercase for easy
          identification.
        </Text>
      </View>
      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, value } }) => (
          <Input
            style={{ marginTop: 16 }}
            type="line"
            placeholder="Username"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      <Text color="red">
        {errors.username && (errors.username.message as string)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  button: {
    marginTop: "auto",
    borderRadius: 999,
    width: "100%",
  },
});
