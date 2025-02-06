import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { router } from "expo-router";
import ScrollView from "@/components/ui/ScrollView";
import CategoryCard from "@/components/explore/CategoryCard";
import { StyleSheet } from "react-native";
import SuggestionPost from "@/components/explore/SuggestionPost";

const categories = [
  { id: 1, title: "Tech" },
  { id: 2, title: "Health" },
  { id: 3, title: "Finance" },
  { id: 4, title: "Education" },
];
const suggestions = [
  {
    id: 1,
    title: "Yard Work",
    rate: "50+",
    rating: "4.5",
    tags: ["yardwork"],
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
  },
  {
    id: 3,
    title: "Painting",
    rate: "75+",
    rating: "2",
    tags: ["painting"],
    distance: "< 20 mi",
    imageSource: "https://via.placeholder.com/100",
  },
  {
    id: 4,
    title: "Shopping",
    rate: "50",
    rating: "3",
    tags: ["shopping"],
    distance: "< 25 mi",
    imageSource: "https://via.placeholder.com/100",
  },
];
export default function ExploreScreen() {
  return (
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
          <SuggestionPost
            key={suggestion.id}
            title={suggestion.title}
            rate={suggestion.rate}
            tags={suggestion.tags}
            distance={suggestion.distance}
            style={{
              borderBottomWidth: i != suggestions.length - 1 ? 1 : 0,
            }}
          />
        ))}
      </View>
      <View>
        <Text size="xl" weight="bold" style={styles.sectionTitle}>
          Service Suggestions
        </Text>
        {suggestions.map((suggestion, i) => (
          <SuggestionPost
            key={suggestion.id}
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
