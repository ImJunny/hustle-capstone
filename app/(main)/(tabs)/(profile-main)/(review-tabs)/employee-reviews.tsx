import { useAuthData } from "@/contexts/AuthContext";
import ScrollView from "@/components/ui/ScrollView";
import View from "@/components/ui/View";
import Text from "@/components/ui/Text";
import LoadingView from "@/components/ui/LoadingView";
import { trpc } from "@/server/lib/trpc-client";
import Review from "@/components/ui/Review";

export function EmployeeReviewScreen() {
  const { user } = useAuthData();
  const {
    data: reviews,
    isLoading,
    error,
  } = trpc.review.get_user_reviews.useQuery({
    reviewee_uuid: user?.id || "",
  });

  if (!user?.id) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text weight="semibold" size="xl">
          Please log in to view your reviews
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return <LoadingView />;
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Failed to load reviews</Text>
      </View>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No reviews found</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      {reviews.map((review) => (
        <Review key={review.uuid} review={review} />
      ))}
    </ScrollView>
  );
}
