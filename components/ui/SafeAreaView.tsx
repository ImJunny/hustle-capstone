import { SafeAreaView as NativeSafeAreaView } from "react-native";
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

  return <NativeSafeAreaView style={[{ backgroundColor }, style]} {...props} />;
}
