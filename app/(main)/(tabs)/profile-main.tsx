import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { useAuthData } from "@/contexts/AuthContext";
import { StyleSheet, TouchableOpacity } from "react-native";
import ScrollView from "@/components/ui/ScrollView";
import LoadingScreen from "@/components/ui/LoadingScreen";

import {
  exampleJobPosts,
  exampleServicePosts,
} from "@/server/utils/example-data";
import ProfileSelfCard from "@/components/profile/ProfileSelfCard";
import ProfileSection from "@/components/profile/ProfileSection";
import Icon from "@/components/ui/Icon";
import { ProfileSelfHeader } from "@/components/headers/Headers";
import { UserData } from "@/server/actions/user-actions";
import { trpc } from "@/server/lib/trpc-client";
import { UserJobPost } from "@/server/actions/post-actions";

export default function ProfileMainScreen() {
  const { user } = useAuthData();
  if (!user?.id) return;
  const { data, error, isLoading } = trpc.user.get_user_data.useQuery({
    uuid: user.id,
  });

  const { data: jobPosts, isLoading: jobPostsLoading } =
    trpc.post.get_user_job_posts.useQuery({
      uuid: user.id,
    });

  if (error) {
    return (
      <View>
        <Text>User not found.</Text>
      </View>
    );
  }

  if (isLoading || jobPostsLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <ProfileSelfHeader username={data?.username ?? ""} />
      <ScrollView color="background">
        <ProfileSelfCard data={data as unknown as UserData} />
        <View style={styles.contentContainer}>
          <ProfileSection
            title="Job posts"
            posts={jobPosts as unknown as UserJobPost[]}
          />
          {/* <ProfileSection title="Services" posts={[exampleServicePosts[0]]} /> */}
          <TouchableOpacity style={styles.completedContainer}>
            <Text size="xl" weight="semibold">
              Completed • 5
            </Text>
            <Icon name="chevron-forward" size="xl" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 16,
  },
  completedContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
});
