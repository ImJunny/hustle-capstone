import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Text from "@/components/ui/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import View, { ViewProps } from "../ui/View";
import { Link } from "expo-router";
import { TrackJobPost as TrackJobPostType } from "@/server/actions/jobs-actions";
import { Image } from "expo-image";
import { format, isSameYear } from "date-fns";

export type TrackJobPostProps = {
  data: TrackJobPostType;
} & ViewProps;

export default function TrackJobPost({ data, style }: TrackJobPostProps) {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;
  const dueDate = new Date(data.due_date!);
  const formattedDueDate = isSameYear(dueDate, new Date())
    ? format(dueDate, "MMMM d")
    : format(dueDate, "MMMM d, yyyy");

  return (
    <Link href={`/track/working/${data.uuid}`} asChild>
      <TouchableOpacity activeOpacity={0.65}>
        <View style={[styles.entry, { borderColor }, style]} color="background">
          <Image
            source={{ uri: data.image_url }}
            style={{ width: 80, height: 80, borderRadius: 4 }}
          />
          <View style={styles.entryContent}>
            <Text weight="semibold" numberOfLines={1}>
              {data.title}
            </Text>

            <Text size="sm" style={{ marginBottom: 8 }}>
              Due {formattedDueDate}
            </Text>

            {data.progress === "in progress" ? (
              <Text weight="semibold" size="lg">
                In progress
              </Text>
            ) : data.progress === "accepted" ? (
              <Text color="muted">Accepted, awaiting approval</Text>
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
