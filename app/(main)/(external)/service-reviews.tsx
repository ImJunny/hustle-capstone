import View from "@/components/ui/View";
import React from "react";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import ReviewPost from "@/components/review/ReviewPost";
import { ReviewData } from "@/server/actions/review-actions";
import LoadingScreen from "@/components/ui/LoadingScreen";
import Text from "@/components/ui/Text";
import { useLocalSearchParams } from "expo-router";

export default function ServiceReviewsScreen() {
  const { uuid } = useLocalSearchParams();
  const { data, isLoading, error } = trpc.review.get_services_reviews.useQuery({
    post_uuid: uuid as string,
  });

  if (!data || isLoading || error) {
    return <LoadingScreen data={data} loads={isLoading} errors={error} />;
  } else if (data.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No service reviews yet</Text>
      </View>
    );
  }

  return (
    <>
      <View color="background" style={{ flex: 1 }}>
        {data?.map((review, i) => (
          <ReviewPost key={i} data={review as unknown as ReviewData} />
        ))}
      </View>
    </>
  );
}
