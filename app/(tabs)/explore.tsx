import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { router } from "expo-router";
import Button from "@/components/ui/Button";
import ScrollView from "@/components/ui/ScrollView";
import CategoryCard from "@/components/explore/CategoryCard";
import { StyleSheet } from "react-native";
import SuggestionPost from "@/components/explore/SuggestionPost";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";

const categories = [
  { id: 1, title: "Technology" },
  { id: 2, title: "Health" },
  { id: 3, title: "Finance" },
  { id: 4, title: "Education" },
];
const suggestions = [
  {
    id: 1,
    title: "Yard Work",
    rate: "$50-150",
    rating: "⭐ 4.5/5",
    tags: ["Yardwork"],
    distance: "within 10 miles",
    imageSource: "https://via.placeholder.com/100",
  },
  {
    id: 2,
    title: "Plumbing",
    rate: "$215-250",
    rating: "⭐ 5/5",
    tags: ["Plumbing"],
    distance: "within 15 miles",
    imageSource: "https://via.placeholder.com/100",
  },
  {
    id: 3,
    title: "Painting",
    rate: "$75-100",
    rating: "⭐ 2/5",
    tags: ["Painting"],
    distance: "within 20 miles",
    imageSource: "https://via.placeholder.com/100",
  },
  {
    id: 4,
    title: "Shopping",
    rate: "$50-125",
    rating: "⭐ 3/5",
    tags: ["Shopping"],
    distance: "within 25 miles",
    imageSource: "https://via.placeholder.com/100",
  },
];
export default function ExploreScreen() {
  return (
    <ScrollView style={styles.container} color="base">
      <View style={styles.leftMargin} color="base">
        <Text
          size="xl"
          weight="semibold"
          color="white"
          style={{ marginBottom: 8 }}
        >
          Top Categories
        </Text>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {categories.map((category, i) => (
            <CategoryCard key={category.id} title={category.title} style={{}} />
          ))}
        </ScrollView>
      </View>
      <View>
        <View style={styles.leftMargin} color="base">
          <Text
            size="xl"
            weight="bold"
            color="white"
            style={{ marginBottom: 8 }}
          >
            Job Suggestions
          </Text>
        </View>
        {suggestions.map((suggestion, i) => (
          <SuggestionPost
            key={suggestion.id}
            title={suggestion.title}
            rate={suggestion.rate}
            rating={suggestion.rating}
            tags={suggestion.tags}
            distance={suggestion.distance}
            imageSource={{
              uri: `https://picsum.photos/100/100?${Math.random()}`,
            }}
          />
        ))}
      </View>
      <View>
        <View style={styles.leftMargin} color="base">
          <Text
            size="xl"
            weight="bold"
            color="white"
            style={{ marginBottom: 8 }}
          >
            Service Suggestions
          </Text>
        </View>
        {suggestions.map((suggestion, i) => (
          <SuggestionPost
            key={suggestion.id}
            title={suggestion.title}
            rate={suggestion.rate}
            rating={suggestion.rating}
            tags={suggestion.tags}
            distance={suggestion.distance}
            imageSource={{
              uri: `https://picsum.photos/100/100?${Math.random()}`,
            }}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  leftMargin: {
    marginLeft: 16,
    marginBottom: 16,
    marginTop: 16,
  },
});
