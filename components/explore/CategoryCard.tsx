import View, { ViewProps } from "@/components/ui/View";
import Text from "@/components/ui/Text";
import ImageBackgroundPlaceholder from "@/components/ui/ImageBackgroundPlaceholder";
import { StyleSheet } from "react-native";
import React from "react";

type CategoryCardProps = {
  title: string;
} & ViewProps;

export default function CategoryCard({ title, style }: CategoryCardProps) {
  return (
    <View style={{ marginRight: 10 }}>
      <ImageBackgroundPlaceholder
        width={100}
        height={100}
        style={{ justifyContent: "center" }}
      >
        <Text style={{ textAlign: "center" }}>{title}</Text>
      </ImageBackgroundPlaceholder>
    </View>
  );
}
