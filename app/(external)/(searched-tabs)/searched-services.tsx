import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { router } from "expo-router";
import { StyleSheet } from "react-native";
import SuggestionPost from "@/components/explore/SuggestionPost";
import Icon from "@/components/ui/Icon";

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
export default function searcheServices() {
  return (
    <View>
      <View style={styles.container}>
        <View style={styles.spacing}>
          <Icon name="heart-sharp" size="lg" />
        </View>
        <View style={styles.spacing}>
          <Text size="lg" style={{ marginRight: 80 }}>
            Save this search
          </Text>
        </View>
        <View style={styles.spacing}>
          <Text size="lg">Sort</Text>
        </View>
        <View style={styles.spacing}>
          <Icon
            name="swap-vertical-outline"
            size="lg"
            style={{ marginRight: 20 }}
          />
        </View>
        <View style={styles.spacing}>
          <Text size="lg">Filter</Text>
        </View>
        <View style={styles.spacing}>
          <Icon name="filter" size="lg" />
        </View>
      </View>
      {suggestions.map((suggestion, i) => (
        <SuggestionPost
          key={suggestion.id}
          title={suggestion.title}
          rate={suggestion.rate}
          rating={suggestion.rating}
          tags={suggestion.tags}
          distance={suggestion.distance}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flexDirection: "row",
    paddingVertical: 12,
    borderWidth: 1,
    borderBottomColor: "#272727",
  },
  spacing: {
    padding: 5,
  },
});
