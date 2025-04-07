import { SimpleHeader } from "@/components/headers/Headers";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { useAuthData } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { trpc } from "@/server/lib/trpc-client";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import Toast from "react-native-toast-message";
import * as Haptics from "expo-haptics";

export default function CreateReviewScreen() {
  const themeColor = useThemeColor();
  const { uuid, reviewee_uuid, reviewer_type } = useLocalSearchParams();
  const { user } = useAuthData();
  const utils = trpc.useUtils();

  // Form state
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate params
  useEffect(() => {
    if (!uuid || !reviewee_uuid || !reviewer_type) {
      Toast.show({
        type: "error",
        text1: "Missing required parameters",
      });
      router.back();
    }
  }, [uuid, reviewee_uuid, reviewer_type]);

  // Create review mutation
  const { mutate: createReview } = trpc.review.create_review.useMutation({
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show({
        type: "success",
        text1: "Review submitted successfully",
      });
      utils.review.invalidate();
      router.back();
    },
    onError: (error) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Toast.show({
        type: "error",
        text1: "Failed to submit review",
        text2: error.message,
      });
      setIsSubmitting(false);
    },
  });

  const handleSubmit = () => {
    if (!reviewText.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Toast.show({
        type: "error",
        text1: "Please write your review",
      });
      return;
    }

    setIsSubmitting(true);
    createReview({
      reviewer_uuid: user?.id!,
      reviewee_uuid: reviewee_uuid as string,
      job_uuid: uuid as string,
      review: reviewText,
      rating,
      reviewer_type: reviewer_type as "employer" | "employee",
    });
  };

  return (
    <>
      <SimpleHeader
        title={`Leave ${
          reviewer_type === "employer" ? "Employee" : "Employer"
        } Review`}
      />

      <View style={styles.container} color="background">
        <View style={styles.section}>
          <Text weight="semibold" size="lg" style={styles.sectionTitle}>
            Your Rating
          </Text>
        </View>

        <View style={styles.section}>
          <Text weight="semibold" size="lg" style={styles.sectionTitle}>
            Your Review
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: themeColor.border,
                backgroundColor: themeColor.background,
                color: themeColor.foreground,
              },
            ]}
            placeholder={`Share your experience working with this ${
              reviewer_type === "employer" ? "employer" : "employee"
            }...`}
            placeholderTextColor={themeColor.muted}
            multiline
            numberOfLines={5}
            value={reviewText}
            onChangeText={setReviewText}
          />
        </View>

        <View style={styles.footer}>
          <Button
            onPress={handleSubmit}
            disabled={isSubmitting}
            style={isSubmitting ? { opacity: 0.7 } : undefined}
          >
            Submit Review
          </Button>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    minHeight: 150,
    textAlignVertical: "top",
  },
  footer: {
    marginTop: "auto",
    paddingBottom: 20,
  },
});
