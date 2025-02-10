import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Text from "@/components/ui/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import View, { ViewProps } from "../ui/View";
import { Link } from "expo-router";
import ImagePlaceholder from "../ui/ImagePlaceholder";
import { TPost } from "@/server/utils/example_data";
import Badge from "../ui/Badge";

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
          <View style={{ flexDirection: "row", flex: 1 }}>
            <View style={styles.entryContent}>
              <Text weight="semibold" numberOfLines={2}>
                {data.title}
              </Text>
              <Text size="sm">Due {data.due_date}</Text>
              <Text size="2xl" weight="semibold" style={{ marginTop: 8 }}>
                ${data.min_rate}
                {data.max_rate && "+"}
              </Text>

              {data.status && (
                <Text
                  weight="semibold"
                  color="muted"
                  size="sm"
                  style={{ marginTop: "auto" }}
                >
                  {data.status}
                </Text>
              )}
            </View>
            <Badge
              style={{ marginLeft: 10, width: 58, justifyContent: "center" }}
            >
              <Text
                style={{ textTransform: "uppercase" }}
                weight="semibold"
                size="sm"
              >
                {data.type}
              </Text>
            </Badge>
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
  },
  entryContent: {
    justifyContent: "space-between",
    flex: 1,
  },
});
