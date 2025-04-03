import { Image } from "expo-image";

export default function AvatarImage({
  url,
  size = 40,
}: {
  url: string | undefined | null;
  size?: number;
}) {
  return (
    <Image
      source={
        url ? { uri: url } : require("@/assets/images/default-avatar-icon.jpg")
      }
      style={{ width: size, height: size, borderRadius: 999 }}
    />
  );
}
