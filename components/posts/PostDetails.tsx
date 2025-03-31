import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React, { useRef, useState, useEffect } from "react";
import { BackHeader, DetailsHeader } from "@/components/headers/Headers";
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
import { StyleSheet } from "react-native";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import PostDetailsButton from "./PostDetailsButton";
import Skeleton from "../ui/Skeleton";
import Toast from "react-native-toast-message";

export default function PostDetails({ uuid }: { uuid: string }) {
  const themeColor = useThemeColor();
  const { width } = Dimensions.get("window");
  const { user } = useAuthData();
  const { data, isLoading } = trpc.post.get_post_details_info.useQuery({
    uuid,
  });

  // State to track if post is saved
  const [isSaved, setIsSaved] = useState(false);
  const utils = trpc.useUtils();

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
  }, [combinedSavedPosts, data]);

  // Save post mutation
  const { mutate: savePostMutation } = trpc.post.save_post.useMutation({
    onSuccess: () => {
      setIsSaved(true);
      utils.post.get_saved_posts.invalidate();
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

    if (!data) return;

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

  // Sheet ref to open/close
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Modal state to open/close
  const [modalOpen, setModalOpen] = useState(false);

  // Fallback renders
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

  const handlePress = () => {
    if (data.type === "work") {
      router.push(`/accept/${data.uuid}` as any);
    }
  };

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
          <IconButton name="chatbubble-outline" size="2xl" flippedX />
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
      <View
        style={[styles.actionsRow, { borderColor: themeColor.border }]}
        color="background"
      >
        <View>
          <Text size="sm" weight="semibold">
            Base rate
          </Text>
          <Text weight="semibold" size="xl">
            ${data.min_rate}
            {data.max_rate && " - " + `$${data.max_rate}`}
          </Text>
        </View>
        <PostDetailsButton data={data as unknown as PostDetailsInfo} />
      </View>
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

const styles = StyleSheet.create({
  actionsRow: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
});
