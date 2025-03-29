import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Text from "@/components/ui/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import Badge from "../ui/Badge";
import View, { ViewProps } from "../ui/View";
import { Link } from "expo-router";
import Icon from "../ui/Icon";
import { Image } from "expo-image";
import { format, isThisYear } from "date-fns";
import { Post as TPost } from "@/server/actions/post-actions";

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

    if (distance <= 1) return "< 1 mi";
    else if (distance <= 5) return "< 5 mi";
    else if (distance <= 10) return "< 10 mi";
    else if (distance <= 15) return "< 15 mi";
    else if (distance <= 20) return "< 20 mi";
    else if (distance <= 25) return "< 25 mi";
    else if (distance <= 50) return "< 50 mi";
    else return "> 50 mi";
  }
  const distance = getGeneralDistance(data.distance ?? null);

  return (
    <Link href={`/post/${data.uuid}` as any} asChild>
      <TouchableOpacity activeOpacity={0.65}>
        <View style={[styles.entry, { borderColor }, style]} color="background">
          <Image
            style={{ width: 116, height: 116, borderRadius: 4 }}
            source={{
              uri: `https://hustle-images-bucket.s3.us-east-2.amazonaws.com/${data.uuid}-0`,
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
              {/* <Badge>{data.tags[0]}</Badge> */}
            </View>
            {/* {data.status && (
              <Text weight="semibold" color="muted" size="sm">
                {data.status}
              </Text>
            )} */}
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
