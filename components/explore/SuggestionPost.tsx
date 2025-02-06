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
  rating?: string;
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
        width={85}
        height={85}
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
            <View style={{ flexDirection: "row", gap: 2 }}>
              <Text weight="semibold" size="sm">
                $
              </Text>
              <Text weight="semibold" size="sm">
                {rate}
              </Text>
            </View>
          </Badge>
          {rating && (
            <Badge style={{ gap: 4 }}>
              <Icon name="star" />
              {rating}
            </Badge>
          )}
          <Badge>{tags[0]}</Badge>
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
    height: 85,
    marginBottom: 2,
    borderBottomWidth: 1,
  },
  entryImage: {
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
