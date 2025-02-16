import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Text from "@/components/ui/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import Badge from "../ui/Badge";
import View, { ViewProps } from "../ui/View";
import { Link } from "expo-router";
import ImagePlaceholder from "../ui/ImagePlaceholder";
import { TPost } from "@/server/utils/example_data";
import Icon from "../ui/Icon";

export type JobPostProps = {
  data: TPost;
} & ViewProps;

export default function Post({ data, style }: JobPostProps) {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;

  return (
    <Link href={`/job/${data.uuid}`} asChild>
      <TouchableOpacity activeOpacity={0.65}>
        <View style={[styles.entry, { borderColor }, style]} color="background">
          <ImagePlaceholder
            width={116}
            height={116}
            style={{ borderRadius: 4 }}
          />
          <View style={styles.entryContent}>
            <Text weight="semibold" numberOfLines={1}>
              {data.title}
            </Text>
            {data.type == "work" ? (
              <Text size="sm">Due {data.due_date}</Text>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 4,
                  gap: 4,
                  alignItems: "center",
                }}
              >
                <Icon name="star" />
                <Icon name="star" />
                <Icon name="star" />
                <Icon name="star-half" />
                <Icon name="star-outline" />
                <Text style={{ marginLeft: 2 }}>2</Text>
              </View>
            )}

            <Text weight="semibold" size="2xl" style={{ marginTop: 4 }}>
              ${data.min_rate}
              {data.max_rate && "+"}
            </Text>

            <View style={styles.badgeRow}>
              <Badge>
                <Text
                  style={{ textTransform: "uppercase" }}
                  size="sm"
                  weight="semibold"
                >
                  {data.type}
                </Text>
              </Badge>
              <Badge>{data.distance}</Badge>
              <Badge>{data.tags[0]}</Badge>
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
