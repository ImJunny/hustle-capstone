import View, { ViewProps } from "@/components/ui/View";
import Text from "@/components/ui/Text";
import { StyleSheet } from "react-native";
import React from "react";
import Separator from "@/components/ui/Separator";

export type savedProps = {
  saved: string;
  rate: string;
  distance: string;
} & ViewProps;

export default function RecentSuggestion({
  saved,
  rate,
  distance,
  style,
}: savedProps) {
  return (
    <>
      <View style={[styles.container, style]}>
        <Text size="lg" style={styles.text}>
          {saved}
        </Text>
        <View style={styles.tag}>
          <Text size="sm" color="muted">
            {rate},
          </Text>
          <Text size="sm" color="muted">
            {distance}
          </Text>
        </View>
      </View>
      <Separator />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    margin: 8,
  },
  text: {
    justifyContent: "center",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
  },
});
