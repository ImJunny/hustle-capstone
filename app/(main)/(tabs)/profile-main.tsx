import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { getUserData } from "@/server/lib/user";
import { useAuthData } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { ProfileHeader } from "@/components/headers/Headers";
import { StyleSheet } from "react-native";
import Icon from "@/components/ui/Icon";
import { useThemeColor } from "@/hooks/useThemeColor";
import ScrollView from "@/components/ui/ScrollView";
import { Skeleton } from "moti/skeleton";

export default function ProfileMainScreen() {
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

  const themeColor = useThemeColor();
  return (
    <>
      <ProfileHeader username={data?.username ?? ""} isLoading={isLoading} />
      <ScrollView color="base">
        <View
          style={[styles.profileCard, { borderColor: themeColor.border }]}
          color="background"
        >
          <View style={styles.profileCardTop}>
            <Skeleton show={isLoading} radius={999}>
              <View
                style={{ borderRadius: 999, width: 96, height: 96 }}
                color="muted"
              />
            </Skeleton>
            <View style={styles.nameContainer}>
              <Skeleton show={isLoading} width={"80%"}>
                <Text color="foreground" size="2xl" weight="semibold">
                  {data?.first_name} {data?.last_name}
                </Text>
              </Skeleton>
              <Skeleton show={isLoading} width={"80%"}>
                <View
                  style={{ flexDirection: "row", gap: 4, alignItems: "center" }}
                >
                  <Icon name={"star"} color="foreground" />
                  <Text color="foreground" weight="semibold">
                    5/5 (7 Reviews)
                  </Text>
                </View>
              </Skeleton>
            </View>
          </View>
          <Skeleton show={isLoading}>
            <Text>{data?.bio}</Text>
          </Skeleton>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    padding: 16,
    paddingBottom: 28,
    gap: 24,
    borderBottomWidth: 1,
  },
  profileCardTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameContainer: { marginLeft: 20, gap: 4, flex: 1 },
});
