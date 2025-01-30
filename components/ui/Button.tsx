import { StyleSheet, TouchableOpacity, ViewProps } from "react-native";
import { TColors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";

type ButtonProps = {
  children: React.ReactNode;
  color?: TColors;
  fullWidth?: boolean;
} & ViewProps;

export default function Button({
  children,
  color = "foreground",
  fullWidth,
  style,
}: ButtonProps) {
  const buttonColor = useThemeColor(color);

  return (
    <TouchableOpacity
      style={[
        styles.buttonContainer,
        { backgroundColor: buttonColor, width: fullWidth ? "100%" : "auto" },
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
