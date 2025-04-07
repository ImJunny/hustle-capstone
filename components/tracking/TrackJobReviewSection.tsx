import View from "../ui/View";
import { StyleSheet, TouchableOpacity } from "react-native";
import Text from "../ui/Text";
import Icon from "../ui/Icon";
import { router } from "expo-router";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import LoadingScreen from "../ui/LoadingScreen";
import { SimpleHeader } from "../headers/Headers";
import SimpleReview from "../review/SimpleReview";

export default function TrackJobReviewSection({
  initiated_uuid,
}: {
  initiated_uuid: string;
}) {
  const { user } = useAuthData();
  const { data: isReviewed } = trpc.review.is_already_reviewed.useQuery({
    user_uuid: user?.id as string,
    initiated_uuid,
  });

  if (isReviewed) {
    return (
      <View>
        <Text weight="semibold">Your review</Text>
        <SimpleReview />
      </View>
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
    paddingVertical: 12,
  },
  entryText: {
    marginRight: "auto",
  },
});
