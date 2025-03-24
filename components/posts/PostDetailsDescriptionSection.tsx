import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React, { useEffect, useState } from "react";
import Badge from "@/components/ui/Badge";
import { StyleSheet } from "react-native";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { format, formatDistanceToNow, isThisYear } from "date-fns";
import { PostDetailsInfo } from "@/server/actions/post-actions";
import { useRouter } from "expo-router";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";

type PostDetailsDescriptionSectionProps = {
  data: PostDetailsInfo;
};

export default function PostDetailsDescriptionSection({
  data,
}: PostDetailsDescriptionSectionProps) {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;
  const router = useRouter();
  const { user } = useAuthData();

  let formattedDueDate = null;
  if (data.due_date)
    formattedDueDate = isThisYear(new Date(data.due_date))
      ? format(new Date(data.due_date), "MMMM d")
      : format(new Date(data.due_date), "MMMM d, yyyy");
  const createdAgo = formatDistanceToNow(new Date(data.created_at), {
    addSuffix: true,
  });

  const { data: isAccepted, isLoading } = trpc.job.is_accepted.useQuery({
    user_uuid: user?.id ?? "",
    job_uuid: data.uuid,
  });

  const handleAcceptJob = () => {
    router.push(
      isAccepted
        ? `/track/working/${data.uuid}`
        : `/confirmation?job_uuid=${data.uuid}`
    );
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
          <Text size="sm" weight="semibold">
            {data.location_type === "remote"
              ? "remote"
              : data.distance
              ? `< ${data.distance} mi`
              : "local"}
          </Text>
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
        <Button onPress={handleAcceptJob} style={{ marginLeft: "auto" }}>
          {data.type === "work"
            ? isAccepted
              ? "Manage job"
              : "Accept job"
            : "Hire service"}
        </Button>
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
