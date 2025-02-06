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
        width={100}
        height={100}
        style={{ justifyContent: "center" }}
      >
        <Text style={{ textAlign: "center" }} color="background" weight="bold">
          {title}
        </Text>
      </ImageBackgroundPlaceholder>
    </View>
  );
}
