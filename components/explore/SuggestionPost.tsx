import React from "react";
import { View, StyleSheet, ImageSourcePropType } from "react-native";
import Text from "@/components/ui/Text";
import ImageBackgroundPlaceholder from "@/components/ui/ImageBackgroundPlaceholder";
import { useThemeColor } from "@/hooks/useThemeColor";
import Badge from "../ui/Badge";
import Icon from "../ui/Icon";

type SuggestionPostProps = {
  imageSource: ImageSourcePropType;
  title: string;
  rate: string;
  rating: string;
  tags: string[];
  distance: string;
};

export default function SuggestionPost({
  imageSource,
  title,
  rate,
  rating,
  tags,
  distance,
}: SuggestionPostProps) {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;

  return (
    <View style={[styles.entry, { borderColor }]}>
      <ImageBackgroundPlaceholder
        source={imageSource}
        width={100}
        height={96}
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
    borderBottomWidth: 2,
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
