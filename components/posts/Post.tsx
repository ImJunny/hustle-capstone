import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Text from "@/components/ui/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import Badge from "../ui/Badge";
import View, { ViewProps } from "../ui/View";
import { Link } from "expo-router";
import { Image } from "expo-image";
import { format, isThisYear } from "date-fns";
import { Post as TPost } from "@/server/actions/post-actions";
import StarDisplay from "../ui/StarDisplay";

type PostProps = {
  type: "work" | "hire";
  data: TPost;
} & ViewProps;

export default function Post({ type, data, style }: PostProps) {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;

  const formattedDueDate =
    type === "work" && data?.due_date
      ? isThisYear(new Date(data.due_date))
        ? format(new Date(data.due_date), "MMMM d")
        : format(new Date(data.due_date), "MMMM d, yyyy")
      : "";

  if (!data) return;

  function getGeneralDistance(distance: number | null) {
    if (data.location_type === "remote") return "remote";
    if (distance === null) return "local";

    distance = Math.ceil(distance);
    return `${distance} mi`;
  }
  const distance = getGeneralDistance(data.distance ?? null);

  return (
    <Link href={`/post/${data.uuid}` as any} asChild>
      <TouchableOpacity activeOpacity={0.65}>
        <View style={[styles.entry, { borderColor }, style]} color="background">
          <Image
            style={{
              width: 116,
              height: 116,
              borderRadius: 4,
            }}
            source={{
              uri: data.image_url!,
            }}
          />
          <View style={styles.entryContent}>
            <Text weight="semibold" numberOfLines={1}>
              {data.title}
            </Text>
            {data.type == "work" ? (
              <Text size="sm">Due {formattedDueDate}</Text>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 4,
                  gap: 4,
                  alignItems: "center",
                }}
              >
                <StarDisplay
                  rating={(data as any).avg_rating}
                  count={(data as any).review_count}
                />
              </View>
            )}

            <Text weight="semibold" size="2xl" style={{ marginTop: 4 }}>
              ${data.min_rate}
              {data.max_rate && " - " + `$${data.max_rate}`}
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
                  {distance}
                </Text>
              </Badge>
              {data.tags?.map((tag, i) => (
                <Badge key={i}>{tag}</Badge>
              ))}
            </View>
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
