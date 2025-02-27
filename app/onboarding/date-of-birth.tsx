import Button from "@/components/ui/Button";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import Input from "@/components/ui/Input";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import {
  DateOfBirthFormType,
  useOnboardingFormsContext,
} from "@/contexts/OnboardingFormsContext";
import { router } from "expo-router";
import { useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import { Dimensions, StyleSheet, useColorScheme } from "react-native";
import DatePicker from "react-native-date-picker";

export default function DateOfBirth({
  setValue,
}: {
  setValue: UseFormSetValue<DateOfBirthFormType>;
}) {
  const { setSelectedDate, dateErrors } = useOnboardingFormsContext();
  const [date, setDate] = useState<Date>(new Date());
  const [formattedDate, setFormattedDate] = useState<string>(
    date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );
  const theme = useColorScheme() ?? "light";

  const handleDateChange = (selectedDate: Date) => {
    setDate(selectedDate);
    setSelectedDate(selectedDate);
    const formatted = selectedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setFormattedDate(formatted);
  };

  return (
    <View style={[styles.page]}>
      <View>
        <Text size="3xl" weight="semibold" style={{ marginTop: 16 }}>
          What is your date of birth?
        </Text>
        <Text>
          In order to use Hustle, you must be at least 16 years of age.
        </Text>
        <Input
          type="line"
          editable={false}
          value={formattedDate}
          style={{ marginTop: 16 }}
        />
      </View>
      <Text style={{ marginTop: 4 }} color="red">
        {dateErrors.date_of_birth?.message}
      </Text>
      <View style={{ flex: 1, alignItems: "center", marginTop: 52 }}>
        <DatePicker
          date={date}
          onDateChange={handleDateChange}
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
