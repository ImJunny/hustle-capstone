import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React, { useRef, useState, useCallback, useEffect } from "react";
import ScrollView from "@/components/ui/ScrollView";
import { Dimensions, TouchableOpacity } from "react-native";
import { trpc } from "@/server/lib/trpc-client";
import LoadingView from "@/components/ui/LoadingView";
import { Image } from "expo-image";
import { PostDetailsInfo } from "@/server/actions/post-actions";
import { useAuthData } from "@/contexts/AuthContext";
import BottomSheet from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { usePostStore } from "@/hooks/usePostStore";
import { useCommentsStore } from "@/hooks/useCommentsStore";
import { useSharePostStore } from "@/hooks/useSharePostStore";
import IconButton from "@/components/ui/IconButton";
import Icon from "@/components/ui/Icon";
import PostDetailsDescriptionSection from "@/components/posts/PostDetailsDescriptionSection";
import PostDetailsAboutUserSection from "@/components/posts/PostDetailsAboutUserSection";
import PostDetailsReviewsSection from "@/components/posts/PostDetailsReviewsSection";
import PostDetailsFooter from "@/components/posts/PostDetailsFooter";
import PostDetailsSheet from "@/components/posts/PostDetailsSheet";
import PostDetailsDeleteModal from "@/components/posts/PostDetailsDeleteModal";
import LoadingScreen from "@/components/ui/LoadingScreen";
import PostReportSheet from "@/components/posts/PostReportSheet";

export default function PostScreen() {
  const { uuid: postUuid } = useLocalSearchParams();
  const uuid = postUuid as string;
  const { user, geocode } = useAuthData();
  const utils = trpc.useUtils();
  const { width } = Dimensions.get("window");
  const { data, isLoading, refetch, error } =
    trpc.post.get_post_details_info.useQuery({
      uuid: uuid,
      user_uuid: user?.id as string,
      geocode: geocode ?? undefined,
    });

  const { mutate: markViewed } = trpc.post.mark_as_viewed_post.useMutation();
  useEffect(() => {
    if (user)
      markViewed({
        post_uuid: uuid,
        user_uuid: user?.id,
      });
  }, [uuid, user?.id, markViewed]);

  const saveMutation = trpc.post.save_post.useMutation();
  const unsaveMutation = trpc.post.unsave_post.useMutation();
  const savePost = usePostStore((state) => state.savePost);
  const unsavePost = usePostStore((state) => state.unsavePost);
  const isSaved = usePostStore((state) => state.isSavedPost(uuid));

  useEffect(() => {
    if (data?.is_liked) {
      savePost(data.uuid);
    }
  }, [data]);

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
    }, 700);

    const newIsSaved = !isSaved;
    newIsSaved ? savePost(uuid) : unsavePost(uuid);
    const mutation = newIsSaved ? saveMutation : unsaveMutation;
    mutation.mutate(
      { post_uuid: uuid, user_uuid: user?.id! },
      {
        onSuccess: () => utils.post.invalidate(),
        onError: (error) => {
          Toast.show({ text1: error.message, swipeable: false, type: "error" });
          newIsSaved ? unsavePost(uuid) : savePost(uuid);
        },
      }
    );
  }, [
    uuid,
    isSaved,
    saveMutation,
    unsaveMutation,
    utils,
    savePost,
    unsavePost,
    user?.id,
  ]);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const reportSheetRef = useRef<BottomSheet>(null);

  const [modalOpen, setModalOpen] = useState(false);

  const setPostUUID = useCommentsStore((state) => state.setPostUUID);
  const commentsSheetRef = useCommentsStore((state) => state.commentsSheetRef);
  const setSharePostUUID = useSharePostStore((state) => state.setPostUUID);
  const sharePostSheetRef = useSharePostStore(
    (state) => state.sharePostSheetRef
  );

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      runOnJS(handleSaveToggle)();
    });

  if (isLoading || !data || error) {
    return (
      <>
        <BackButton />
        <LoadingScreen data={data} errors={[error]} loads={isLoading} />
      </>
    );
  }

  return (
    <>
      <BackButton />
      <ScrollView color="base" refetch={refetch}>
        <GestureDetector gesture={doubleTap}>
          <View>
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
            <ScrollView
              horizontal
              pagingEnabled
              snapToInterval={width}
              snapToAlignment="center"
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
            >
              {data.images.map((image, i) => (
                <Image
                  key={i}
                  style={{ width, height: width }}
                  source={{ uri: image }}
                />
              ))}
            </ScrollView>
          </View>
        </GestureDetector>
        <View
          style={{
            flexDirection: "row",
            gap: 16,
            paddingTop: 16,
            paddingHorizontal: 16,
            paddingBottom: 16,
          }}
          color="background"
        >
          <IconButton
            name={isSaved ? "add-circle-sharp" : "add-circle-outline"}
            size={30}
            onPress={handleSaveToggle}
          />
          <TouchableOpacity
            style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
            onPress={() => {
              setPostUUID(uuid);
              commentsSheetRef?.current?.expand();
            }}
          >
            <Icon name="chatbubble-outline" size="xl" flippedX />
            {data.comment_count > 0 && (
              <Text style={{ textAlign: "center" }} weight="bold" size="sm">
                {data.comment_count}
              </Text>
            )}
          </TouchableOpacity>

          <IconButton
            name="paper-plane-outline"
            size="xl"
            onPress={() => {
              setSharePostUUID(uuid);
              sharePostSheetRef?.current?.snapToIndex(1);
            }}
          />
          <IconButton
            name="ellipsis-vertical"
            size="xl"
            style={{ marginLeft: "auto" }}
            onPress={() => bottomSheetRef.current?.expand()}
          />
        </View>

        <PostDetailsDescriptionSection
          data={data as unknown as PostDetailsInfo}
        />

        {data.type === "hire" && (
          <PostDetailsReviewsSection
            data={data as unknown as PostDetailsInfo}
          />
        )}
        <PostDetailsAboutUserSection
          data={data as unknown as PostDetailsInfo}
        />
      </ScrollView>
      <PostDetailsFooter data={data as unknown as PostDetailsInfo} />

      <PostDetailsSheet
        isSelf={data.user_uuid === user?.id}
        uuid={uuid}
        sheetRef={bottomSheetRef}
        reportSheetRef={reportSheetRef}
        setModalOpen={setModalOpen}
      />
      <PostReportSheet sheetRef={reportSheetRef} uuid={uuid} />
      <PostDetailsDeleteModal
        uuid={uuid}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
    </>
  );
}

function BackButton() {
  return (
    <View color="transparent" style={{ position: "absolute", zIndex: 1 }}>
      <View
        style={{
          borderTopRightRadius: 999,
          borderBottomRightRadius: 999,
          backgroundColor: "rgba(0,0,0,0.5)",
          paddingVertical: 8,
          paddingLeft: 8,
          paddingRight: 16,
          marginTop: 4,
        }}
      >
        <IconButton name="arrow-back" onPress={() => router.back()} />
      </View>
    </View>
  );
}
