import React from "react";
import {
  StyleSheet,
  ImageSourcePropType,
  Touchable,
  TouchableOpacity,
} from "react-native";
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
} & ViewProps;

export default function ServicePost({
  postID,
  title,
  rate,
  rating,
  tags,
  distance,
  style,
}: PostProps) {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;

  return (
    <Link href={`/job/${postID}`} asChild>
      <TouchableOpacity activeOpacity={0.65}>
        <View style={[styles.entry, { borderColor }, style]} color="background">
          <ImagePlaceholder width={75} height={75} />
          <View style={styles.entryContent}>
            <Text
              size="md"
              weight="bold"
              color="foreground"
              style={styles.title}
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
              <Badge>{distance}</Badge>
              <Badge>{tags[0]}</Badge>
            </View>
            <Text size="sm" color="muted">
              @johnsmith
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
    height: 75,
  },
  entryContent: {
    flex: 1,
    padding: 12,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 2,
  },
  title: {
    marginBottom: 2,
  },
});
