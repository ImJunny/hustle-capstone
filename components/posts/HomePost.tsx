import { StyleSheet, Dimensions, Pressable } from "react-native";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React, { useState, useCallback, useEffect, useMemo } from "react";
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
import { trpc } from "@/server/lib/trpc-client";
import Toast from "react-native-toast-message";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { usePostStore } from "@/hooks/usePostStore";
import { useCommentsStore } from "@/hooks/useCommentsStore";

function HomePost({ data }: { data: THomePost }) {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = Dimensions.get("window");
  const insetTop = Device.brand === "google" ? 0 : insets.top;
  const postHeight = windowHeight - 66 - 56 - insetTop - insets.bottom;
  const { user } = useAuthData();
  const utils = trpc.useUtils();

  const savePost = usePostStore((state) => state.savePost);
  const unsavePost = usePostStore((state) => state.unsavePost);
  const isSaved = usePostStore((state) => state.isSavedPost(data.uuid));

  const saveMutation = trpc.post.save_post.useMutation();
  const unsaveMutation = trpc.post.unsave_post.useMutation();

  const handleSaveToggle = useCallback(() => {
    const newIsSaved = !isSaved;
    newIsSaved ? savePost(data.uuid) : unsavePost(data.uuid);

    const mutation = newIsSaved ? saveMutation : unsaveMutation;
    mutation.mutate(
      { post_uuid: data.uuid, user_uuid: user?.id! },
      {
        onSuccess: () => utils.post.invalidate(),
        onError: (error) => {
          Toast.show({ text1: error.message, swipeable: false, type: "error" });
          newIsSaved ? unsavePost(data.uuid) : savePost(data.uuid);
        },
      }
    );
  }, [
    data.uuid,
    isSaved,
    saveMutation,
    unsaveMutation,
    utils,
    savePost,
    unsavePost,
    user?.id,
  ]);

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      runOnJS(handleSaveToggle)();
    });

  function formatCustomDate(date: Date) {
    return isThisYear(date)
      ? format(date, "MMMM d")
      : format(date, "MMMM d, yyyy");
  }

  const setPostUUID = useCommentsStore((state) => state.setPostUUID);
  const commentsSheetRef = useCommentsStore((state) => state.commentsSheetRef);

  return (
    <GestureDetector gesture={doubleTap}>
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
            style={styles.gradient}
          />
        </View>
        <View style={styles.infoContainer}>
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
                    {data.max_rate && " - " + `$${data.max_rate}`}
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
                        {data.location_type === "remote" ? "remote" : "local"}
                      </Text>
                    </Badge>
                    {data.tags?.map((tag, i) => (
                      <Badge key={i}>
                        <Text size="sm" weight="semibold">
                          {tag}
                        </Text>
                      </Badge>
                    ))}
                  </View>
                  <Text numberOfLines={3} ellipsizeMode="tail" color="white">
                    {data.description}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.iconButtonsContainer}>
              <IconButton
                name={isSaved ? "add-circle-sharp" : "add-circle-outline"}
                style={styles.iconButton}
                color="white"
                size="2xl"
                onPress={handleSaveToggle}
              />
              <View style={styles.iconButton}>
                <IconButton
                  name={"chatbubble-outline"}
                  color="white"
                  size="2xl"
                  flippedX
                  onPress={() => {
                    setPostUUID(data.uuid);
                    commentsSheetRef?.current?.snapToIndex(2);
                  }}
                />
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
                  data?.user_avatar_url
                    ? {
                        uri: data.user_avatar_url,
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
    </GestureDetector>
  );
}
export default React.memo(HomePost);
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
  gradient: {
    left: 0,
    right: 0,
    height: 250,
    bottom: -2,
    position: "absolute",
  },
  infoContainer: {
    flex: 1,
    bottom: 0,
    padding: 16,
    position: "absolute",
  },
});
