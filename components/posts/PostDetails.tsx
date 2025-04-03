import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React, { useRef, useState, useCallback, useEffect } from "react";
import ScrollView from "@/components/ui/ScrollView";
import { Dimensions } from "react-native";
import { trpc } from "@/server/lib/trpc-client";
import LoadingView from "@/components/ui/LoadingView";
import { Image } from "expo-image";
import PostDetailsDescriptionSection from "./PostDetailsDescriptionSection";
import { PostDetailsInfo } from "@/server/actions/post-actions";
import PostDetailsReviewsSection from "./PostDetailsReviewsSection";
import PostDetailsAboutUserSection from "./PostDetailsAboutUserSection";
import { useAuthData } from "@/contexts/AuthContext";
import BottomSheet from "@gorhom/bottom-sheet";
import PostDetailsSheet from "./PostDetailsSheet";
import PostDetailsDeleteModal from "./PostDetailsDeleteModal";
import IconButton from "../ui/IconButton";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import PostDetailsFooter from "./PostDetailsFooter";
import { usePostStore } from "@/hooks/usePostStore";
import { useCommentsStore } from "@/hooks/useCommentsStore";

export default function PostDetails({ uuid }: { uuid: string }) {
  const { user } = useAuthData();
  const utils = trpc.useUtils();
  const { width } = Dimensions.get("window");
  const { data, isLoading } = trpc.post.get_post_details_info.useQuery({
    uuid,
    user_uuid: user?.id as string,
  });

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

  const handleSaveToggle = useCallback(() => {
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
  const [modalOpen, setModalOpen] = useState(false);

  const setPostUUID = useCommentsStore((state) => state.setPostUUID);
  const commentsSheetRef = useCommentsStore((state) => state.commentsSheetRef);

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      runOnJS(handleSaveToggle)();
    });

  if (isLoading) {
    return (
      <>
        <View color="transparent" style={{ position: "absolute", zIndex: 1 }}>
          <View
            style={{
              borderTopRightRadius: 999,
              borderBottomRightRadius: 999,
              paddingVertical: 8,
              paddingLeft: 8,
              paddingRight: 16,
              marginTop: 4,
            }}
          >
            <IconButton name="arrow-back" onPress={() => router.back()} />
          </View>
        </View>
        <LoadingView color="background" />
      </>
    );
  } else if (!data) {
    return (
      <>
        <View color="transparent" style={{ position: "absolute", zIndex: 1 }}>
          <View
            style={{
              borderTopRightRadius: 999,
              borderBottomRightRadius: 999,
              paddingVertical: 8,
              paddingLeft: 8,
              paddingRight: 16,
              marginTop: 4,
            }}
          >
            <IconButton name="arrow-back" onPress={() => router.back()} />
          </View>
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Post not found.</Text>
        </View>
      </>
    );
  }

  return (
    <>
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

      <ScrollView color="base">
        <GestureDetector gesture={doubleTap}>
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
            size="2xl"
            onPress={handleSaveToggle}
          />
          <IconButton
            name="chatbubble-outline"
            size="2xl"
            flippedX
            onPress={() => commentsSheetRef?.current?.expand()}
          />
          <IconButton name="paper-plane-outline" size="2xl" />
          <IconButton
            name="ellipsis-vertical"
            size="2xl"
            style={{ marginLeft: "auto" }}
            onPress={() => bottomSheetRef.current?.expand()}
          />
        </View>

        <PostDetailsDescriptionSection
          data={data as unknown as PostDetailsInfo}
        />

        {data.type === "hire" && <PostDetailsReviewsSection />}
        <PostDetailsAboutUserSection
          data={data as unknown as PostDetailsInfo}
        />
      </ScrollView>
      <PostDetailsFooter data={data as unknown as PostDetailsInfo} />

      <PostDetailsSheet
        isSelf={data.user_uuid === user?.id}
        uuid={uuid}
        sheetRef={bottomSheetRef}
        setModalOpen={setModalOpen}
      />

      <PostDetailsDeleteModal
        uuid={uuid}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
    </>
  );
}
