import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import Badge from "@/components/ui/Badge";
import { StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { format, formatDistanceToNow, isThisYear } from "date-fns";
import { PostDetailsInfo } from "@/server/actions/post-actions";

type PostDetailsDescriptionSectionProps = {
  data: PostDetailsInfo;
};

export default function PostDetailsDescriptionSection({
  data,
}: PostDetailsDescriptionSectionProps) {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;

  let formattedDueDate = null;
  if (data.due_date)
    formattedDueDate = isThisYear(new Date(data.due_date))
      ? format(new Date(data.due_date), "MMMM d")
      : format(new Date(data.due_date), "MMMM d, yyyy");
  const createdAgo = formatDistanceToNow(new Date(data.created_at), {
    addSuffix: true,
  });

  return (
    <View style={[styles.section, { borderColor }]} color="background">
      <Text size="2xl" weight="semibold" style={{ marginVertical: 4 }}>
        {data.title}
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
        <Badge>
          <Text size="sm" weight="semibold">
            {data.location_type === "remote"
              ? "remote"
              : data.distance
              ? `< ${data.distance} mi`
              : "local"}
          </Text>
        </Badge>
        {data.tags?.map((tag, i) => (
          <Badge key={i}>{tag}</Badge>
        ))}
      </View>

      <Text>{data.description}</Text>
      <View style={styles.datesRow}>
        <Text color="muted">{createdAgo}</Text>
        {data.type == "work" && (
          <Text color="muted">Due {formattedDueDate}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: 16,
    borderBottomWidth: 1,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 12,
    gap: 8,
  },
  datesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  pageButton: {
    marginLeft: "auto",
    paddingHorizontal: 20,
  },
});
