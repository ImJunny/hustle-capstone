import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Text from "@/components/ui/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import Badge from "../ui/Badge";
import View, { ViewProps } from "../ui/View";
import { Link } from "expo-router";
import ImagePlaceholder from "../ui/ImagePlaceholder";
import { TJobPost } from "@/server/utils/example_data";

export type ServicePostProps = {
  data: TJobPost;
} & ViewProps;

export default function ServicePost({ data, style }: ServicePostProps) {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;
  const { distance, min_rate, tags, title, uuid, max_rate, status } = data;

  return (
    <Link href={`/job/${uuid}`} asChild>
      <TouchableOpacity activeOpacity={0.65}>
        <View style={[styles.entry, { borderColor }, style]} color="background">
          <ImagePlaceholder
            width={112}
            height={112}
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
                  {min_rate}
                  {max_rate && "+"}
                </Text>
              </Badge>
              <Badge>{distance}</Badge>
              {tags.map((tag, i) => (
                <Badge key={i}>{tag}</Badge>
              ))}
            </View>
            {status && (
              <Text weight="semibold" color="muted" size="sm">
                {status}
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
    height: 144,
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
