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

// Component that renders post details by uuid; parent of sheet and modal
export default function PostDetails({ uuid }: { uuid: string }) {
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
        <BackHeader />
        <LoadingView color="background" />
      </>
    );
  } else if (!data) {
    return (
      <>
        <BackHeader />
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
      <DetailsHeader sheetRef={bottomSheetRef} />
      <ScrollView color="background">
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

        <PostDetailsDescriptionSection
          data={data as unknown as PostDetailsInfo}
        />
        {data.type === "hire" && <PostDetailsReviewsSection />}
        <PostDetailsAboutUserSection
          data={data as unknown as PostDetailsInfo}
        />
      </ScrollView>

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
