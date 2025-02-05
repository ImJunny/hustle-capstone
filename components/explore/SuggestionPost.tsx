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

function SuggestionPost({
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
        height={100}
        style={styles.entryImage}
      />
      <View style={styles.entryContent}>
        <Text
          size="xl"
          weight="bold"
          color="white"
          style={{ textAlign: "left" }}
        >
          {title}
        </Text>
        <View style={styles.tagRow}>
          <Text style={styles.tag}>{rate}</Text>
          <Text style={styles.tag}>{rating}</Text>
          <Text style={styles.tag}>{tags.join(", ")}</Text>
          <Text style={styles.tag}>{distance}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  entry: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
  },
  entryImage: {
    width: 100,
    height: 100,
    marginRight: 12,
  },
  entryContent: {
    flex: 1,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  tag: {
    backgroundColor: "#444444",
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
});

export default SuggestionPost;
