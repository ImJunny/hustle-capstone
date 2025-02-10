import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Text from "@/components/ui/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import Badge from "../ui/Badge";
import View, { ViewProps } from "../ui/View";
import { Link } from "expo-router";
import ImagePlaceholder from "../ui/ImagePlaceholder";
import { TJobPost } from "@/server/utils/example_data";

export type JobPostProps = {
  data: TJobPost;
} & ViewProps;

export default function JobPost({ data, style }: JobPostProps) {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;

  return (
    <Link href={`/job/${data.uuid}`} asChild>
      <TouchableOpacity activeOpacity={0.65}>
        <View style={[styles.entry, { borderColor }, style]} color="background">
          <ImagePlaceholder
            width={100}
            height={100}
            style={{ borderRadius: 4 }}
          />
          <View style={styles.entryContent}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <Text color="muted" size="sm" weight="semibold">
                {data.user_name}
              </Text>
              <Text color="muted" size="sm" weight="semibold">
                {data.time_ago}
              </Text>
            </View>
            <Text weight="semibold">{data.title}</Text>
            <Text weight="semibold" size="sm">
              Due {data.date}
            </Text>
            <View style={styles.badgeRow}>
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
            {data.status && (
              <Text weight="semibold" color="muted" size="sm">
                {data.status}
              </Text>
            )}
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
    height: 180,
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
