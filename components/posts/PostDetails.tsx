import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { DetailsHeader } from "@/components/headers/Headers";
import ScrollView from "@/components/ui/ScrollView";
import { Dimensions } from "react-native";
import { trpc } from "@/server/lib/trpc-client";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { Image } from "expo-image";
import PostDetailsDescriptionSection from "./PostDetailsDescriptionSection";
import PostDetailsEmployerSection from "./PostDetailsEmployerSection";
import { PostDetailsInfo, PostInfo } from "@/server/actions/post-actions";
import PostDetailsReviewsSection from "./PostDetailsReviewsSection";

export default function PostDetails({ uuid }: { uuid: string }) {
  const { width } = Dimensions.get("window");

  const { data, isLoading } = trpc.post.get_post_details_info.useQuery({
    uuid,
    type: "work",
  });

  if (isLoading) {
    return <LoadingScreen color="background" />;
  } else if (!data) {
    return (
      <View>
        <Text>Post not found.</Text>
      </View>
    );
  }

  return (
    <>
      <DetailsHeader />
      <ScrollView color="background">
        <Image
          style={{ width, height: width }}
          source={{
            uri: data.post_images[0].image_url,
          }}
        />
        <PostDetailsDescriptionSection
          data={data as unknown as PostDetailsInfo}
        />
        {data.type === "hire" && <PostDetailsReviewsSection />}
        <PostDetailsEmployerSection data={data as unknown as PostDetailsInfo} />
      </ScrollView>
    </>
  );
}
