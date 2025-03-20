import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import Badge from "@/components/ui/Badge";
import { StyleSheet } from "react-native";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { format, formatDistanceToNow, isThisYear } from "date-fns";
import { PostDetailsInfo } from "@/server/actions/post-actions";
import { useRouter } from "expo-router"; // Import the router hook

type PostDetailsDescriptionSectionProps = {
  data: PostDetailsInfo;
};

export default function PostDetailsDescriptionSection({
  data,
}: PostDetailsDescriptionSectionProps) {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;
  const router = useRouter(); // Initialize the router

  let formattedDueDate = null;
  if (data.due_date)
    formattedDueDate = isThisYear(new Date(data.due_date))
      ? format(new Date(data.due_date), "MMMM d")
      : format(new Date(data.due_date), "MMMM d, yyyy");
  const createdAgo = formatDistanceToNow(new Date(data.created_at), {
    addSuffix: true,
  });

  const handleAcceptJob = () => {
    router.push({
      pathname: "/confirmation",
      params: { job_uuid: data.uuid }, // Pass `job_uuid` as a query parameter
    });
  };

  return (
    <View style={[styles.section, { borderColor }]}>
      <Text size="2xl" weight="semibold" style={{ marginVertical: 4 }}>
        {data.title}
      </Text>
      <Text weight="semibold" size="4xl">
        ${data.min_rate}
        {data.max_rate && "-" + `$${data.max_rate}`}
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
          {data.location_type === "remote" ? "remote" : "IMPLEMENT DISTANCE"}
        </Badge>
        {data.post_tags.length > 0 &&
          data.post_tags.map((tag, i) => <Badge key={i}>{tag.tag_name}</Badge>)}
      </View>
      <Text>{data.description}</Text>
      <View style={styles.datesRow}>
        <Text color="muted">{createdAgo}</Text>
        {data.type == "work" && (
          <Text color="muted">Due {formattedDueDate}</Text>
        )}
      </View>

      <View style={styles.actionsRow}>
        <IconButton name="add-circle-outline" size="2xl" />
        <IconButton name="chatbubble-outline" size="2xl" flippedX />
        <IconButton name="paper-plane-outline" size="2xl" />
        {data.type == "work" ? (
          <Button style={styles.pageButton} onPress={handleAcceptJob}>
            Accept job
          </Button>
        ) : (
          <Button style={styles.pageButton}>Hire service</Button>
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
  actionsRow: {
    flexDirection: "row",
    gap: 16,
    paddingBottom: 16,
    width: "100%",
    alignItems: "center",
    marginTop: 16,
  },
  pageButton: {
    marginLeft: "auto",
    paddingHorizontal: 20,
  },
});
