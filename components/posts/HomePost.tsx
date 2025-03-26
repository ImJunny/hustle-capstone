import { StyleSheet, Dimensions, Pressable } from "react-native";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import Badge from "../ui/Badge";
import IconButton from "../ui/IconButton";
import Icon from "../ui/Icon";
import Button from "../ui/Button";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Device from "expo-device";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HomePost as THomePost } from "@/server/actions/post-actions";
import { Image } from "expo-image";
import { format, isThisYear } from "date-fns";
import { useAuthData } from "@/contexts/AuthContext";

export default function HomePost({ data }: { data: THomePost }) {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = Dimensions.get("window");
  const insetTop = Device.brand === "google" ? 0 : insets.top;
  const postHeight = windowHeight - 66 - 56 - insetTop - insets.bottom;
  function formatCustomDate(date: Date) {
    return isThisYear(date)
      ? format(date, "MMMM d")
      : format(date, "MMMM d, yyyy");
  }
  const distance = getGeneralDistance(parseInt(data.distance));
  function getGeneralDistance(distance: number) {
    if (distance <= 1) return 1;
    else if (distance <= 5) return 5;
    else if (distance <= 10) return 10;
    else if (distance <= 15) return 15;
    else if (distance <= 20) return 20;
    else if (distance <= 25) return 25;
    else if (distance <= 50) return 50;
    return 51;
  }

  const { user } = useAuthData();

  return (
    <View style={[styles.container, { height: postHeight }]} color="black">
      <View
        style={{
          height: postHeight * 0.75,
        }}
      >
        <Image
          source={{ uri: data.image_url }}
          style={{ width: "100%", height: "100%" }}
        />
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
          flex: 1,
          bottom: 0,
          padding: 16,
          position: "absolute",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1, alignSelf: "flex-end" }}>
            <View style={styles.textContainer}>
              <Text
                style={{ marginVertical: 4 }}
                color="white"
                size="2xl"
                weight="semibold"
              >
                {data.title}
              </Text>
              {data.due_date && (
                <Text size="lg" color="white" weight="semibold">
                  Due {formatCustomDate(new Date(data.due_date))}
                </Text>
              )}
            </View>
            <View style={styles.middleContainer}>
              <View style={styles.descriptionContainer}>
                <Text weight="semibold" size="4xl" color="white">
                  ${data.min_rate}
                  {data.max_rate && "+"}
                </Text>
                <View style={styles.badgeRow}>
                  <Badge>
                    <Text
                      style={{ textTransform: "uppercase" }}
                      size="sm"
                      weight="semibold"
                    >
                      {data.type}
                    </Text>
                  </Badge>
                  <Badge>
                    <Text size="sm" weight="semibold">
                      {data.location_type === "remote"
                        ? "remote"
                        : data.distance
                        ? `< ${distance} mi`
                        : "local"}
                    </Text>
                  </Badge>
                </View>
                <Text numberOfLines={3} ellipsizeMode="tail" color="white">
                  {data.description}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.iconButtonsContainer}>
            <IconButton
              name={"add-circle-outline"}
              style={styles.iconButton}
              color="white"
              size="2xl"
            />
            <View style={styles.iconButton}>
              <IconButton
                name={"chatbubble-outline"}
                color="white"
                size="2xl"
                flippedX
              />
              {/* {data.comments && (
                <Text
                  style={{ textAlign: "center", marginTop: 2 }}
                  weight="semibold"
                  color="white"
                >
                  {data.comments}
                </Text>
              )} */}
            </View>

            <IconButton
              name={"paper-plane-outline"}
              style={styles.iconButton}
              color="white"
              size="2xl"
            />
          </View>
        </View>

        <Pressable
          onPress={() => {
            if (data.user_uuid === user?.id) {
              router.push("/profile-main");
            } else router.push(`/profile/${data.user_uuid}` as any);
          }}
        >
          <View style={styles.bottomContainer}>
            <Image
              source={
                data?.avatar_url
                  ? {
                      uri: data.avatar_url,
                    }
                  : require("@/assets/images/default-avatar-icon.jpg")
              }
              style={{ width: 40, height: 40, borderRadius: 999 }}
            />
            <View style={styles.nameContainer}>
              <Text color="white" weight="semibold">
                @{data.user_username}
              </Text>
              <View
                style={{ flexDirection: "row", gap: 4, alignItems: "center" }}
              >
                <Icon name={"star"} color="white" />
                <Icon name={"star"} color="white" />
                <Icon name={"star"} color="white" />
                <Icon name={"star"} color="white" />
                <Icon name={"star"} color="white" />
                <Text style={{ marginLeft: 4 }} size="sm">
                  1
                </Text>
              </View>
            </View>
            <Button
              style={styles.viewButton}
              onPress={() => router.push(`/post/${data.uuid}` as any)}
            >
              <Text color="black" weight="semibold">
                View
              </Text>
            </Button>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textContainer: {},
  descriptionContainer: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    marginBottom: 8,
    gap: 8,
  },
  iconButton: { paddingBottom: 20 },
  middleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  iconButtonsContainer: {
    marginLeft: 20,
    marginTop: "auto",
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 8,
  },
  nameContainer: { marginLeft: 20, gap: 4 },
  viewButton: {
    marginLeft: "auto",
    backgroundColor: "white",
    paddingHorizontal: 30,
  },
});
