import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { BackHeader, DetailsHeader } from "@/components/headers/Headers";
import ScrollView from "@/components/ui/ScrollView";
import { Dimensions, FlatList, StyleSheet } from "react-native";
import { trpc } from "@/server/lib/trpc-client";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { Image } from "expo-image";
import PostDetailsDescriptionSection from "./PostDetailsDescriptionSection";
import { PostDetailsInfo } from "@/server/actions/post-actions";
import PostDetailsReviewsSection from "./PostDetailsReviewsSection";
import PostDetailsAboutUserSection from "./PostDetailsAboutUserSection";

export default function PostDetails({
  uuid,
  type,
}: {
  uuid: string;
  type: "work" | "hire";
}) {
  const { width } = Dimensions.get("window");

  const { data, isLoading } = trpc.post.get_post_details_info.useQuery({
    uuid,
  });

  if (isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <BackHeader />
        <LoadingScreen color="background" />
      </View>
    );
  } else if (!data) {
    return (
      <View style={{ flex: 1 }}>
        <BackHeader />
        <Text>Post not found.</Text>
      </View>
    );
  }

  return (
    <>
      <DetailsHeader />
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
    </>
  );
}
