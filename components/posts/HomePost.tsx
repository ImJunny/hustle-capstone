import { StyleSheet, Dimensions, Pressable } from "react-native";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React, { useState, useEffect, useRef } from "react";
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

export default function HomePost({ data }: { data: THomePost }) {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = Dimensions.get("window");
  const insetTop = Device.brand === "google" ? 0 : insets.top;
  const postHeight = windowHeight - 66 - 56 - insetTop - insets.bottom;
  const { user } = useAuthData();
  const utils = trpc.useUtils();

  // State to track if post is saved
  const [isSaved, setIsSaved] = useState(false);

  // Check if post is saved initially
  const { data: savedPosts } = trpc.post.get_saved_posts.useQuery(
    { user_uuid: user?.id || "", type: "work" },
    { enabled: !!user }
  );
  const { data: savedHirePosts } = trpc.post.get_saved_posts.useQuery(
    { user_uuid: user?.id || "", type: "hire" },
    { enabled: !!user }
  );

  const combinedSavedPosts = [...(savedPosts || []), ...(savedHirePosts || [])];

  useEffect(() => {
    if (combinedSavedPosts && data) {
      const isPostSaved = combinedSavedPosts.some(
        (post) => post.uuid === data.uuid
      );
      setIsSaved(isPostSaved);
    }
  }, [combinedSavedPosts, data.uuid]);

  // Save post mutation
  const { mutate: savePostMutation } = trpc.post.save_post.useMutation({
    onSuccess: () => {
      setIsSaved(true);
      utils.post.get_saved_posts.invalidate();
      utils.post.get_post_details_info.invalidate({ uuid: data.uuid });
    },
    onError: (error) => {
      Toast.show({
        text1: error.message,
        swipeable: false,
        type: "error",
      });
      setIsSaved(false);
    },
  });

  // Unsave post mutation
  const { mutate: unsavePostMutation } = trpc.post.unsave_post.useMutation({
    onSuccess: () => {
      setIsSaved(false);
      utils.post.get_saved_posts.invalidate();
      utils.post.get_post_details_info.invalidate({ uuid: data.uuid });
    },
    onError: (error) => {
      Toast.show({
        text1: error.message,
        swipeable: false,
        type: "error",
      });
      setIsSaved(true);
    },
  });

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSaveToggle = () => {
    if (!user) {
      Toast.show({
        text1: "You need to be logged in to save posts",
        type: "error",
      });
      return;
    }

    const newIsSaved = !isSaved;
    setIsSaved(newIsSaved);

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (newIsSaved) {
        savePostMutation({
          post_uuid: data.uuid,
          user_uuid: user.id,
        });
      } else {
        unsavePostMutation({
          post_uuid: data.uuid,
          user_uuid: user.id,
        });
      }
    }, 300);
  };

  function formatCustomDate(date: Date) {
    return isThisYear(date)
      ? format(date, "MMMM d")
      : format(date, "MMMM d, yyyy");
  }

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      runOnJS(handleSaveToggle)();
    });

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
