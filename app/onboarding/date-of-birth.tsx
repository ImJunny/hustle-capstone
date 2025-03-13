import Input from "@/components/ui/Input";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { StyleSheet, useColorScheme } from "react-native";
import DatePicker from "react-native-date-picker";

export default function DateOfBirth() {
  const {
    setValue,
    formState: { errors },
  } = useFormContext();

  const [date, setDate] = useState<Date>(new Date());
  const [formattedDate, setFormattedDate] = useState<string>();
  const theme = useColorScheme() ?? "light";

  const handleDateChange = (selectedDate: Date) => {
    setDate(selectedDate);

    setValue("date_of_birth", selectedDate);

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
        {errors.date_of_birth && (errors.date_of_birth.message as string)}
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
