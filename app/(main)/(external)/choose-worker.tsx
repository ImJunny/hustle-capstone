import { SimpleHeader } from "@/components/headers/Headers";
import View from "@/components/ui/View";
import Text from "@/components/ui/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import LoadingView from "@/components/ui/LoadingView";
import Button from "@/components/ui/Button";
import RadioButton from "@/components/ui/RadioButton";
import { router, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { AcceptedUser } from "@/server/actions/jobs-actions";
import Icon from "@/components/ui/Icon";
import { formatDistanceToNow } from "date-fns";
import AvatarImage from "@/components/ui/AvatarImage";
import ScrollView from "@/components/ui/ScrollView";
import StarDisplay from "@/components/ui/StarDisplay";

// Addresses screen
export default function ChooseWorkerScreen() {
  const themeColor = useThemeColor();
  const { user } = useAuthData();
  const { job_post_uuid } = useLocalSearchParams();

  if (!user) return;

  const {
    data: workers,
    isLoading,
    refetch,
  } = trpc.job.get_accepted_users.useQuery(
    {
      job_post_uuid: job_post_uuid as string,
    },
    { enabled: !!job_post_uuid }
  );

  const [currentWorker, setCurrentWorker] = useState<AcceptedUser | null>(null);

  if (isLoading) {
    return (
      <>
        <SimpleHeader title="Approve a worker" />
        <LoadingView />
      </>
    );
  }

  if (!workers) {
    return (
      <>
        <SimpleHeader title="Approve a worker" />
        <View style={styles.centerPage}>
          <Text>Encountered an error getting accepted workers</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <SimpleHeader title="Approve a worker" />
      <ScrollView style={{ flex: 1 }} color="base" refetch={refetch}>
        <View style={{ padding: 16, borderBottomWidth: 1 }} color="background">
          <Text size="sm" color="muted">
            Below are a list of users who have accepted your job. You can view
            their profiles and linked services if provided. Users may unaccept
            jobs within 24 hours of the due date.
          </Text>
        </View>
        {workers.map((worker, i) => (
          <WorkerEntry
            key={i}
            worker={worker as unknown as AcceptedUser}
            currentWorker={currentWorker}
            setCurrentWorker={setCurrentWorker}
          />
        ))}
      </ScrollView>
      <View
        color="background"
        style={[styles.footer, { borderColor: themeColor.border }]}
      >
        <Text weight="semibold" size="lg">
          Step 1 of 2
        </Text>
        <Button
          disabled={!currentWorker}
          onPress={() => {
            router.push(
              `/confirm-approval?uuid=${job_post_uuid}&initiated_uuid=${currentWorker?.initiated_job_uuid}`
            );
          }}
        >
          Continue to approval
        </Button>
      </View>
    </>
  );
}

// Address entry components
type WorkerEntryProps = {
  worker: AcceptedUser;
  currentWorker: AcceptedUser | null;
  setCurrentWorker: Dispatch<SetStateAction<AcceptedUser | null>>;
};

function WorkerEntry({
  worker,
  currentWorker,
  setCurrentWorker,
}: WorkerEntryProps) {
  const formattedTimeAgo = formatDistanceToNow(worker.created_at, {
    addSuffix: true,
  })
    .replace("about", "")
    .replace("hours", "hrs")
    .replace("hour", "hr")
    .replace("minutes", "mins")
    .replace("minute", "min")
    .replace("seconds", "secs")
    .replace("second", "sec")
    .trim();

  return (
    <View
      color="background"
      style={{ padding: 16, borderBottomWidth: 1, gap: 8 }}
    >
      <View style={styles.entry}>
        <TouchableOpacity
          onPress={() => router.push(`/profile/${worker.user_uuid}`)}
        >
          <View style={{ flexDirection: "row", gap: 20 }}>
            <AvatarImage url={worker.user_avatar_url} size={70} />
            <View style={{ justifyContent: "center" }}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <Text weight="semibold" size="lg">
                  {worker.user_display_name}
                </Text>
                <Text color="muted" size="sm">
                  • {formattedTimeAgo}
                </Text>
              </View>

              <Text>@{worker.user_username}</Text>
              <StarDisplay
                rating={worker.avg_rating as number}
                count={worker.review_count as number}
              />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setCurrentWorker(worker)}
          style={{ flex: 1 }}
        >
          <View
            style={{
              flex: 1,
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <RadioButton
              value={worker.user_uuid}
              selected={currentWorker?.user_uuid}
              disabled
            />
          </View>
        </TouchableOpacity>
      </View>
      {(worker.service as any) && (
        <TouchableOpacity
          onPress={() => router.push(`/post/${(worker.service as any).uuid}`)}
        >
          <View
            style={{
              borderWidth: 1,
              paddingHorizontal: 16,
              borderRadius: 8,
              marginTop: 8,
              height: 70,
              justifyContent: "center",
            }}
          >
            <View
              style={{ flexDirection: "row", gap: 20, alignItems: "center" }}
            >
              <Image
                source={{ uri: (worker.service as any).image_url }}
                style={{ width: 40, height: 40, borderRadius: 4 }}
              />
              <View>
                <Text
                  size="lg"
                  weight="semibold"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {(worker.service as any).title}
                </Text>
                <Text size="sm">Linked service</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  centerPage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  entry: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  page: { padding: 16 },
  typeContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  buttonRow: { marginTop: 10, flexDirection: "row", gap: 16 },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  employerStarsRow: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    marginTop: 4,
  },
});
