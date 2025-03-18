/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";

export function useThemeColor() {
  // const theme = useColorScheme() ?? "light";

const theme = "dark"

  return Colors[theme];
}
