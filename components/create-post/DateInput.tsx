import React, { useState } from "react";
import Input from "@/components/ui/Input";
import View from "@/components/ui/View";
import { StyleSheet, TouchableOpacity } from "react-native";
import Icon from "../ui/Icon";
import { UseFormSetValue, UseFormTrigger } from "react-hook-form";
import { CreateJobSchema } from "@/zod/zod-schemas";
import { z } from "zod";
import DatePicker from "react-native-modal-datetime-picker";

type DateInputProps = {
  setValue: UseFormSetValue<z.infer<typeof CreateJobSchema>>;
};
export default function DateInput({ setValue }: DateInputProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [formattedDate, setFormattedDate] = useState<string>();
  const [isDatePickerVisible, setDatePickerVisible] = useState<boolean>(false);

  const handleConfirm = (selectedDate: Date) => {
    const currentDate = selectedDate || new Date();
    const formattedDate = currentDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setDate(selectedDate);
    setFormattedDate(formattedDate);
    setValue("due_date", date, { shouldValidate: true });
    setDatePickerVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setDatePickerVisible(true)}
        style={styles.inputContainer}
      >
        <Input
          placeholder="Pick a date"
          value={formattedDate}
          style={styles.textInput}
          editable={false}
          type="outline"
        />
        <Icon name="calendar" size="xl" color="white" style={styles.calendar} />
      </TouchableOpacity>
      <DatePicker
        mode="date"
        isVisible={isDatePickerVisible}
        date={date}
        onConfirm={handleConfirm}
        onCancel={() => setDatePickerVisible(false)}
        minimumDate={new Date()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 6,
    gap: 10,
    marginTop: 10,
    width: 250,
  },
  textInput: {
    flex: 1,
  },
  calendar: { position: "absolute", right: 6 },
});
