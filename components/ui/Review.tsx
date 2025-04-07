// Review.tsx
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { StyleSheet } from "react-native";
import Icon from "@/components/ui/Icon";
import { useThemeColor } from "@/hooks/useThemeColor";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { format } from "date-fns";
import {
  UserReview,
  JobReview,
  ServiceReview,
} from "@/server/actions/review-actions";

type ReviewProps = {
  review: UserReview | JobReview | ServiceReview;
  displayImage?: boolean;
  showJobInfo?: boolean;
};

export default function Review({
  review,
  displayImage = true,
  showJobInfo = true,
}: ReviewProps) {
  const themeColor = useThemeColor();

  return (
    <View style={[styles.container, { borderBottomColor: themeColor.border }]}>
      <View style={styles.bottomContainer}>
        {displayImage && (
          <ImagePlaceholder
            width={50}
            height={50}
            style={styles.imgStyle}
            source={
              review.reviewer.avatar_url
                ? { uri: review.reviewer.avatar_url }
                : undefined
            }
          />
        )}
        <View style={styles.nameContainer}>
          <Text weight="semibold" size="md">
            {review.reviewer.username}
          </Text>
          <Text color="muted" size="sm">
            {format(new Date(review.created_at), "MMM d, yyyy")}
          </Text>
          <View style={styles.starsContainer}>
            {[...Array(5)].map((_, i) => (
              <Icon
                key={i}
                name={i < Math.floor(review.rating) ? "star" : "star-outline"}
                size="lg"
              />
            ))}
            <Text style={[styles.ratingText, { color: themeColor.foreground }]}>
              {review.rating.toFixed(1)}/5
            </Text>
          </View>
        </View>
      </View>

      {"job" in review && showJobInfo && review.job && (
        <View style={styles.jobInfoContainer}>
          <Text size="sm" color="muted">
            Job: {review.job.title || "N/A"}
          </Text>
          <Text size="sm" color="muted">
            Status: {review.job.progress_type || "N/A"}
          </Text>
        </View>
      )}

      <View style={styles.descriptionContainer}>
        <Text color="muted-dark">{review.review}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  nameContainer: {
    flex: 1,
  },
  starsContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 6,
    fontWeight: "semibold",
    fontSize: 14,
  },
  imgStyle: {
    borderRadius: 25,
  },
  descriptionContainer: {
    marginTop: 8,
  },
  jobInfoContainer: {
    marginBottom: 8,
    gap: 4,
  },
});
