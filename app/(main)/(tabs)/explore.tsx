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
import { categories, exampleJobPosts } from "@/server/utils/example_data";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

export default function ExploreScreen() {
  return (
    <>
      <ExploreHeader />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        color="base"
      >
        <View>
          <Text
            size="xl"
            weight="semibold"
            style={styles.sectionTitle}
            onPress={() => router.push("/explore-recent")}
          >
            Top Categories
          </Text>
          <View>
            <ScrollView
              style={{ paddingLeft: 16 }}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {categories.map((category, i) => (
                <CategoryCard
                  key={i}
                  title={category.title}
                  style={{ paddingRight: i != categories.length - 1 ? 0 : 16 }}
                />
              ))}
            </ScrollView>
          </View>
        </View>
        <View>
          <Text size="xl" weight="bold" style={styles.sectionTitle}>
            Job Suggestions
          </Text>
          {exampleJobPosts.map((post, i) => (
            <JobPost
              key={i}
              data={post}
              style={{
                borderBottomWidth: i != exampleJobPosts.length - 1 ? 1 : 0,
              }}
            />
          ))}
        </View>
        <View>
          <Text size="xl" weight="bold" style={styles.sectionTitle}>
            Service Suggestions
          </Text>
          {exampleJobPosts.map((post, i) => (
            <ServicePost
              key={i}
              data={post}
              style={{
                borderBottomWidth: i != exampleJobPosts.length - 1 ? 1 : 0,
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
    marginTop: 20,
  },
});
