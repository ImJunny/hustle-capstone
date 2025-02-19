import { ImageBackground, ImageBackgroundProps } from "react-native";
import View from "./View";

type ImageBackgroundPlaceholderProps = {
  width?: number;
  height?: number;
  dark?: boolean;
} & ImageBackgroundProps;

export default function ImageBackgroundPlaceholder({
  style,
  children,
  width = 200,
  height = 200,
  dark,
}: ImageBackgroundPlaceholderProps) {
  return (
    <ImageBackground
      source={{
        uri: `https://picsum.photos/${width}/${height}?${Math.random()}`,
      }}
      style={[{ height, width }, style]}
    >
      {dark && (
        <View
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.4)",
            position: "absolute",
          }}
        />
      )}
      {children}
    </ImageBackground>
  );
}
