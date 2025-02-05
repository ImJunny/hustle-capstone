import { useThemeColor } from "@/hooks/useThemeColor";
import View, { ViewProps } from "./View";

export default function Separator({
  style,
  color = "border",
  ...props
}: ViewProps) {
  const themeColor = useThemeColor();
  const backgroundColor = themeColor[color];

  return (
    <View
      style={[{ height: 1, width: "100%", backgroundColor }, style]}
      {...props}
    />
  );
}
