import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SimpleHeader } from "@/components/headers/Headers";
import ScrollView from "@/components/ui/ScrollView";
import { Pressable, StyleSheet, TouchableOpacity } from "react-native";
import Button from "@/components/ui/Button";
import TrackingProgressBar from "@/components/tracking/TrackProgressBar";
import Separator from "@/components/ui/Separator";
import TrackTransactionEstimate from "@/components/tracking/TrackTransactionEstimate";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import { Image } from "expo-image";
import Toast from "react-native-toast-message";
import LoadingPost from "@/components/posts/LoadingPost";
import { getGeneralDate } from "@/utils/helpers";
import LoadingScreen from "@/components/ui/LoadingScreen";
import StarDisplay from "@/components/ui/StarDisplay";
import { TrackWorkingLabels } from "@/constants/Tracking";
import TrackJobStartButton from "@/components/tracking/TrackJobStartButton";
import TrackJobCompleteButton from "@/components/tracking/TrackJobCompleteButton";
import TrackCancelButton from "@/components/tracking/TrackCancelButton";
import TrackJobReviewSection from "@/components/tracking/TrackJobReviewSection";

export default function TrackWorkingDetailsScreen() {
  const { uuid } = useLocalSearchParams();
  const { user } = useAuthData();
  const utils = trpc.useUtils();

  const {
    data = null,
    isLoading,
    error,
    refetch,
  } = trpc.job.get_track_working_details.useQuery(
    {
      user_uuid: user?.id!,
      job_post_uuid: uuid as string,
    },
    { enabled: !!user }
  );

  const date = getGeneralDate(data?.due_date!);

  const {
    data: estimateData,
    isLoading: estimateLoading,
    error: estimateError,
  } = trpc.job.get_transaction_estimate.useQuery(
    {
      job_post_uuid: uuid as string,
      user_uuid: user?.id!,
    },
    { enabled: !!user }
  );

  const { mutate: unaccept, isLoading: unacceptLoading } =
    trpc.job.unaccept_job.useMutation({
      onSuccess: () => {
        Toast.show({
          text1: "Unaccepted job",
          swipeable: false,
        });
        utils.post.invalidate();
        utils.job.invalidate();
        router.back();
        router.setParams({
          param_type: "offer_accept",
        });
      },

      onError: (error) => {
        Toast.show({
          text1: error.message,
          type: "error",
          swipeable: false,
        });
      },
    });

  const handleUnaccept = () => {
    unaccept({
      initiated_job_post_uuid: data?.initiated_job_post_uuid!,
    });
  };

  const description = TrackWorkingLabels[data?.progress!] || "";

  // Fallbacks
  if (isLoading || estimateLoading || !data || error || estimateError) {
    return (
      <LoadingScreen
        data={data}
        loads={[isLoading, estimateLoading]}
        errors={[error, estimateError]}
        header={<SimpleHeader title="Tracking details" />}
      />
    );
  }

  // Actual render
  return (
    <>
      <SimpleHeader title="Tracking details" />
      <ScrollView color="background" style={styles.container} refetch={refetch}>
        {/**TOP SECTION */}
        <View style={styles.topSection}>
          <TouchableOpacity
            onPress={() => router.push(`/post/${data.job_post_uuid}`)}
          >
            <Image
              source={{ uri: data.job_image_url }}
              style={{ width: 100, height: 100, borderRadius: 4 }}
            />
          </TouchableOpacity>
          <View style={styles.textHeader}>
            <Text size="lg" weight="semibold">
              {data.title}
            </Text>
            <Text>Due {date}</Text>
          </View>
          {/**PROGRESS SECTION */}
          <View style={styles.progressSection}>
            {data.progress === "accepted" ? (
              <>
                <Text color="muted">{description}</Text>
                <View style={{ alignItems: "center" }}>
                  <Button onPress={handleUnaccept} disabled={unacceptLoading}>
                    Unaccept
                  </Button>
                </View>
              </>
            ) : data.progress === "paid" ? (
              <>
                <Text
                  color="green"
                  weight="semibold"
                  size="lg"
                  style={{ textAlign: "center" }}
                >
                  Payment received
                </Text>
              </>
            ) : data.progress === "cancelled" ? (
              <>
                <Text
                  color="muted"
                  weight="semibold"
                  size="lg"
                  style={{ textAlign: "center" }}
                >
                  Canceled
                </Text>
              </>
            ) : data.progress === "closed" ? (
              <>
                <Text
                  color="muted"
                  weight="semibold"
                  size="lg"
                  style={{ textAlign: "center" }}
                >
                  Closed
                </Text>
              </>
            ) : (
              <>
                <TrackingProgressBar progress={data.progress as any} />
                <Text color="muted">{description}</Text>
                <View style={{ alignItems: "center" }}>
                  {data.progress === "approved" ? (
                    <TrackJobStartButton
                      initiated_uuid={data.initiated_job_post_uuid}
                      progress={data.progress as any}
                    />
                  ) : data.progress === "in progress" ? (
                    <TrackJobCompleteButton
                      initiated_uuid={data.initiated_job_post_uuid}
                      progress={data.progress as any}
                    />
                  ) : null}
                </View>
              </>
            )}
          </View>
        </View>

        {/**CANCEL SECTION */}
        {data.progress === "approved" && (
          <View>
            <Separator />
            <TrackCancelButton initiated_uuid={data.initiated_job_post_uuid} />
          </View>
        )}

        {/**TRANSACTION ESTIMATE SECTION */}
        <Separator />
        <View style={styles.transactionSection}>
          <Text size="lg" weight="semibold">
            Transaction estimate
          </Text>
          <TrackTransactionEstimate data={estimateData} />
        </View>

        {/** LOCATION SECTION */}
        <Separator />
        <View style={styles.locationSection}>
          <View>
            <Text size="lg" weight="semibold">
              Job location
            </Text>
            <Text color="muted">Location is hidden until you are approved</Text>
          </View>
        </View>

        {/** YOUR LINKED SERVICE SECTION*/}
        {data.service_uuid && (
          <View style={styles.serviceSection}>
            <Text size="lg" weight="semibold">
              Your linked service
            </Text>

            <LoadingPost uuid={data.service_uuid} />

            <Text color="muted">
              You linked a service which is viewable to the employer. Their
              review will be applied to both you and your service.
            </Text>
          </View>
        )}

        {/** EMPLOYER SECTION */}
        <Separator />
        <View style={styles.employerSection}>
          <Text size="lg" weight="semibold">
            Hirer
          </Text>
          <Pressable
            onPress={() => {
              router.push(`/profile/${data.user_uuid}` as any);
            }}
          >
            <View style={styles.employerRow}>
              <Image
                source={
                  data.employer_avatar_url
                    ? { uri: data.employer_avatar_url }
                    : require("@/assets/images/default-avatar-icon.jpg")
                }
                style={{ borderRadius: 999, width: 40, height: 40 }}
              />
              <View style={{ gap: 4 }}>
                <Text weight="semibold">@{data.employer_username}</Text>
                <StarDisplay
                  rating={data.employer_avg_rating as unknown as number}
                  count={data.employer_review_count as unknown as number}
                />
              </View>

              <Button
                type="outline"
                borderColor="foreground"
                style={styles.messageButton}
                onPress={() =>
                  router.push(`/message/${(data as any).user_uuid}`)
                }
              >
                Message
              </Button>
            </View>
          </Pressable>
        </View>

        {/**REVIEW SECTION */}
        {(data as any).progress === "paid" && (
          <>
            <Separator />
            <TrackJobReviewSection
              initiated_uuid={data.initiated_job_post_uuid}
            />
          </>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: 0 },
  textHeader: {
    alignItems: "center",
    gap: 8,
  },
  topSection: {
    alignItems: "center",
    gap: 32,
    paddingVertical: 52,
  },
  progressSection: {
    gap: 32,
    width: "100%",
  },
  transactionSection: {
    gap: 8,
    paddingVertical: 52,
  },
  locationSection: {
    flexDirection: "row",
    paddingVertical: 52,
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  employerSection: {
    paddingVertical: 52,
    justifyContent: "space-between",
    gap: 12,
  },
  serviceSection: {
    paddingVertical: 52,
    justifyContent: "space-between",
    gap: 12,
    borderTopWidth: 1,
  },
  employerRow: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  messageButton: {
    marginLeft: "auto",
    paddingHorizontal: 16,
    gap: 12,
  },
});
