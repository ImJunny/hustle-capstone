import { useThemeColor } from "@/hooks/useThemeColor";
import { Image, ImageStyle } from "expo-image";
import { ViewStyle } from "react-native";

export default function AvatarImage({
  url,
  size = 40,
  style,
}: {
  url: string | undefined | null;
  size?: number;
  style?: ImageStyle;
}) {
  const themeColor = useThemeColor();
  return (
    <Image
      source={
        url ? { uri: url } : require("@/assets/images/default-avatar-icon.jpg")
      }
      style={[
        {
          width: size,
          height: size,
          borderRadius: 999,
          borderColor: themeColor.border,
        },
        style,
      ]}
    />
  );
}
