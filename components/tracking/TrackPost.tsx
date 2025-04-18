import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Text from "@/components/ui/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import View, { ViewProps } from "../ui/View";
import { router } from "expo-router";
import { TrackPost as TrackPostType } from "@/server/actions/jobs-actions";
import { Image } from "expo-image";
import { format, isSameYear } from "date-fns";
import Icon from "../ui/Icon";
import TrackPostImage from "./TrackPostImage";
import TrackPostProgress from "./TrackPostProgress";

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

  const handleRedirect = () => {
    if (type === "work") router.push(`/track/working/${data.uuid}` as any);
    else router.push(`/track/hiring/${data.uuid}` as any);
  };

  return (
    <TouchableOpacity activeOpacity={0.65} onPress={handleRedirect}>
      <View style={[styles.entry, { borderColor }, style]} color="background">
        <TrackPostImage data={data} />

        <View style={styles.entryContent}>
          <Text weight="semibold" numberOfLines={1}>
            {data.title}
          </Text>

          <Text size="sm" style={{ marginBottom: 8 }}>
            Due {formattedDueDate}
          </Text>

          <TrackPostProgress data={data} self={self} />
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
