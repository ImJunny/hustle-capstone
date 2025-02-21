import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React, { useEffect } from "react";
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
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function ProfileMainScreen() {
  const {
    data: ad,
    error: e,
    isLoading: l,
  } = useQuery({
    queryKey: ["a"],
    queryFn: async () => {
      const response = await axios.get("http://192.168.1.91:3000/test", {
        params: { b: "bro" },
      });
      return response.data; // Ensure we return only the response data
    },
  });

  useEffect(() => {
    // console.log({ ad, isLoading, error });
  }, [ad, e, l]);

  const { user } = useAuthData();
  const { data, error, isLoading } = useQuery<UserData>({
    queryKey: ["getUserData", user?.id], // Ensure proper caching
    queryFn: async () =>
      axios
        .get("http://localhost:3000/user/getUserData", {
          params: { uuid: user?.id }, // Pass uuid as query parameter
        })
        .then((res) => res.data), // Return only data
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
      <ProfileSelfHeader username={data?.username ?? ""} />
      <ScrollView color="background">
        <ProfileSelfCard data={data as UserData} />
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
