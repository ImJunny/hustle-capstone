import React from "react";
import { View, StyleSheet, ImageSourcePropType } from "react-native";
import Text from "@/components/ui/Text";
import ImageBackgroundPlaceholder from "@/components/ui/ImageBackgroundPlaceholder";
import { useThemeColor } from "@/hooks/useThemeColor";

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
        <View style={styles.tagRow}>
          <Text size="sm" weight="semibold" color="white" style={styles.tag}>
            {rate}
          </Text>
          <Text size="sm" weight="semibold" color="white" style={styles.tag}>
            {rating}
          </Text>
          <Text size="sm" weight="semibold" color="white" style={styles.tag}>
            {tags.join(", ")}
          </Text>
          <Text size="sm" weight="semibold" color="white" style={styles.tag}>
            {distance}
          </Text>
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
    width: 100,
    height: 96,
    marginRight: 12,
    borderBottomWidth: 1,
  },
  entryContent: {
    flex: 1,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
    color: "black",
  },
  title: {
    paddingTop: 6,
  },
  tag: {
    backgroundColor: "#444444",
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 6,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    minWidth: 50,
    alignSelf: "center",
  },
});
