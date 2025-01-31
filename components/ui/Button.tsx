import { StyleSheet, TouchableOpacity, ViewProps } from "react-native";
import { TColors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";

type ButtonProps = {
  children: React.ReactNode;
  color?: TColors;
  fullWidth?: boolean;
  onPress?: () => void;
} & ViewProps;

export default function Button({
  children,
  color = "foreground",
  fullWidth,
  style,
  onPress,
}: ButtonProps) {
  const themeColor = useThemeColor()

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.buttonContainer,
        { backgroundColor: themeColor.foreground, width: fullWidth ? "100%" : "auto" },
        style,
      ]}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
});
