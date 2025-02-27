import Button from "@/components/ui/Button";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import Input from "@/components/ui/Input";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { router } from "expo-router";
import { useState } from "react";
import { Dimensions, StyleSheet, useColorScheme } from "react-native";
import DatePicker from "react-native-date-picker";

export default function DateOfBirth() {
  const [date, setDate] = useState(new Date());
  const theme = useColorScheme() ?? "light";
  return (
    <View style={[styles.page]} color="background">
      <View>
        <Text size="3xl" weight="semibold" style={{ marginTop: 16 }}>
          What is your date of birth?
        </Text>
        <Text>
          In order to use Hustle, you must be at least 16 years of age.
        </Text>
      </View>
      <Input
        type="line"
        editable={false}
        value={date.toLocaleDateString()}
        style={{ marginTop: 16 }}
      />
      <View style={{ flex: 1, alignItems: "center", marginTop: 52 }}>
        <DatePicker
          date={date}
          onDateChange={setDate}
          mode="date"
          maximumDate={new Date()}
          theme={theme}
        />
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
