import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { getUserData, UserData } from "@/server/lib/user";
import { useAuthData } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { ProfileHeader } from "@/components/headers/Headers";
import { StyleSheet } from "react-native";
import Icon from "@/components/ui/Icon";
import { useThemeColor } from "@/hooks/useThemeColor";
import ScrollView from "@/components/ui/ScrollView";
import LoadingScreen from "@/components/ui/LoadingScreen";
import Button from "@/components/ui/Button";
import MiniPost from "@/components/posts/MiniPost";
import { exampleJobPosts } from "@/server/utils/example_data";
import ProfileMiniCard from "@/components/profile/ProfileMiniCard";
import ProfileCard from "@/components/profile/ProfileCard";

export default function ProfileMainScreen() {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;
  const { user } = useAuthData();
  const { data, error, isLoading } = useQuery({
    queryKey: ["userDataQuery", user],
    queryFn: () => getUserData(user?.id!),
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
      <ScrollView color="base">
        <ProfileCard data={data as UserData} />

        <View>
          <View
            style={[styles.sectionContainer, { borderColor }]}
            color="background"
          >
            <Text
              weight="semibold"
              size="xl"
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
              }}
            >
              Job posts (1)
            </Text>
            <MiniPost
              data={exampleJobPosts[0]}
              style={{
                borderTopWidth: 1,
                borderColor,
              }}
            />
          </View>
          <View
            style={[styles.sectionContainer, { borderColor }]}
            color="background"
          >
            <Text
              weight="semibold"
              size="xl"
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
              }}
            >
              Services (1)
            </Text>
            <MiniPost
              data={exampleJobPosts[0]}
              style={{
                borderTopWidth: 1,
                borderColor,
              }}
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    borderRadius: 8,
  },
});
