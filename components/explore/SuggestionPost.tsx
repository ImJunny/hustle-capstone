import React from "react";
import { StyleSheet, ImageSourcePropType } from "react-native";
import Text from "@/components/ui/Text";
import ImageBackgroundPlaceholder from "@/components/ui/ImageBackgroundPlaceholder";
import { useThemeColor } from "@/hooks/useThemeColor";
import Badge from "../ui/Badge";
import Icon from "../ui/Icon";
import View, { ViewProps } from "../ui/View";

type SuggestionPostProps = {
  title: string;
  rate: string;
  rating: string;
  tags: string[];
  distance: string;
} & ViewProps;

export default function SuggestionPost({
  title,
  rate,
  rating,
  tags,
  distance,
  style,
}: SuggestionPostProps) {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;

  return (
    <View style={[styles.entry, { borderColor }, style]} color="background">
      <ImageBackgroundPlaceholder
        width={100}
        height={100}
        style={styles.entryImage}
      />
      <View style={styles.entryContent}>
        <Text
          size="md"
          weight="bold"
          color="white"
          style={[styles.title, { textAlign: "left" }]}
        >
          {title}
        </Text>
        <View style={styles.badgeRow}>
          <Badge>
            <Icon name="logo-usd" />
            {rate}
          </Badge>
          <Badge style={{ gap: 4 }}>
            <Icon name="star" />
            {rating}
          </Badge>
          <Badge>{tags.join(", ")}</Badge>
          <Badge>{distance}</Badge>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  entry: {
    flexDirection: "row",
    alignItems: "center",
    height: 96,
    marginBottom: 2,
    borderBottomWidth: 1,
  },
  entryImage: {
    width: 96,
    height: "100%",
    marginRight: 12,
  },
  entryContent: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
    gap: 8,
  },
  title: {
    paddingVertical: 2,
  },
});
