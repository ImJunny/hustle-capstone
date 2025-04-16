import {
  ChooseServiceHeader,
  SimpleHeader,
} from "@/components/headers/Headers";
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
import { Post } from "@/server/actions/post-actions";
import { Image } from "expo-image";
import ScrollView from "@/components/ui/ScrollView";
import LoadingScreen from "@/components/ui/LoadingScreen";

// Addresses screen
export default function ChooseJobScreen() {
  const themeColor = useThemeColor();
  const { user } = useAuthData();
  if (!user) return;

  const {
    data: jobs,
    isLoading,
    error,
    refetch,
  } = trpc.post.get_user_posts.useQuery({
    uuid: user.id,
    type: "work",
  });

  const { selected_job } = useLocalSearchParams();
  const [currentJob, setCurrentJob] = useState<Post | null>(
    selected_job ? JSON.parse(selected_job as string) : null
  );

  if (!jobs || isLoading || error) {
    return (
      <LoadingScreen
        refetch={refetch}
        data={jobs}
        loads={isLoading}
        errors={[error]}
        header={<SimpleHeader title="Link a job" />}
      />
    );
  }

  if (jobs.length == 0) {
    return (
      <>
        <SimpleHeader title="Link a job" />
        <View style={styles.centerPage}>
          <Text weight="semibold" size="2xl">
            No jobs added yet
          </Text>
          <Text>Add a job by clicking on the add button at the top</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <ChooseServiceHeader />
      <ScrollView style={{ flex: 1 }} color="base">
        <TouchableOpacity onPress={() => setCurrentJob(null)}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              height: 100,
              paddingHorizontal: 16,
              alignItems: "center",
              borderBottomWidth: 1,
            }}
            color="black"
          >
            <Text weight="semibold" size="lg">
              None
            </Text>
            <RadioButton value={null} selected={currentJob} disabled />
          </View>
        </TouchableOpacity>
        {jobs.map((job, i) => (
          <JobEntry
            key={i}
            job={job as Post}
            currentJob={currentJob}
            setCurrentJob={setCurrentJob}
          />
        ))}
      </ScrollView>
      <View
        color="background"
        style={[styles.footer, { borderColor: themeColor.border }]}
      >
        <Button
          style={{ alignSelf: "flex-end" }}
          onPress={() => {
            router.back();
            router.setParams({
              selected_job: JSON.stringify(currentJob),
            });
          }}
        >
          Select job
        </Button>
      </View>
    </>
  );
}

// Address entry components
type JobEntryProps = {
  job: Post;
  currentJob: Post | null;
  setCurrentJob: Dispatch<SetStateAction<Post | null>>;
};

function JobEntry({ job, currentJob, setCurrentJob }: JobEntryProps) {
  const themeColor = useThemeColor();
  return (
    <TouchableOpacity onPress={() => setCurrentJob(job)}>
      <View
        color="background"
        style={[styles.entry, { borderColor: themeColor.border }]}
      >
        <View style={{ flexDirection: "row", gap: 20 }}>
          <Image
            source={{ uri: job.image_url }}
            style={{ width: 68, height: 68, borderRadius: 4 }}
          />
          <View style={{ justifyContent: "center" }}>
            <Text weight="semibold" size="lg">
              {job.title}
            </Text>
          </View>
        </View>
        <RadioButton value={job.uuid} selected={currentJob?.uuid} disabled />
      </View>
    </TouchableOpacity>
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
    borderBottomWidth: 1,
    padding: 16,
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
  },
});
