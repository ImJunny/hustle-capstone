import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { router } from "expo-router";
import ScrollView from "@/components/ui/ScrollView";
import CategoryCard from "@/components/explore/CategoryCard";
import { StyleSheet } from "react-native";
import JobPost from "@/components/posts/JobPost";
import { ExploreHeader } from "@/components/headers/Headers";
import ServicePost from "@/components/posts/ServicePost";
import {
  categories,
  exampleJobPosts,
  exampleServicePosts,
} from "@/server/utils/example_data";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import ImageBackgroundPlaceholder from "@/components/ui/ImageBackgroundPlaceholder";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function ExploreScreen() {
  const themeColor = useThemeColor();
  return (
    <>
      <ExploreHeader />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        color="background"
      >
        <View style={{ paddingBottom: 40 }}>
          <View style={{ height: 260 }}>
            <ImagePlaceholder
              width={600}
              height={260}
              style={{ height: "100%", position: "absolute" }}
              isDark
            />
            <View style={{ flex: 1, paddingTop: 40, paddingHorizontal: 16 }}>
              <LinearGradient
                colors={["transparent", themeColor.background]}
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
              <Text color="white" weight="semibold" size="3xl">
                Explore
              </Text>
              <Text color="white" weight="semibold" size="xl">
                Find the right job for you.
              </Text>
            </View>
          </View>
          <ScrollView
            style={{ paddingLeft: 16, position: "absolute", bottom: 0 }}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            {categories.map((category, i) => (
              <CategoryCard
                key={i}
                title={category.title}
                style={{
                  paddingRight: i != categories.length - 1 ? 0 : 16,
                }}
              />
            ))}
          </ScrollView>
        </View>

        <View>
          <Text size="xl" weight="bold" style={styles.sectionTitle}>
            Jobs you might like
          </Text>
          {exampleJobPosts.map((post, i) => (
            <JobPost
              key={i}
              data={post}
              style={{
                borderTopWidth: i == 0 ? 1 : 0,
                borderBottomWidth: 1,
              }}
            />
          ))}
        </View>
        <View>
          <Text size="xl" weight="bold" style={styles.sectionTitle}>
            Services suggested for you
          </Text>
          {exampleServicePosts.map((post, i) => (
            <ServicePost
              key={i}
              data={post}
              style={{
                borderTopWidth: i == 0 ? 1 : 0,
                borderBottomWidth: i != exampleServicePosts.length - 1 ? 1 : 0,
              }}
            />
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
    marginBottom: 8,
    marginLeft: 16,
    marginTop: 40,
  },
});
