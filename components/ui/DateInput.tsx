import React, { useState } from "react";
import Input from "@/components/ui/Input";
import View from "@/components/ui/View";
import { StyleSheet, TouchableOpacity } from "react-native";
import Icon from "./Icon";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const DateInput = () => {
  const today = new Date().toLocaleDateString();
  const [date, setDate] = useState<string>("");
  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);
  const [placeholder, setPlaceholder] = useState<string>(`Today - ${today}`);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate: Date) => {
    const currentDate = selectedDate || new Date();
    setDate(currentDate.toLocaleDateString());
    hideDatePicker();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Input
          placeholder={placeholder}
          value={date}
          style={styles.textInput}
          editable={false}
        />
        <TouchableOpacity onPress={showDatePicker} style={styles.iconContainer}>
          <Icon name="calendar" size="xl" color="white" />
        </TouchableOpacity>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 0,
    gap: 10,
    backgroundColor: "transparent",
    borderColor: "white",
    marginTop: 10,
    width: 200,
  },
  textInput: {
    flex: 1,
    backgroundColor: "transparent",
  },
  iconContainer: {
    padding: 5,
  },
});

export default DateInput;
