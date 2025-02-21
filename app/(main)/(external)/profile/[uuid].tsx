import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { useAuthData } from "@/contexts/AuthContext";
import { ProfileHeader } from "@/components/headers/Headers";
import { StyleSheet, TouchableOpacity } from "react-native";
import ScrollView from "@/components/ui/ScrollView";
import LoadingScreen from "@/components/ui/LoadingScreen";
import {
  exampleJobPosts,
  exampleServicePosts,
} from "@/server/utils/example-data";
import ProfileCard from "@/components/profile/ProfileCard";
import ProfileSection from "@/components/profile/ProfileSection";
import Icon from "@/components/ui/Icon";
import { trpc } from "@/server/lib/trpcClient";
import { useLocalSearchParams } from "expo-router";
import { UserData } from "@/server/actions/user-actions";

export default function ProfileScreen() {
  const { uuid } = useLocalSearchParams();
  const { user } = useAuthData();
  const { data, error, isLoading } = trpc.user.getUserData.useQuery({
    uuid: user!.id, // change this later for actual users
  });

  if (error) {
    return (
      <View>
        <Text>User not found.</Text>
      </View>
    );
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <ProfileHeader username={data?.username ?? ""} />
      <ScrollView color="background">
        <ProfileCard data={data as UserData} />
        <View style={styles.contentContainer}>
          <ProfileSection title="Job posts" posts={[exampleJobPosts[0]]} />
          <ProfileSection title="Services" posts={[exampleServicePosts[0]]} />
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
