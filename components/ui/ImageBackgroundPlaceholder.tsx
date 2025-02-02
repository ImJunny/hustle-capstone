import { ImageBackground, ImageBackgroundProps } from "react-native";

export default function ImageBackgroundPlaceholder({
  style,
  children,
  width = 200,
  height = 200,
}: ImageBackgroundProps) {
  return (
    <ImageBackground
      source={{
        uri: `https://picsum.photos/${width}/${height}?${Math.random()}`,
      }}
      style={[{ height, width }, style]}
    >
      {children}
    </ImageBackground>
  );
}
