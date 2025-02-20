import React, { useState } from "react";
import Input from "@/components/ui/Input";
import View from "@/components/ui/View";
import { StyleSheet, TouchableOpacity } from "react-native";
import Icon from "../ui/Icon";
import { useThemeColor } from "@/hooks/useThemeColor";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function DateInput() {
  const today = new Date().toLocaleDateString();
  const [date, setDate] = useState<string>("");
  const [isDatePickerVisible, setDatePickerVisible] = useState<boolean>(false);

  const handleConfirm = (selectedDate: Date) => {
    const currentDate = selectedDate || new Date();
    setDate(currentDate.toLocaleDateString());
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
          value={date}
          style={styles.textInput}
          editable={false}
          type="outline"
        />
        <Icon name="calendar" size="xl" color="white" style={styles.calendar} />
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={() => setDatePickerVisible(false)}
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
