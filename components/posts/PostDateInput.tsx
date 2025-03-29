import React, { useEffect, useState } from "react";
import Input from "@/components/ui/Input";
import View from "@/components/ui/View";
import { StyleSheet, TouchableOpacity } from "react-native";
import Icon from "../ui/Icon";
import { useFormContext, UseFormSetValue } from "react-hook-form";
import { z } from "zod";
import DatePicker from "react-native-modal-datetime-picker";
import { CreatePostSchema } from "@/zod/zod-schemas";

type DateInputProps = {
  setValue: UseFormSetValue<z.infer<typeof CreatePostSchema>>;
};

export default function PostDateInput({ setValue }: DateInputProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [formattedDate, setFormattedDate] = useState<string>();
  const [isDatePickerVisible, setDatePickerVisible] = useState<boolean>(false);

  const { getValues } = useFormContext<z.infer<typeof CreatePostSchema>>();

  useEffect(() => {
    if (getValues("due_date")) {
      const dueDate = getValues("due_date");
      if (dueDate) {
        const date = new Date(dueDate);
        setDate(date);
        setFormattedDate(
          date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        );
      }
    }
  }, []);

  const handleConfirm = (selectedDate: Date) => {
    const currentDate = selectedDate || new Date();
    const formattedDate = currentDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setDate(selectedDate);
    setFormattedDate(formattedDate);
    setValue("due_date", selectedDate, { shouldValidate: true });
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
    marginTop: 4,
    width: 250,
  },
  textInput: {
    flex: 1,
  },
  calendar: { position: "absolute", right: 6 },
});
