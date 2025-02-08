import View, { ViewProps } from "@/components/ui/View";
import Text from "@/components/ui/Text";
import ImageBackgroundPlaceholder from "@/components/ui/ImageBackgroundPlaceholder";
import React from "react";

type CategoryCardProps = {
  title: string;
} & ViewProps;

export default function CategoryCard({ title, style }: CategoryCardProps) {
  return (
    <View style={[{ marginRight: 10 }, style]}>
      <ImageBackgroundPlaceholder
        width={90}
        height={90}
        style={{ justifyContent: "center" }}
        dark
      >
        <Text
          style={{ textAlign: "center" }}
          color="white"
          weight="bold"
          size="lg"
        >
          {title}
        </Text>
      </ImageBackgroundPlaceholder>
    </View>
  );
}
