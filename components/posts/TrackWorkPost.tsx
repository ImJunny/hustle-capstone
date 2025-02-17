import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Text from "@/components/ui/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import View, { ViewProps } from "../ui/View";
import { Link } from "expo-router";
import ImagePlaceholder from "../ui/ImagePlaceholder";
import { TPost } from "@/server/utils/example_data";
import Icon from "../ui/Icon";

export type TrackWorkPostProps = {
  data: TPost;
} & ViewProps;

export default function TrackWorkPost({ data, style }: TrackWorkPostProps) {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;

  return (
    <Link href={`/job/${data.uuid}`} asChild>
      <TouchableOpacity activeOpacity={0.65}>
        <View style={[styles.entry, { borderColor }, style]} color="background">
          <ImagePlaceholder
            width={90}
            height={90}
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
                <Text style={{ marginLeft: 2 }} size="sm">
                  2
                </Text>
              </View>
            )}

            {data.progress === "in progress" ? (
              <Text weight="semibold" size="lg">
                In progress
              </Text>
            ) : data.progress === "accepted" ? (
              <Text weight="semibold" color="muted" size="lg">
                Accepted, awaiting approval
              </Text>
            ) : data.progress === "awaiting" ? (
              <Text weight="semibold" color="yellow" size="lg">
                Awaiting payment from employer
              </Text>
            ) : data.progress === "overdue" ? (
              <Text weight="semibold" color="red" size="lg">
                Overdue
              </Text>
            ) : (
              <Text weight="semibold" color="green" size="lg">
                Paid
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
  },
  entryContent: {
    flex: 1,
    alignSelf: "stretch",
  },
});
