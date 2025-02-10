import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { router } from "expo-router";
import Button from "@/components/ui/Button";
import ScrollView from "@/components/ui/ScrollView";
import { StyleSheet } from "react-native";
import RecentSuggestion from "@/components/explore/RecentSuggestion";

const recents = [
  { id: 1, recent: "Technology" },
  { id: 2, recent: "Health" },
  { id: 3, recent: "Finance" },
  { id: 4, recent: "Education" },
];

export default function ExploreScreen() {
  return (
    <>
      <View>
        {recents.map((suggestion, i) => (
          <RecentSuggestion
            key={suggestion.id}
            recent={suggestion.recent}
            style={{}}
          />
        ))}
      </View>
    </>
  );
}
