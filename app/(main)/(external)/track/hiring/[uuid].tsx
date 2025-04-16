import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SimpleHeader } from "@/components/headers/Headers";
import ScrollView from "@/components/ui/ScrollView";
import { Pressable, StyleSheet, TouchableOpacity } from "react-native";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import TrackingProgressBar from "@/components/tracking/TrackProgressBar";
import Separator from "@/components/ui/Separator";
import TrackTransactionEstimate from "@/components/tracking/TrackTransactionEstimate";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import { Image } from "expo-image";
import { format, isThisYear } from "date-fns";
import LoadingPost from "@/components/posts/LoadingPost";
import StarDisplay from "@/components/ui/StarDisplay";
import { TrackHiringLabels } from "@/constants/Tracking";
import LoadingScreen from "@/components/ui/LoadingScreen";
import TrackCancelButton from "@/components/tracking/TrackCancelButton";
import TrackJobPayNowButton from "@/components/tracking/TrackJobPayNowButton";
import TrackJobReviewSection from "@/components/tracking/TrackJobReviewSection";

export default function TrackHiringDetailsScreen() {
  const { uuid, param_type } = useLocalSearchParams();
  const { user } = useAuthData();

  const {
    data = null,
    isLoading,
    error,
    refetch,
  } = trpc.job.get_track_hiring_details.useQuery(
    {
      user_uuid: user?.id!,
      job_post_uuid: uuid as string,
    },
    { enabled: !!user }
  );

  const formattedDueDate = data?.due_date
    ? isThisYear(new Date(data!.due_date!))
      ? format(new Date(data?.due_date!), "MMMM d")
      : format(new Date(data?.due_date!), "MMMM d, yyyy")
    : null;

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

  const [init, setInit] = useState(() => {
    return (param_type as string) ?? data?.worker_data?.progress;
  });
  useEffect(() => {
    if (data?.worker_data?.progress) {
      setInit(data.worker_data.progress);
    }
  }, [param_type, data?.worker_data?.progress]);

  const description =
    data?.worker_data || init
      ? TrackHiringLabels[init as keyof typeof TrackHiringLabels]
      : "";

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

  return (
    <>
      <SimpleHeader title="Tracking details" />
      <ScrollView color="background" style={styles.container} refetch={refetch}>
        <View style={styles.progressSection}>
          <TouchableOpacity
            onPress={() => router.push(`/post/${data.job_post_uuid}`)}
          >
            <Image
              source={{ uri: data.job_image_url }}
              style={{ width: 100, height: 100, borderRadius: 4 }}
            />
          </TouchableOpacity>

          <View style={styles.textHeader}>
            <Text size="xl" weight="semibold">
              {data.title}
            </Text>
            <Text>Due {formattedDueDate}</Text>
          </View>
          {data?.worker_data ? (
            <>
              {init === "cancelled" ? (
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
              ) : init === "closed" ? (
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
              ) : init == "approved" ||
                init == "in progress" ||
                init == "complete" ? (
                <>
                  <TrackingProgressBar progress={(init as any) ?? "approved"} />
                  <View style={{ alignSelf: "flex-start" }}>
                    <Text color="muted">{description}</Text>
                  </View>
                  {init === "complete" && (
                    <TrackJobPayNowButton
                      rate={estimateData.rate}
                      initiated_uuid={data?.worker_data?.initiated_uuid}
                    />
                  )}
                </>
              ) : init == "paid" ? (
                <Text color="green" weight="semibold" size="lg">
                  Payment sent
                </Text>
              ) : null}
            </>
          ) : (
            <>
              <Separator />
              <View>
                <TouchableOpacity
                  onPress={() =>
                    router.push(`/choose-worker/?job_post_uuid=${uuid}` as any)
                  }
                  style={styles.linker}
                >
                  <Text
                    weight="semibold"
                    size="lg"
                    style={{ marginRight: "auto" }}
                  >
                    Approve a worker
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 12,
                      alignItems: "center",
                    }}
                  >
                    <View style={{ flex: 1, gap: 4 }}>
                      <Text size="2xl" weight="semibold">
                        {data.accepted_count as number} Accepted
                      </Text>
                      <Text color="muted">
                        This job post is public for anyone to accept. Approve a
                        worker to proceed.
                      </Text>
                    </View>
                    <Icon name="chevron-forward" size="xl" />
                  </View>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/**CANCEL SECTION */}
        {init === "approved" && (
          <View>
            <Separator />
            <TrackCancelButton
              initiated_uuid={data?.worker_data?.initiated_uuid as string}
            />
          </View>
        )}

        {/**TRANSACTION ESTIMATE SECTION */}
        <Separator />
        <View style={styles.transactionSection}>
          <Text size="lg" weight="semibold">
            Transaction estimate
          </Text>
          <TrackTransactionEstimate data={estimateData} type="approve" />
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

        {/** WORKER LINKED SERVICE SECTION*/}
        {data.worker_data && (
          <>
            {data.worker_data.service_uuid && (
              <View style={styles.serviceSection}>
                <Text size="lg" weight="semibold">
                  Their linked service
                </Text>

                <LoadingPost uuid={data.worker_data?.service_uuid} />

                <Text color="muted">
                  They linked a service for the job. Your review for their job
                  will apply to their service.
                </Text>
              </View>
            )}

            {/** WORKER SECTION */}
            <Separator />
            <View style={styles.employerSection}>
              <Text size="lg" weight="semibold">
                Worker
              </Text>
              <Pressable
                onPress={() => {
                  router.push(`/profile/${data.worker_data?.user_uuid}` as any);
                }}
              >
                <View style={styles.employerRow}>
                  <Image
                    source={
                      data.worker_data?.avatar_url
                        ? { uri: data.worker_data?.avatar_url }
                        : require("@/assets/images/default-avatar-icon.jpg")
                    }
                    style={{ borderRadius: 999, width: 40, height: 40 }}
                  />
                  <View style={{ gap: 4 }}>
                    <Text weight="semibold">@{data.worker_data.username}</Text>
                    <StarDisplay
                      rating={data.worker_data.avg_rating}
                      count={data.worker_data.review_count}
                    />
                  </View>

                  <Button
                    type="outline"
                    borderColor="foreground"
                    style={styles.messageButton}
                    onPress={() =>
                      router.push(`/message/${data.worker_data?.user_uuid}`)
                    }
                  >
                    Message
                  </Button>
                </View>
              </Pressable>
            </View>
          </>
        )}

        {/**REVIEW SECTION */}
        {init === "paid" && (
          <>
            <Separator />
            <TrackJobReviewSection
              initiated_uuid={data.worker_data?.initiated_uuid as string}
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
  progressSection: {
    alignItems: "center",
    gap: 32,
    paddingVertical: 52,
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
    borderTopWidth: 1,
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
  employerStarsRow: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  messageButton: {
    marginLeft: "auto",
    paddingHorizontal: 16,
    gap: 12,
  },
  linker: {
    marginTop: 10,
    borderWidth: 1,
    alignItems: "center",
    width: "100%",
    gap: 12,
  },
});
