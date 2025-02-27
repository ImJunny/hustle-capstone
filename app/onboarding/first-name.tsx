import Input from "@/components/ui/Input";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { StyleSheet } from "react-native";
import { Controller } from "react-hook-form";
import { useOnboardingFormsContext } from "@/contexts/OnboardingFormsContext";

export default function FirstName() {
  const { firstNameControl: control, firstNameErrors: errors } =
    useOnboardingFormsContext();

  return (
    <View style={[styles.page]} color="background">
      <View>
        <Text size="3xl" weight="semibold" style={{ marginTop: 16 }}>
          What is your first name?
        </Text>
        <Text>
          We'd like to get to know you! This also helps others know who you are.
        </Text>
      </View>
      <View style={{ gap: 4 }}>
        <Controller
          control={control}
          name="first_name"
          render={({ field: { onChange, value } }) => (
            <Input
              style={{ marginTop: 16 }}
              type="line"
              placeholder="First name"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Text color="red">
          {errors.first_name && errors.first_name.message}
        </Text>
      </View>
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
