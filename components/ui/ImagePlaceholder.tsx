import { Image, ImageProps } from "react-native";
import View, { ViewProps } from "./View";

type ImagePlaceholderProps = {
  width?: number;
  height?: number;
  isDark?: boolean;
} & ImageProps;

export default function ImagePlaceholder({
  style,
  width = 200,
  height = 200,
  isDark,
}: ImagePlaceholderProps & ViewProps) {
  return (
    <View style={[{ width, height, overflow: "hidden" }, style]}>
      <Image
        fadeDuration={175}
        source={{
          uri: `https://picsum.photos/${width}/${height}?${Math.random()}`,
        }}
        style={{
          height: "100%",
          width: "100%",
        }}
      />
      {isDark && (
        <View
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.42)",
            position: "absolute",
          }}
        />
      )}
    </View>
  );
}
