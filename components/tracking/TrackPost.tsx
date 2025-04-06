import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Text from "@/components/ui/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import View, { ViewProps } from "../ui/View";
import { router } from "expo-router";
import { TrackPost as TrackPostType } from "@/server/actions/jobs-actions";
import { Image } from "expo-image";
import { format, isSameYear } from "date-fns";

export type TrackJobPostProps = {
  data: TrackPostType;
  type: "work" | "hire";
  self?: boolean;
} & ViewProps;

export default function TrackPost({
  data,
  style,
  type,
  self,
}: TrackJobPostProps) {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;
  const dueDate = new Date(data.due_date!);
  const formattedDueDate = isSameYear(dueDate, new Date())
    ? format(dueDate, "MMMM d")
    : format(dueDate, "MMMM d, yyyy");

  return (
    <TouchableOpacity
      activeOpacity={0.65}
      onPress={() => {
        if (type === "work") router.push(`/track/working/${data.uuid}` as any);
        else router.push(`/track/hiring/${data.uuid}` as any);
      }}
    >
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
            <Text weight="semibold">In progress</Text>
          ) : data.progress === "accepted" ? (
            <Text weight="semibold">Accepted</Text>
          ) : data.progress === "approved" ? (
            <Text weight="semibold">Approved</Text>
          ) : data.progress === "complete" ? (
            <Text weight="semibold" color="yellow">
              Completed, {`${self ? "pay now" : "awaiting payment"}`}
            </Text>
          ) : data.progress === "paid" ? (
            <Text color="green" weight="semibold">
              Payment {`${self ? "sent" : "received"}`}
            </Text>
          ) : data.progress === "cancelled" ? (
            <Text color="muted" weight="semibold">
              Cancelled
            </Text>
          ) : data.progress === "closed" ? (
            <Text color="muted" weight="semibold">
              Closed
            </Text>
          ) : (
            <Text weight="semibold">{data.progress}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
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
