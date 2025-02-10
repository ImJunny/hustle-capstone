import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Text from "@/components/ui/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import Badge from "../ui/Badge";
import View, { ViewProps } from "../ui/View";
import { Link } from "expo-router";
import ImagePlaceholder from "../ui/ImagePlaceholder";
import { TServicePost } from "@/server/utils/example_data";
import Icon from "../ui/Icon";

export type ServicePostProps = {
  data: TServicePost;
} & ViewProps;

export default function ServicePost({ data, style }: ServicePostProps) {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;

  return (
    <Link href={`/job/${data.uuid}`} asChild>
      <TouchableOpacity activeOpacity={0.65}>
        <View style={[styles.entry, { borderColor }, style]} color="background">
          <ImagePlaceholder
            width={80}
            height={80}
            style={{ borderRadius: 4 }}
          />

          <View style={styles.entryContent}>
            <Text weight="semibold">{data.title}</Text>
            <View style={styles.badgeRow}>
              {data.user_rating && (
                <Badge style={{ flexDirection: "row", gap: 2 }}>
                  <Icon name="star" />
                  <Text weight="semibold" size="sm">
                    {data.user_rating}/5
                  </Text>
                </Badge>
              )}
              <Badge style={{ flexDirection: "row", gap: 2 }}>
                <Text weight="semibold" size="sm">
                  $
                </Text>
                <Text weight="semibold" size="sm">
                  {data.min_rate}
                  {data.max_rate && "+"}
                </Text>
              </Badge>
              <Badge>{data.distance}</Badge>
              {data.tags.map((tag, i) => (
                <Badge key={i}>{tag}</Badge>
              ))}
            </View>
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
    height: 112,
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
    columnGap: 4,
    rowGap: 6,
  },
});
