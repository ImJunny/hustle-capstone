import View, { ViewProps } from "@/components/ui/View";
import Text from "@/components/ui/Text";
import ImageBackgroundPlaceholder from "@/components/ui/ImageBackgroundPlaceholder";
import React from "react";
import { ImageBackground } from "expo-image";

type CategoryCardProps = {
  data: {
    label: string;
    value: string;
    image: any;
  };
} & ViewProps;

export default function CategoryCard({ data, style }: CategoryCardProps) {
  return (
    <View
      style={[{ marginRight: 10, borderRadius: 4, overflow: "hidden" }, style]}
    >
      <ImageBackground
        source={data.image}
        style={{
          width: 100,
          height: 100,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.35)",
            position: "absolute",
          }}
        />
        <Text
          style={{ textAlign: "center" }}
          color="white"
          weight="bold"
          size="lg"
        >
          {data.label}
        </Text>
      </ImageBackground>
    </View>
  );
}
