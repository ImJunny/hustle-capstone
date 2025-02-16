import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ReviewHeader } from "@/components/headers/Headers";
import { StyleSheet, TouchableOpacity } from "react-native";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import IconButton from "@/components/ui/IconButton";
import { exampleReview } from "@/server/utils/example_data";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthData } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { getUserData } from "@/server/lib/user";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { LinearGradient } from "expo-linear-gradient";

export default function ReviewScreen() {
  const { id } = useLocalSearchParams();
  const review = exampleReview.find((review) => review.uuid === id);
  const themeColor = useThemeColor();
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
  console.log(user);
  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!review) {
    return <Text>review not found</Text>;
  }
  return (
    <>
      <ReviewHeader username={data?.username ?? ""} />
      <View>
        <ImagePlaceholder width={800} height={320} />
        <LinearGradient
          colors={["rgb(0, 0, 0)", "transparent"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={{
            left: 0,
            right: 0,
            height: 250,
            bottom: -2,
            position: "absolute",
          }}
        />
      </View>
      <View
        style={{
          padding: 15,
          borderBottomColor: "grey",
          borderBottomWidth: 2,
        }}
      >
        <View style={styles.bottomContainer}>
          <View
            style={{
              borderRadius: 999,
              width: 50,
              height: 50,
            }}
            color="muted"
          />
          <View style={styles.nameContainer}>
            <Text color="white" weight="semibold">
              {review.user_name} | {review.date}
            </Text>

            <View
              style={{ flexDirection: "row", gap: 4, alignItems: "center" }}
            >
              <Icon name={"star"} color="white"></Icon>

              <Text color="white" weight="semibold">
                4.5/5
              </Text>
              <View style={styles.userTypeContainer}>
                <Text color="muted" weight="semibold">
                  Employer
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{ flexDirection: "row", marginVertical: 15, marginBottom: 15 }}
        >
          <Text numberOfLines={15} ellipsizeMode="tail" color="muted-dark">
            {review.description}
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 8,
  },
  nameContainer: { marginLeft: 20 },
  viewButton: {
    marginLeft: "auto",
    backgroundColor: "grey",
    paddingHorizontal: 30,
  },
  userTypeContainer: {
    marginLeft: 60,
  },
});
