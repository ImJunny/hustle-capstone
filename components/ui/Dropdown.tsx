import { useState } from "react";
import { StyleSheet } from "react-native";
import { Dropdown as ElementDropdown } from "react-native-element-dropdown";
import Text from "./Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FontSizes } from "@/constants/Sizes";

const data = [
  { label: "Item 1", value: "1" },
  { label: "Item 2", value: "2" },
  { label: "Item 3", value: "3" },
  { label: "Item 4", value: "4" },
  { label: "Item 5", value: "5" },
  { label: "Item 6", value: "6" },
  { label: "Item 7", value: "7" },
  { label: "Item 8", value: "8" },
];

export default function Dropdown({ label }: { label?: string }) {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const themeColor = useThemeColor();

  const styles = StyleSheet.create({
    text: {
      fontSize: FontSizes.md,
      color: themeColor.foreground,
    },
  });

  return (
    <>
      <Text weight="semibold" size="lg">
        {label}
      </Text>

      <ElementDropdown
        style={[
          {
            height: 40,
            borderWidth: 1,
            borderColor: themeColor.foreground,
            borderRadius: 6,
            paddingHorizontal: 12,
          },
        ]}
        placeholderStyle={[styles.text]}
        selectedTextStyle={[styles.text]}
        inputSearchStyle={[
          styles.text,
          { color: themeColor.muted, borderRadius: 6 },
        ]}
        containerStyle={{
          backgroundColor: themeColor.background,
          marginVertical: 10,
          borderRadius: 6,
          borderWidth: 1,
        }}
        itemTextStyle={[styles.text]}
        itemContainerStyle={{}}
        data={data}
        search
        maxHeight={240}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? "Select item" : "..."}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value);
          setIsFocus(false);
        }}
      />
    </>
  );
}
