import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SimpleHeader } from "@/components/headers/Headers";
import ScrollView from "@/components/ui/ScrollView";
import { Pressable, StyleSheet, TouchableOpacity } from "react-native";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { useThemeColor } from "@/hooks/useThemeColor";
import TrackingProgressBar from "@/components/posts/TrackProgressBar";
import Separator from "@/components/ui/Separator";
import TrackTransactionEstimate from "@/components/posts/TrackTransactionEstimate";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import LoadingView from "@/components/ui/LoadingView";
import { Image } from "expo-image";
import { format, isThisYear } from "date-fns";
import Toast from "react-native-toast-message";

export default function TrackWorkingDetailsScreen() {
  const { uuid } = useLocalSearchParams();
  const { user } = useAuthData();
  const utils = trpc.useUtils();
  const themeColor = useThemeColor();

  const {
    data = null,
    isLoading,
    error,
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

  let progressDescription =
    "This job post is public for anyone to accept. Approve a worker to proceed.";

  if (isLoading || estimateLoading || !data) {
    return (
      <>
        <SimpleHeader title="Tracking details" />
        <LoadingView />
      </>
    );
  } else if (error || estimateError) {
    return (
      <>
        <SimpleHeader title="Tracking details" />
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text>Encountered an error getting job information</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <SimpleHeader title="Tracking details" />
      <ScrollView color="background" style={styles.container}>
        <View style={styles.progressSection}>
          <TouchableOpacity
            onPress={() => router.push(`/post/${data.job_post_uuid}`)}
          >
            <Image
              source={{ uri: data.job_image_url }}
              style={{ width: 100, height: 100 }}
            />
          </TouchableOpacity>

          <View style={styles.textHeader}>
            <Text size="xl" weight="semibold">
              {data.title}
            </Text>
            <Text>Due {formattedDueDate}</Text>
          </View>

          {data.is_approved ? (
            <>
              <TrackingProgressBar progress="accepted" />
              <Text color="muted">{progressDescription}</Text>
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
                      <Text color="muted">{progressDescription}</Text>
                    </View>
                    <Icon name="chevron-forward" size="xl" />
                  </View>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        <Separator />

        <View style={styles.transactionSection}>
          <Text size="lg" weight="semibold">
            Transaction estimate
          </Text>
          <TrackTransactionEstimate data={estimateData} />
        </View>

        <Separator />

        <View style={styles.locationSection}>
          <View>
            <Text size="lg" weight="semibold">
              Job location
            </Text>
            {/* <Text color="muted">
              {`308 Negra Arroyo Lane\nAlbuquerque, New Mexico\n87104`}
            </Text> */}
            <Text color="muted">
              Location is hidden to everyone except the approved worker.
            </Text>
          </View>

          {/* <Button type="variant">View in Maps</Button> */}
        </View>

        {data.is_approved && (
          <Pressable
            onPress={() => {
              router.push(`/profile/${(data as any).user_uuid}` as any);
            }}
          >
            <View style={styles.employerSection}>
              <Text size="lg" weight="semibold">
                Worker
              </Text>
              <View style={styles.employerRow}>
                <Image
                  source={
                    (data as any).user_avatar_url
                      ? { uri: (data as any).user_avatar_url }
                      : require("@/assets/images/default-avatar-icon.jpg")
                  }
                  style={{ borderRadius: 999, width: 40, height: 40 }}
                />
                <View style={{ gap: 4 }}>
                  <Text weight="semibold">@{(data as any).user_username}</Text>
                  <View style={styles.employerStarsRow}>
                    <Icon name="star" />
                    <Icon name="star" />
                    <Icon name="star" />
                    <Icon name="star" />
                    <Icon name="star" />
                    <Text size="sm" style={{ marginLeft: 4 }}>
                      4
                    </Text>
                  </View>
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
            </View>
          </Pressable>
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
