import View, { ViewProps } from "@/components/ui/View";
import Text from "@/components/ui/Text";
import ImageBackgroundPlaceholder from "@/components/ui/ImageBackgroundPlaceholder";
import React from "react";
import { ImageBackground } from "expo-image";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";

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
      color="background"
      style={{ marginRight: 10, borderRadius: 4, overflow: "hidden" }}
    >
      <TouchableOpacity
        onPress={() => {
          router.push(`/search?tags=["${data.value}"]`);
        }}
        activeOpacity={0.6}
      >
        <View style={[{}, style]}>
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
      </TouchableOpacity>
    </View>
  );
}
