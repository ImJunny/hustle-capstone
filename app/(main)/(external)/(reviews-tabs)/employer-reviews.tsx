import View from "@/components/ui/View";
import React from "react";
import { useAuthData } from "@/contexts/AuthContext";
import { trpc } from "@/server/lib/trpc-client";
import ReviewPost from "@/components/review/ReviewPost";
import { ReviewData } from "@/server/actions/review-actions";
import LoadingScreen from "@/components/ui/LoadingScreen";
import Text from "@/components/ui/Text";
import { useLocalSearchParams } from "expo-router";
import ScrollView from "@/components/ui/ScrollView";

export default function WorkerReviewsScreen() {
  const { uuid } = useLocalSearchParams();
  const { data, isLoading, error, refetch } = trpc.review.get_reviews.useQuery({
    user_uuid: uuid as string,
    reviewer_type: "employer",
  });

  if (!data || isLoading || error) {
    return <LoadingScreen data={data} loads={isLoading} errors={[error]} />;
  } else if (data.length === 0) {
    return (
      <ScrollView
        color="background"
        refetch={refetch}
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>No hirer reviews yet</Text>
      </ScrollView>
    );
  }

  return (
    <>
      <ScrollView color="background" style={{ flex: 1 }} refetch={refetch}>
        {data?.map((review, i) => (
          <ReviewPost key={i} data={review as unknown as ReviewData} />
        ))}
      </ScrollView>
    </>
  );
}
