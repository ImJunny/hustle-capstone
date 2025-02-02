import { Image, ImageProps } from "react-native";

export default function ImagePlaceholder({
  style,
  width = 200,
  height = 200,
}: ImageProps) {
  return (
    <Image
      source={{
        uri: `https://picsum.photos/${width}/${height}?${Math.random()}`,
      }}
      style={[{ height, width }, style]}
    />
  );
}
