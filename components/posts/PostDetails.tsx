import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React, { useRef, useState } from "react";
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
import Button from "../ui/Button";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";

// Component that renders post details by uuid; parent of sheet and modal
export default function PostDetails({ uuid }: { uuid: string }) {
  const themeColor = useThemeColor();
  const { width } = Dimensions.get("window");
  const { user } = useAuthData();
  const { data, isLoading } = trpc.post.get_post_details_info.useQuery({
    uuid,
  });

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
          {data.post_images.map((image, i) => (
            <Image
              key={i}
              style={{ width, height: width }}
              source={{ uri: image.image_url }}
            />
          ))}
        </ScrollView>
        <View
          style={{
            flexDirection: "row",
            gap: 16,
            paddingTop: 16,
            paddingHorizontal: 16,
            paddingBottom: 24,
          }}
          color="background"
        >
          <IconButton name="add-circle-outline" size="2xl" />
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
        <Button
          style={{ marginLeft: "auto" }}
          type="outline"
          borderColor="foreground"
        >
          Make offer
        </Button>
        <Button onPress={handlePress} style={{ marginLeft: 12 }}>
          {data.type === "work" ? "Accept job" : "Hire service"}
        </Button>
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
  },
});
