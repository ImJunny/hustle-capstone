import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import ScrollView from "@/components/ui/ScrollView";
import CategoryCard from "@/components/explore/CategoryCard";
import { StyleSheet } from "react-native";
import { ExploreHeader } from "@/components/headers/Headers";
import {
  categories,
  exampleJobPosts,
  exampleServicePosts,
} from "@/server/utils/example-data";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeColor } from "@/hooks/useThemeColor";
import Post from "@/components/posts/Post";
import { router } from "expo-router";

export default function ExploreScreen() {
  const themeColor = useThemeColor();
  return (
    <>
      <ExploreHeader />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        color="base"
      >
        <View style={{ paddingBottom: 40 }}>
          <View style={{ height: 260 }}>
            <ImagePlaceholder
              width={600}
              height={260}
              style={{ height: "100%", position: "absolute" }}
              isDark
            />
            <View style={{ flex: 1, paddingTop: 70, paddingHorizontal: 16 }}>
              <LinearGradient
                colors={["transparent", themeColor.base]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{
                  left: 0,
                  right: 0,
                  height: 30,
                  bottom: 0,
                  position: "absolute",
                }}
              />
              <Text
                color="white"
                weight="semibold"
                size="3xl"
                onPress={() =>
                  router.push(
                    "/(main)/(external)/(explore-tabs)/explore-recent"
                  )
                }
              >
                Find the right job for you.
              </Text>
              <Text color="white" size="lg">
                Discover from many categories, jobs, services, and more.
              </Text>
            </View>
          </View>
          <ScrollView
            style={{
              paddingHorizontal: 16,
              position: "absolute",
              bottom: 0,
              gap: 16,
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {categories.map((category, i) => (
              <CategoryCard key={i} title={category.title} />
            ))}
          </ScrollView>
        </View>

        <View>
          <Text
            size="xl"
            weight="bold"
            style={styles.sectionTitle}
            onPress={() =>
              router.push("/(main)/(external)/(searched-tabs)/searched-jobs")
            }
          >
            Jobs you might like
          </Text>
          {/* {exampleJobPosts.map((post, i) => (
            <Post
              key={i}
              data={post}
              style={{
                borderTopWidth: i == 0 ? 1 : 0,
                borderBottomWidth: 1,
              }}
            />
          ))} */}
        </View>
        <View>
          <Text size="xl" weight="bold" style={styles.sectionTitle}>
            Services suggested for you
          </Text>
          {/* {exampleServicePosts.map((post, i) => (
            <Post
              key={i}
              data={post}
              style={{
                borderTopWidth: i == 0 ? 1 : 0,
                borderBottomWidth: i != exampleServicePosts.length - 1 ? 1 : 0,
              }}
            />
          ))} */}
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
