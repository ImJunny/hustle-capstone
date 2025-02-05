import View, { ViewProps } from "@/components/ui/View";
import Text from "@/components/ui/Text";
import ImageBackgroundPlaceholder from "@/components/ui/ImageBackgroundPlaceholder";
import { StyleSheet } from "react-native";
import React from "react";
import Separator from "@/components/ui/Separator";

export type recentProps = {
  recent: string;
} & ViewProps;

export default function RecentSuggestion({ recent, style }: recentProps) {
  return (
    <>
      <View style={[styles.container, style]}>
        <Text size="lg" style={styles.text}>
          {recent}
        </Text>
      </View>
      <Separator />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#272727",
    borderRadius: 8,
    margin: 16,
  },
  text: {
    justifyContent: "center",
    paddingVertical: 16,
  },
});
