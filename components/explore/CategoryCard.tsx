import View, { ViewProps } from "@/components/ui/View";
import Text from "@/components/ui/Text";
import ImageBackgroundPlaceholder from "@/components/ui/ImageBackgroundPlaceholder";
import React from "react";

type CategoryCardProps = {
  title: string;
} & ViewProps;

export default function CategoryCard({ title, style }: CategoryCardProps) {
  return (
    <View
      style={[{ marginRight: 10, borderRadius: 4, overflow: "hidden" }, style]}
    >
      <ImageBackgroundPlaceholder
        width={100}
        height={100}
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
        dark
      >
        <Text
          style={{ textAlign: "center" }}
          color="white"
          weight="bold"
          size="md"
        >
          {title}
        </Text>
      </ImageBackgroundPlaceholder>
    </View>
  );
}
