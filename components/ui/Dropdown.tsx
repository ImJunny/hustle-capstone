import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  UIManager,
  findNodeHandle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { Dropdown as ElementDropdown } from "react-native-element-dropdown";
import Text from "./Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FontSizes } from "@/constants/Sizes";
import { TColors } from "@/constants/Colors";

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

const screenHeight = Dimensions.get("window").height;

export default function Dropdown({
  borderColor,
  data,
  value,
  onChange,
  style,
}: {
  borderColor?: TColors;
  data: { label: string; value: string }[];
  value: string | undefined;
  onChange: (item: { label: string; value: string }) => void;
  style: ViewStyle;
}) {
  const [dropdownY, setDropdownY] = useState(0);
  const themeColor = useThemeColor();

  const styles = StyleSheet.create({
    text: {
      fontSize: FontSizes.md,
      color: themeColor.foreground,
    },
  });

  const elementRef = useRef<View>(null);

  const handleLayout = () => {
    elementRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setDropdownY(pageY);
    });
  };

  return (
    <View ref={elementRef} onLayout={handleLayout} style={style}>
      <ElementDropdown
        style={{
          height: 40,
          borderWidth: 1,
          borderColor: themeColor[borderColor ?? "foreground"],
          borderRadius: 6,
          paddingHorizontal: 12,
        }}
        activeColor={themeColor["background-variant"]}
        placeholderStyle={styles.text}
        selectedTextStyle={styles.text}
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
        autoScroll={false}
        itemTextStyle={styles.text}
        dropdownPosition={dropdownY > screenHeight / 2 ? "top" : "bottom"}
        data={data}
        search={false}
        maxHeight={340}
        showsVerticalScrollIndicator={false}
        labelField="label"
        valueField="value"
        placeholder={value ?? "Select"}
        value={value}
        onChange={(item) => onChange(item.value)}
      />
    </View>
  );
}
