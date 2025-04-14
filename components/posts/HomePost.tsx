import {
  StyleSheet,
  Dimensions,
  Pressable,
  TouchableOpacity,
} from "react-native";
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
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { usePostStore } from "@/hooks/usePostStore";
import { useCommentsStore } from "@/hooks/useCommentsStore";
import AvatarImage from "../ui/AvatarImage";
import StarDisplay from "../ui/StarDisplay";
import { useSharePostStore } from "@/hooks/useSharePostStore";

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

  // save/unsave animation
  const showLike = useSharedValue(0);
  const likeAnimatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(showLike.value, { duration: 200 }),
    transform: [
      { scale: withSpring(showLike.value ? 1 : 0.5, { damping: 12 }) },
    ],
  }));
  const handleSaveToggle = useCallback(() => {
    showLike.value = 1;
    setTimeout(() => {
      showLike.value = 0;
    }, 600);

    const newIsSaved = !isSaved;
    newIsSaved ? savePost(data.uuid) : unsavePost(data.uuid);
    const mutation = newIsSaved ? saveMutation : unsaveMutation;
    mutation.mutate(
      { post_uuid: data.uuid, user_uuid: user?.id! },
      {
        onSuccess: () => {},
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
  const setSharePostUUID = useSharePostStore((state) => state.setPostUUID);
  useEffect(() => {
    const postUUID = useCommentsStore.getState().postUUID;
    const sharePostUUID = useSharePostStore.getState().postUUID;
    if (!postUUID) setPostUUID(data.uuid);
    if (!sharePostUUID) setSharePostUUID(data.uuid);
  }, [data.uuid]);

  const commentsSheetRef = useCommentsStore((state) => state.commentsSheetRef);
  const sharePostSheetRef = useSharePostStore(
    (state) => state.sharePostSheetRef
  );

  function getGeneralDistance(distance: number | null) {
    if (data.location_type === "remote") return "remote";
    if (distance === null) return "local";

    distance = Math.ceil(distance);
    return `${distance} mi`;
  }
  const distance = getGeneralDistance((data.distance as number) ?? null);

  return (
    <GestureDetector gesture={doubleTap}>
      <View style={[styles.container, { height: postHeight }]} color="black">
        <Animated.View
          style={[
            {
              position: "absolute",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 100,
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            },
            likeAnimatedStyle,
          ]}
        >
          <Icon
            name={isSaved ? "add-circle" : "add-circle-outline"}
            size={100}
            color="white"
          />
        </Animated.View>
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
                        {distance}
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
                size={44}
                onPress={handleSaveToggle}
              />
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => {
                  setPostUUID(data.uuid);
                  commentsSheetRef?.current?.expand();
                }}
              >
                <Icon
                  name={"chatbubble-outline"}
                  color="white"
                  size="3xl"
                  flippedX
                />
                {data.comment_count > 0 && (
                  <Text
                    style={{ textAlign: "center", marginTop: 6 }}
                    weight="bold"
                    size="sm"
                  >
                    {data.comment_count}
                  </Text>
                )}
              </TouchableOpacity>

              <IconButton
                name={"paper-plane-outline"}
                style={styles.iconButton}
                color="white"
                size="3xl"
                onPress={() => {
                  setSharePostUUID(data.uuid);
                  sharePostSheetRef?.current?.snapToIndex(1);
                }}
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
              <AvatarImage url={data?.user_avatar_url} />
              <View style={styles.nameContainer}>
                <Text color="white" weight="semibold">
                  @{data.user_username}
                </Text>
                <StarDisplay
                  rating={data.avg_rating ?? 0}
                  count={data.review_count ?? 0}
                />
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
    alignItems: "center",
    marginRight: -4,
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
