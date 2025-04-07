import { useAuthData } from "@/contexts/AuthContext";
import ScrollView from "@/components/ui/ScrollView";
import View from "@/components/ui/View";
import Text from "@/components/ui/Text";
import LoadingView from "@/components/ui/LoadingView";
import { trpc } from "@/server/lib/trpc-client";
import Review from "@/components/ui/Review";
import { StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export function EmployerReviewScreen() {
  const { user } = useAuthData();
  const themeColor = useThemeColor();

  const {
    data: reviews,
    isLoading,
    error,
  } = trpc.review.get_user_reviews.useQuery({
    reviewee_uuid: user?.id || "",
  });

  if (!user?.id) {
    return (
      <View
        style={[styles.container, { backgroundColor: themeColor.background }]}
      >
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
      <View
        style={[styles.container, { backgroundColor: themeColor.background }]}
      >
        <Text>Failed to load reviews</Text>
      </View>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <View
        style={[styles.container, { backgroundColor: themeColor.background }]}
      >
        <Text>No reviews found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: themeColor.background }}>
      <View style={[styles.header, { borderBottomColor: themeColor.border }]}>
        <Text weight="bold" size="xl">
          Employer Reviews
        </Text>
        <Text color="muted" size="sm">
          {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
        </Text>
      </View>
      <ScrollView>
        {reviews.map((review) => (
          <Review key={review.uuid} review={review} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
});
