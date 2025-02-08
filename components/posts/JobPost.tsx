import React from "react";
import { ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import Text from "@/components/ui/Text";
import ImageBackgroundPlaceholder from "@/components/ui/ImageBackgroundPlaceholder";
import { useThemeColor } from "@/hooks/useThemeColor";
import Badge from "../ui/Badge";
import Icon from "../ui/Icon";
import View, { ViewProps } from "../ui/View";
import { Link } from "expo-router";
import ImagePlaceholder from "../ui/ImagePlaceholder";

type PostProps = {
  postID: number;
  title: string;
  rate: string;
  rating?: string;
  tags: string[];
  distance: string;
  status?: string;
} & ViewProps;

export default function JobPost({
  postID,
  title,
  rate,
  rating,
  tags,
  distance,
  status,
  style,
}: PostProps) {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;

  return (
    <Link href={`/job/${postID}`} asChild>
      <TouchableOpacity activeOpacity={0.65}>
        <View style={[styles.entry, { borderColor }, style]} color="background">
          <ImagePlaceholder
            width={100}
            height={100}
            style={{ borderRadius: 0 }}
          />
          <View style={styles.entryContent}>
            <Text
              size="md"
              weight="semibold"
              color="foreground"
              style={styles.title}
            >
              {title}
            </Text>
            <Text weight="semibold" color="foreground" size="sm">
              Due August 1
            </Text>
            <View style={styles.badgeRow}>
              <Badge style={{ flexDirection: "row", gap: 2 }}>
                <Text weight="semibold" size="sm">
                  $
                </Text>
                <Text weight="semibold" size="sm">
                  {rate}
                </Text>
              </Badge>
              {rating && (
                <Badge style={{ gap: 4 }}>
                  <Icon name="star" />
                  <Text weight="semibold" size="sm">
                    {rating}/5
                  </Text>
                </Badge>
              )}
              <Badge>{distance}</Badge>
              {tags.map((tag, i) => (
                <Badge key={i}>{tag}</Badge>
              ))}
              {/* <Badge>{tags[0]}</Badge> */}
            </View>
            {status && (
              <Text weight="semibold" color="foreground" size="sm">
                {status}
              </Text>
            )}

            <Text weight="normal" color="muted" size="sm">
              1 hour ago
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  entry: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    gap: 16,
    height: 160,
  },
  entryContent: {
    flex: 1,
    alignSelf: "stretch",
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
    marginBottom: 8,
    gap: 2,
  },
  title: {},
});
