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

const categories = [
  { id: 1, title: "Tech" },
  { id: 2, title: "Health" },
  { id: 3, title: "Home Care" },
  { id: 4, title: "Food" },
  { id: 5, title: "Education" },
  { id: 6, title: "Gaming" },
];
export const suggestions = [
  {
    id: 1,
    title: "Yard Work",
    rate: "50+",
    rating: "4.5",
    tags: ["yardwork", "home"],
    distance: "< 10 mi",
    imageSource: "https://via.placeholder.com/100",
  },
  {
    id: 2,
    title: "Plumbing",
    rate: "215",
    rating: "5",
    tags: ["plumbing", "homecare"],
    distance: "< 15 mi",
    imageSource: "https://via.placeholder.com/100",
    status: "1 accepted",
  },
  {
    id: 3,
    title: "Painting",
    rate: "75+",
    rating: "2",
    tags: ["painting"],
    distance: "remote",
    imageSource: "https://via.placeholder.com/100",
  },
  {
    id: 4,
    title: "Paint a Meural",
    rate: "300+",
    rating: "3",
    tags: ["art", "painting"],
    distance: "< 25 mi",
    status: "10 accepted",
    imageSource: "https://via.placeholder.com/100",
  },
];
export default function ExploreScreen() {
  return (
    <>
      <ExploreHeader />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View>
          <Text
            size="xl"
            weight="semibold"
            style={styles.sectionTitle}
            onPress={() => router.push("/explore-recent")}
          >
            Top Categories
          </Text>
          <View style={{ backgroundColor: "red" }}>
            <ScrollView
              style={{ paddingLeft: 16 }}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {categories.map((category, i) => (
                <CategoryCard
                  key={category.id}
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
          {suggestions.map((suggestion, i) => (
            <JobPost
              key={suggestion.id}
              postID={suggestion.id}
              title={suggestion.title}
              rate={suggestion.rate}
              tags={suggestion.tags}
              distance={suggestion.distance}
              style={{
                borderBottomWidth: i != suggestions.length - 1 ? 1 : 0,
              }}
              status={suggestion.status}
            />
          ))}
        </View>
        <View>
          <Text size="xl" weight="bold" style={styles.sectionTitle}>
            Service Suggestions
          </Text>
          {suggestions.map((suggestion, i) => (
            <ServicePost
              key={suggestion.id}
              postID={suggestion.id}
              title={suggestion.title}
              rate={suggestion.rate}
              rating={suggestion.rating}
              tags={suggestion.tags}
              distance={suggestion.distance}
              style={{
                borderBottomWidth: i != suggestions.length - 1 ? 1 : 0,
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
