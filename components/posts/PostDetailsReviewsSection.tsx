import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Icon from "@/components/ui/Icon";
import IconButton from "@/components/ui/IconButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { trpc } from "@/server/lib/trpc-client";
import { PostDetailsInfo } from "@/server/actions/post-actions";
import StarDisplay from "../ui/StarDisplay";
import { router } from "expo-router";

export default function PostDetailsReviewsSection({
  data,
}: {
  data: PostDetailsInfo;
}) {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;
  const partition = data.avg_rating
    ? parseFloat(Number(data.avg_rating).toFixed(2)).toString()
    : "0";

  return (
    <View
      color="background"
      style={{
        padding: 16,
        borderColor,
        borderBottomWidth: 1,
      }}
    >
      <View style={{ marginTop: 16, marginBottom: 10 }}>
        <Text size="md" weight="semibold">
          Service Rating
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => router.push(`/service-reviews/${data.uuid}` as any)}
      >
        <View style={{ flexDirection: "row", marginBottom: 15 }}>
          <View>
            <Text size="4xl" weight="semibold">
              {partition} out of 5
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: 2,
                marginVertical: 6,
                alignItems: "center",
              }}
            >
              <StarDisplay rating={data.avg_rating ? data.avg_rating : 0} />

              <Text
                weight="semibold"
                style={{
                  marginLeft: 4,
                }}
              >
                {data.review_count} Review{data.review_count > 1 ? "s" : ""}
              </Text>
            </View>
          </View>
          <View style={styles.reviewButton}>
            <IconButton name="chevron-forward" size="2xl" />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    marginBottom: 8,
    gap: 8,
  },
  pageButton: {
    marginLeft: "auto",
    paddingHorizontal: 20,
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 8,
  },
  nameContainer: { marginLeft: 20 },
  messageButton: {
    marginLeft: "auto",
    paddingHorizontal: 16,
    gap: 12,
  },
  reviewButton: {
    marginLeft: "auto",
    marginTop: "auto",
  },
});
