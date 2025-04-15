import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React, { useCallback, useState } from "react";
import ScrollView from "@/components/ui/ScrollView";
import CategoryCard from "@/components/explore/CategoryCard";
import { PanResponder, RefreshControl, StyleSheet } from "react-native";
import { ExploreHeader } from "@/components/headers/Headers";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeColor } from "@/hooks/useThemeColor";
import { explore_categories } from "@/constants/Data";
import { Image } from "expo-image";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/ui/LoadingScreen";
import Post from "@/components/posts/Post";
import { Post as TPost } from "@/server/actions/post-actions";
import Separator from "@/components/ui/Separator";

export default function ExploreScreen() {
  const themeColor = useThemeColor();
  const { user } = useAuthData();
  const { geocode: expoGeocode } = useAuthData();
  const { data, isLoading, error, refetch } =
    trpc.post.get_explore_posts.useQuery({
      uuid: user?.id!,
      geocode: expoGeocode ?? undefined,
    });
  const jobPosts = data?.jobs?.filter((post) => post.type === "work");
  const servicePosts = data?.services?.filter((post) => post.type === "hire");

  if (isLoading || !data) {
    return (
      <LoadingScreen
        loads={[isLoading]}
        errors={[error]}
        data={data}
        header={<ExploreHeader />}
      />
    );
  }

  return (
    <>
      <ExploreHeader />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refetch={refetch}
      >
        <View style={{ paddingBottom: 40 }}>
          <View style={{ height: 260 }}>
            <Image
              source={require("@/assets/images/explore/explore-hero.jpg")}
              style={{
                height: 260,
                position: "absolute",
                width: "100%",
                opacity: 0.8,
              }}
            />
            <View style={{ flex: 1, paddingTop: 70, paddingHorizontal: 16 }}>
              <LinearGradient
                colors={["transparent", themeColor.background]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{
                  left: 0,
                  right: 0,
                  height: 64,
                  bottom: 0,
                  position: "absolute",
                }}
              />
              <Text color="white" weight="semibold" size="3xl">
                Find what works for you.
              </Text>
              <Text color="white" size="lg" weight="semibold">
                Discover from many categories, jobs, services, and more.
              </Text>
            </View>
          </View>
          <ScrollView
            style={{
              paddingLeft: 16,
              position: "absolute",
              bottom: 0,
              gap: 16,
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <View style={{ flexDirection: "row", paddingRight: 16 }}>
              {explore_categories.map((category, i) => (
                <CategoryCard key={i} data={category} />
              ))}
            </View>
          </ScrollView>
        </View>
        <View>
          <Text size="xl" weight="bold" style={styles.sectionTitle}>
            Jobs you might like
          </Text>
          {jobPosts?.map((post, i) => (
            <Post key={i} data={post as unknown as TPost} />
          ))}
        </View>
        <View style={{ paddingHorizontal: 16 }}>
          <Separator />
        </View>

        <View>
          <Text size="xl" weight="bold" style={styles.sectionTitle}>
            Services suggested for you
          </Text>
          {servicePosts?.map((post, i) => (
            <Post key={i} data={post as unknown as TPost} />
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    marginTop: 26,
    marginBottom: 10,
    marginLeft: 16,
  },
});
