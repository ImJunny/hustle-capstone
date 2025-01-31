import {
  View as NativeView,
  StyleSheet,
  TextInput,
  TextInputProps,
  type ViewProps as NativeViewProps,
} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { TColors } from "@/constants/Colors";

export type InputProps = {
  color?: TColors;
  placeholder?: string;
} & TextInputProps;

export default function Input({ style, placeholder, ...props }: InputProps) {
  const backgroundColor = useThemeColor()["background-variant"];
  const textColor = useThemeColor()["foreground"];
  const placeholderColor = useThemeColor()["muted"];
  return (
    <TextInput
      placeholder={placeholder}
      style={[
        { backgroundColor, color: textColor },
        styles.inputContainer,
        style,
      ]}
      placeholderTextColor={placeholderColor}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
});
