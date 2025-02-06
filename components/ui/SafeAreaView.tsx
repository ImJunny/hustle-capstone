import { SafeAreaView as NativeSafeAreaView, StatusBar } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { TColors } from "@/constants/Colors";
import { SafeAreaViewProps as NativeSafeAreaViewProps } from "react-native-safe-area-context";

export type SafeAreaViewProps = {
  color?: TColors;
} & NativeSafeAreaViewProps;

export default function SafeAreaView({
  style,
  color = "background",
  ...props
}: SafeAreaViewProps) {
  const backgroundColor = useThemeColor()[color];
  const paddingTop = StatusBar.currentHeight || 0;

  return (
    <NativeSafeAreaView
      style={[{ backgroundColor, paddingTop }, style]}
      {...props}
    />
  );
}
