import { Image, ImageProps } from "react-native";
import View, { ViewProps } from "./View";
import { useState } from "react";

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
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <View style={[{ width, height, overflow: "hidden" }, style]}>
      <Image
        onLoad={handleImageLoad}
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
