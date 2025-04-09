import View from "../ui/View";
import { StyleSheet, TouchableOpacity } from "react-native";
import Text from "../ui/Text";
import Icon from "../ui/Icon";
import { router } from "expo-router";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import TrackJobReview from "./TrackJobReview";
import Skeleton from "../ui/Skeleton";

export default function TrackJobReviewSection({
  initiated_uuid,
}: {
  initiated_uuid: string;
}) {
  const { user } = useAuthData();
  const { data: isReviewed, isLoading } =
    trpc.review.is_already_reviewed.useQuery({
      user_uuid: user?.id as string,
      initiated_uuid,
    });

  if (isReviewed) {
    return (
      <Skeleton show={isLoading}>
        <View style={{ marginVertical: 52 }}>
          <Text weight="semibold" size="lg" style={{ textAlign: "center" }}>
            Your review
          </Text>
          <TrackJobReview
            initiated_uuid={initiated_uuid}
            user_uuid={user?.id as string}
          />
        </View>
      </Skeleton>
    );
  }

  return (
    <View>
      <TouchableOpacity
        onPress={() =>
          router.push(`/create-review?initiated_uuid=${initiated_uuid}` as any)
        }
      >
        <View style={[styles.entry]}>
          <Text style={styles.entryText}>Leave a review</Text>
          <Icon name="chevron-forward" size="xl" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  entry: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 28,
  },
  entryText: {
    marginRight: "auto",
  },
});
